import React, { useRef, useEffect, useCallback, useState } from 'react';
import * as THREE from 'three';
import { CheckCircle, RotateCcw, Zap } from 'lucide-react';
import { useLocale } from '@/hooks/useI18n';
import {
	ParkingBarrier3DProps,
	COLORS,
	SETTINGS,
	CAMERA_POSITIONS,
	OperationMode,
	OPERATION_MODE_NAMES,
} from './constants';
import {
	createRenderer,
	createLights,
	createGround,
	createBarrier,
	isWebGLSupported,
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

// 운행 모드별 아이콘 컴포넌트 매핑
const getOperationModeIcon = (mode: OperationMode, className?: string) => {
	const iconProps = { className: className || 'w-4 h-4' };

	switch (mode) {
		case 'always-open':
			return <CheckCircle {...iconProps} />;
		case 'auto-operation':
			return <RotateCcw {...iconProps} />;
		case 'bypass':
			return <Zap {...iconProps} />;
		default:
			return <CheckCircle {...iconProps} />;
	}
};

const ParkingBarrier3D: React.FC<ParkingBarrier3DProps> = ({
	width = 280,
	height = 320,
	isOpen = false,
	onToggle,
	showControls = true,
	className = '',
	animationDuration = SETTINGS.DEFAULT_ANIMATION_DURATION,
	viewAngle = 'diagonal',
	operationMode = 'auto-operation',
	onOperationModeChange,
}) => {
	const { isRTL } = useLocale();
	// 3D 캔버스와 버튼 간 hover 상태 공유
	const [isHovering, setIsHovering] = useState(false);
	// 버튼 비활성화 상태 (1초 딜레이)
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);
	// 운행 모드 드롭다운 상태
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
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

		// WebGL 지원 여부 확인
		if (!isWebGLSupported()) {
			console.warn('WebGL is not supported. Rendering fallback UI.');
			if (mountRef.current) {
				mountRef.current.innerHTML = `
					<div style="
						width: ${width}px; 
						height: ${height}px; 
						display: flex; 
						align-items: center; 
						justify-content: center; 
						background-color: var(--surface-2); 
						border-radius: 8px; 
						color: var(--muted-foreground);
						font-size: 14px;
					">
						WebGL 미지원 브라우저
					</div>
				`;
			}
			return;
		}

		try {
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

			// WebGL 컨텍스트 손실 이벤트 처리
			renderer.domElement.addEventListener('webglcontextlost', (e) => {
				e.preventDefault();
				console.warn('WebGL context lost. Barrier3D will try to recover.');
				if (animationIdRef.current) {
					cancelAnimationFrame(animationIdRef.current);
				}
			});

			renderer.domElement.addEventListener('webglcontextrestored', () => {
				console.log('WebGL context restored. Reinitializing Barrier3D.');
				// 컨텍스트 복구 시 재초기화
				isInitializedRef.current = false;
			});

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
					try {
						rendererRef.current.render(sceneRef.current, cameraRef.current);
					} catch (error) {
						console.error('Barrier3D render error:', error);
						// 렌더링 에러 시 애니메이션 중단
						if (animationIdRef.current) {
							cancelAnimationFrame(animationIdRef.current);
						}
					}
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
		} catch (error) {
			console.error('Barrier3D initialization error:', error);
			// 초기화 실패 시 fallback 렌더링
			if (mountRef.current) {
				mountRef.current.innerHTML = `
					<div style="
						width: ${width}px; 
						height: ${height}px; 
						display: flex; 
						align-items: center; 
						justify-content: center; 
						background-color: var(--surface-2); 
						border-radius: 8px; 
						color: var(--muted-foreground);
						font-size: 14px;
					">
						3D 차단기 로드 실패
					</div>
				`;
			}
		}
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

	// 1초 딜레이가 포함된 토글 핸들러
	const handleToggleWithDelay = useCallback(() => {
		if (isButtonDisabled || !onToggle) return;

		setIsButtonDisabled(true);
		handleToggle();

		setTimeout(() => {
			setIsButtonDisabled(false);
		}, 1000);
	}, [isButtonDisabled, onToggle, handleToggle]);

	// 운행 모드 변경 핸들러
	const handleOperationModeChange = useCallback(
		(mode: OperationMode) => {
			console.log('운행 모드 변경:', mode, '현재:', operationMode);
			if (onOperationModeChange) {
				onOperationModeChange(mode);
			}
		},
		[onOperationModeChange, operationMode]
	);

	// 드롭다운 외부 클릭 감지
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		};

		if (isDropdownOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isDropdownOpen]);

	return (
		<div className={`flex flex-col gap-2 items-center ${className}`}>
			<div
				ref={mountRef}
				onClick={
					onToggle && !isButtonDisabled ? handleToggleWithDelay : undefined
				}
				onMouseEnter={() =>
					onToggle && !isButtonDisabled && setIsHovering(true)
				}
				onMouseLeave={() => setIsHovering(false)}
				className={`flex items-center justify-center p-2 overflow-hidden rounded-3xl neu-flat ${
					onToggle && !isButtonDisabled
						? 'cursor-pointer hover:neu-raised'
						: isButtonDisabled
							? 'cursor-not-allowed opacity-60 pointer-events-none'
							: ''
				}`}
				style={
					{
						width: `${width + 16}px`,
						height: `${height + 16}px`,
						minWidth: `${width + 16}px`,
						minHeight: `${height + 16}px`,
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
				<div className="flex flex-col gap-1 items-center">
					{/* 컨트롤 영역 - 2x2 그리드 */}
					<div className="grid grid-cols-2 gap-1 px-1 w-full">
						{/* 좌측 컬럼: 운행 모드 */}
						<div className="flex flex-col items-center gap-0.5">
							<h4 className="text-xs font-medium text-muted-foreground">
								운행모드
							</h4>
							<div ref={dropdownRef} className="relative">
								<button
									onClick={(e) => {
										e.stopPropagation();
										setIsDropdownOpen(!isDropdownOpen);
									}}
									className="flex items-center gap-1 px-2 py-1 text-xs font-medium neu-raised rounded-lg min-w-[80px] min-h-[28px]">
									{getOperationModeIcon(operationMode, 'w-4 h-4')}
									<span className="text-xs">
										{OPERATION_MODE_NAMES[operationMode]}
									</span>
									<svg
										className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</button>

								{/* 드롭다운 메뉴 */}
								{isDropdownOpen && (
									<div className={`absolute top-full mt-0.5 py-0.5 neu-flat rounded-lg bg-white shadow-lg border z-10 min-w-[120px] ${
										isRTL ? 'right-0' : 'left-0'
									}`}>
										{(
											Object.entries(OPERATION_MODE_NAMES) as [
												OperationMode,
												string,
											][]
										).map(([mode, label]) => (
											<button
												key={mode}
												onClick={(e) => {
													e.stopPropagation();
													console.log('드롭다운 아이템 클릭:', mode);
													handleOperationModeChange(mode);
													setIsDropdownOpen(false);
												}}
												className={`w-full flex items-center gap-1 px-2 py-0.5 text-xs hover:bg-muted/50 transition-colors ${
													operationMode === mode
														? 'bg-primary/10 text-primary'
														: 'text-foreground/80'
												}`}>
												{getOperationModeIcon(mode, 'w-4 h-4')}
												<span className="font-medium">{label}</span>
											</button>
										))}
									</div>
								)}
							</div>
						</div>

						{/* 우측 컬럼: 차단기 개폐 */}
						<div className="flex flex-col items-center gap-0.5">
							<h4 className="text-xs font-medium text-muted-foreground">
								차단기 개폐
							</h4>
							<button
								onClick={handleToggleWithDelay}
								disabled={!onToggle || isButtonDisabled}
								onMouseEnter={() => setIsHovering(true)}
								onMouseLeave={() => setIsHovering(false)}
								style={{ width: '80px' }}
								className={`flex items-center justify-center gap-1 px-2 py-1 rounded-lg font-medium neu-raised min-h-[28px] ${
									!onToggle || isButtonDisabled
										? 'opacity-50 cursor-not-allowed'
										: ''
								} ${isButtonDisabled ? 'animate-pulse' : ''}`}>
								{isButtonDisabled ? (
									<span className="text-xs">...</span>
								) : isOpen ? (
									<>
										<TripleChevronDown
											className="w-4 h-4"
											isHovering={isHovering}
										/>
										<span className="text-xs">닫기</span>
									</>
								) : (
									<>
										<TripleChevronUp
											className="w-4 h-4"
											isHovering={isHovering}
										/>
										<span className="text-xs">열기</span>
									</>
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ParkingBarrier3D;
// #endregion
