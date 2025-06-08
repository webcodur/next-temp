import React, { useRef, useEffect, useCallback, useState } from 'react';
import * as THREE from 'three';
import {
	ParkingBarrier3DProps,
	COLORS,
	SETTINGS,
	CAMERA_POSITIONS,
} from './constants';
import {
	createRenderer,
	createLights,
	createGround,
	createBarrier,
} from './scene';
import { createToggleHandler } from './animation';
import { TripleChevronUp, TripleChevronDown } from './icons';

// #region 메인 컴포넌트
/**
 * 3D 주차장 차단기 컴포넌트
 * - Three.js로 구현된 3D 차단기 시뮬레이션
 * - 3가지 시점 지원 (대각선, 운전자, 보안카메라)
 * - 애니메이션 차단기 동작
 * - 뉴모피즘 스타일 컨트롤 UI
 */
const ParkingBarrier3D: React.FC<ParkingBarrier3DProps> = ({
	width = 150,
	height = 180,
	isOpen = false,
	onToggle,
	showControls = true,
	className = '',
	animationDuration = SETTINGS.DEFAULT_ANIMATION_DURATION,
	viewAngle = 'diagonal',
}) => {
	// 3D 캔버스와 버튼 간 hover 상태 공유
	const [isHovering, setIsHovering] = useState(false);
	const mountRef = useRef<HTMLDivElement>(null);
	const barrierArmRef = useRef<THREE.Group | null>(null);
	const armMaterialRef = useRef<THREE.MeshPhongMaterial | null>(null);
	const ledMaterialRef = useRef<THREE.MeshPhongMaterial | null>(null);
	const animationIdRef = useRef<number | null>(null);
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
	const sceneRef = useRef<THREE.Scene | null>(null);
	const isInitializedRef = useRef(false);

	// 리사이즈 핸들러 - 의존성 없이 안정적으로 유지
	const handleResize = useCallback(() => {
		if (rendererRef.current && cameraRef.current && mountRef.current) {
			const container = mountRef.current;
			const rect = container.getBoundingClientRect();
			const actualWidth = rect.width - 32; // padding 제외
			const actualHeight = rect.height - 32; // padding 제외

			// 카메라 종횡비 업데이트
			cameraRef.current.aspect = actualWidth / actualHeight;
			cameraRef.current.updateProjectionMatrix();

			// 렌더러 크기 업데이트
			rendererRef.current.setSize(actualWidth, actualHeight);
			// 픽셀 비율 재설정 (확대/축소 시에도 선명함 유지)
			rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 3));
		}
	}, []);

	// 씬 초기화 - 한 번만 실행
	useEffect(() => {
		if (isInitializedRef.current) return;

		const scene = new THREE.Scene();
		scene.background = new THREE.Color(COLORS.BACKGROUND);
		sceneRef.current = scene;

		// viewAngle에 따른 카메라 위치 설정
		const cameraConfig = CAMERA_POSITIONS[viewAngle];
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
		camera.position.set(...cameraConfig.position);
		camera.lookAt(...cameraConfig.lookAt);
		cameraRef.current = camera;

		const renderer = createRenderer(width, height);
		rendererRef.current = renderer;

		if (mountRef.current) {
			while (mountRef.current.firstChild) {
				mountRef.current.removeChild(mountRef.current.firstChild);
			}
			mountRef.current.appendChild(renderer.domElement);
		}

		createLights(scene);
		createGround(scene);
		createBarrier(scene, isOpen, ledMaterialRef, armMaterialRef, barrierArmRef);

		const animate = () => {
			animationIdRef.current = requestAnimationFrame(animate);
			if (rendererRef.current && cameraRef.current && sceneRef.current) {
				rendererRef.current.render(sceneRef.current, cameraRef.current);
			}
		};
		animate();

		// 리사이즈 이벤트 리스너 추가
		window.addEventListener('resize', handleResize);
		// 초기 리사이즈 호출
		setTimeout(handleResize, 100);

		isInitializedRef.current = true;

		// cleanup에서 사용할 현재 mount 참조를 미리 저장
		const currentMount = mountRef.current;

		return () => {
			if (animationIdRef.current) {
				cancelAnimationFrame(animationIdRef.current);
			}
			window.removeEventListener('resize', handleResize);
			if (currentMount?.contains(renderer.domElement)) {
				currentMount.removeChild(renderer.domElement);
			}
			renderer.dispose();
			isInitializedRef.current = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // 의도적으로 빈 의존성 배열 - 초기화는 한 번만 실행

	// viewAngle 변경 시 카메라 위치만 업데이트
	useEffect(() => {
		if (cameraRef.current && isInitializedRef.current) {
			const cameraConfig = CAMERA_POSITIONS[viewAngle];
			cameraRef.current.position.set(...cameraConfig.position);
			cameraRef.current.lookAt(...cameraConfig.lookAt);
		}
	}, [viewAngle]);

	// isOpen 상태 변경 시 차단기 상태만 업데이트 - 초기화 시에만
	useEffect(() => {
		if (
			sceneRef.current &&
			isInitializedRef.current &&
			!barrierArmRef.current
		) {
			// 최초 한 번만 차단기 생성
			createBarrier(
				sceneRef.current,
				isOpen,
				ledMaterialRef,
				armMaterialRef,
				barrierArmRef
			);
		}
	}, [isOpen]);

	// 크기 변경 시 렌더러와 카메라만 업데이트
	useEffect(() => {
		if (rendererRef.current && cameraRef.current && isInitializedRef.current) {
			rendererRef.current.setSize(width, height);
			cameraRef.current.aspect = width / height;
			cameraRef.current.updateProjectionMatrix();
		}
	}, [width, height]);

	const handleToggle = createToggleHandler(
		isOpen,
		animationDuration,
		barrierArmRef,
		armMaterialRef,
		ledMaterialRef,
		onToggle
	);

	return (
		<div className={`flex flex-col items-center gap-6 ${className}`}>
			<div
				ref={mountRef}
				onClick={onToggle ? handleToggle : undefined}
				onMouseEnter={() => onToggle && setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}
				className={`flex items-center justify-center p-4 overflow-hidden rounded-3xl neu-flat ${onToggle ? 'cursor-pointer' : ''}`}
				style={
					{
						width: `${width + 32}px`,
						height: `${height + 32}px`,
						minWidth: `${width + 32}px`,
						minHeight: `${height + 32}px`,
						// 확대/축소에 대응하는 CSS 설정
						imageRendering:
							'crisp-edges' as React.CSSProperties['imageRendering'],
						// GPU 가속 활성화
						transform: 'translateZ(0)',
						willChange: 'transform',
					} as React.CSSProperties
				}
			/>
			{showControls && (
				<div className="flex flex-col items-center gap-4">
					{/* 동작 버튼 */}
					<button
						onClick={handleToggle}
						disabled={!onToggle}
						onMouseEnter={() => setIsHovering(true)}
						onMouseLeave={() => setIsHovering(false)}
						className={`group flex items-center justify-center gap-3 px-6 h-12 rounded-2xl font-medium neu-raised ${
							!onToggle ? 'opacity-50 cursor-not-allowed' : ''
						}`}>
						{isOpen ? (
							<>
								<TripleChevronDown
									className="w-5 h-5"
									isHovering={isHovering}
								/>
								차단기 닫기
							</>
						) : (
							<>
								<TripleChevronUp className="w-5 h-5" isHovering={isHovering} />
								차단기 열기
							</>
						)}
					</button>

					{/* 상태 표시 */}
					<div className="flex items-center gap-4 px-6 py-3 neu-inset rounded-2xl">
						<div
							className="w-3 h-3 rounded-full"
							style={{
								background: isOpen
									? 'linear-gradient(135deg, #4ade80, #22c55e)'
									: 'linear-gradient(135deg, #f87171, #ef4444)',
								boxShadow: isOpen
									? '0 2px 4px rgba(34, 197, 94, 0.3)'
									: '0 2px 4px rgba(239, 68, 68, 0.3)',
							}}
						/>
						<span className="text-sm font-medium">
							{isOpen ? '열림' : '닫힘'}
						</span>
					</div>
				</div>
			)}
		</div>
	);
};

export default ParkingBarrier3D;
// #endregion
