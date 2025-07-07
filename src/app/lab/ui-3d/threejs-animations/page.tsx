/*
  파일명: src/app/lab/ui-3d/threejs-animations/page.tsx
  기능: Three.js를 사용한 기본적인 3D 애니메이션(회전, 이동, 크기/색상 변경)을 시연하는 페이지
  책임: 사용자가 선택한 애니메이션 유형에 따라 3D 객체를 렌더링하고, 재생/정지 및 속도 조절 기능을 제공한다.
*/

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { useTranslations } from '@/hooks/useI18n';

// #region 타입
type AnimationType = 'rotation' | 'position' | 'scale' | 'color' | 'combined';
// #endregion

export default function AnimationsPage() {
	// #region 훅
	const t = useTranslations();
	const mountRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<THREE.Scene | null>(null);
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
	const meshRef = useRef<THREE.Mesh | null>(null);
	const clockRef = useRef<THREE.Clock>(new THREE.Clock());
	// #endregion

	// #region 상수: 애니메이션 데이터
	const animationData = useMemo(() => ({
		rotation: {
			name: t('3D_회전'),
			description: t('3D_회전설명'),
			animate: (mesh: THREE.Mesh, time: number) => {
				mesh.rotation.x = time * 0.5;
				mesh.rotation.y = time * 0.3;
				mesh.rotation.z = time * 0.1;
			},
		},
		position: {
			name: t('3D_이동'),
			description: t('3D_이동설명'),
			animate: (mesh: THREE.Mesh, time: number) => {
				mesh.position.x = Math.sin(time) * 2;
				mesh.position.y = Math.cos(time * 1.5) * 1;
				mesh.position.z = Math.sin(time * 0.5) * 0.5;
			},
		},
		scale: {
			name: t('3D_크기변화'),
			description: t('3D_크기변화설명'),
			animate: (mesh: THREE.Mesh, time: number) => {
				const scale = 0.5 + Math.sin(time * 2) * 0.3;
				mesh.scale.setScalar(scale);
			},
		},
		color: {
			name: t('3D_색상변화'),
			description: t('3D_색상변화설명'),
			animate: (mesh: THREE.Mesh, time: number) => {
				const material = mesh.material as THREE.MeshLambertMaterial;
				const hue = (time * 0.5) % 1;
				material.color.setHSL(hue, 0.7, 0.5);
			},
		},
		combined: {
			name: t('3D_복합애니메이션'),
			description: t('3D_복합애니메이션설명'),
			animate: (mesh: THREE.Mesh, time: number) => {
				mesh.rotation.x = time * 0.3;
				mesh.rotation.y = time * 0.5;
				const radius = 1.5;
				mesh.position.x = Math.cos(time) * radius;
				mesh.position.z = Math.sin(time) * radius;
				mesh.position.y = Math.sin(time * 2) * 0.5;
				const scale = 0.8 + Math.sin(time * 3) * 0.2;
				mesh.scale.setScalar(scale);
				const material = mesh.material as THREE.MeshLambertMaterial;
				const hue = (time * 0.3) % 1;
				material.color.setHSL(hue, 0.8, 0.6);
			},
		},
	}), [t]);
	// #endregion

	// #region 상태
	const [selectedAnimation, setSelectedAnimation] = useState<AnimationType>('rotation');
	const [isPlaying, setIsPlaying] = useState(true);
	const [speed, setSpeed] = useState(1);
	// #endregion

	// #region useEffect: 씬 초기화 및 애니메이션 루프
	useEffect(() => {
		if (!mountRef.current) return;

		const mount = mountRef.current;

		// #region 씬 및 렌더러 설정
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0xf8f9fa);
		sceneRef.current = scene;

		const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
		camera.position.set(0, 0, 6);

		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(800, 600);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		rendererRef.current = renderer;
		mount.appendChild(renderer.domElement);
		// #endregion

		// #region 조명 및 객체 설정
		const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
		directionalLight.position.set(5, 5, 5);
		directionalLight.castShadow = true;
		scene.add(directionalLight);

		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshLambertMaterial({ color: 0x00ff88 });
		const mesh = new THREE.Mesh(geometry, material);
		mesh.castShadow = true;
		meshRef.current = mesh;
		scene.add(mesh);

		const gridHelper = new THREE.GridHelper(10, 10, 0xcccccc, 0xeeeeee);
		gridHelper.position.y = -2;
		scene.add(gridHelper);

		const planeGeometry = new THREE.PlaneGeometry(10, 10);
		const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
		const plane = new THREE.Mesh(planeGeometry, planeMaterial);
		plane.rotation.x = -Math.PI / 2;
		plane.position.y = -2;
		plane.receiveShadow = true;
		scene.add(plane);
		// #endregion

		// #region 애니메이션 루프
		const animate = () => {
			requestAnimationFrame(animate);
			
			if (meshRef.current && isPlaying) {
				const elapsedTime = clockRef.current.getElapsedTime() * speed;
				meshRef.current.position.set(0, 0, 0);
				meshRef.current.rotation.set(0, 0, 0);
				meshRef.current.scale.set(1, 1, 1);
				animationData[selectedAnimation].animate(meshRef.current, elapsedTime);
			}
			
			renderer.render(scene, camera);
		};
		animate();
		// #endregion

		return () => {
			if (mount && renderer.domElement) {
				mount.removeChild(renderer.domElement);
			}
			renderer.dispose();
			geometry.dispose();
			material.dispose();
		};
	}, [selectedAnimation, isPlaying, speed, animationData]);
	// #endregion

	// #region 핸들러
	const togglePlayPause = () => {
		setIsPlaying(!isPlaying);
		if (!isPlaying) {
			clockRef.current.start();
		}
	};

	const resetAnimation = () => {
		clockRef.current = new THREE.Clock();
		if (meshRef.current) {
			meshRef.current.position.set(0, 0, 0);
			meshRef.current.rotation.set(0, 0, 0);
			meshRef.current.scale.set(1, 1, 1);
			const material = meshRef.current.material as THREE.MeshLambertMaterial;
			material.color.setHex(0x00ff88);
		}
	};
	// #endregion

	// #region 렌더링
	return (
		<div className="p-8 space-y-8">
			<div className="p-6 rounded-xl neu-flat">
				<h1 className="mb-4 text-3xl font-bold">{t('3D_애니메이션제목')}</h1>
				<p className="mb-6 text-gray-600">
					{t('3D_애니메이션설명')}
				</p>
			</div>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
				<div className="p-6 rounded-xl neu-flat">
					<h2 className="mb-4 text-xl font-semibold">{t('3D_애니메이션갤러리')}</h2>
					<div 
						ref={mountRef} 
						className="overflow-hidden mb-4 rounded-lg border border-gray-200"
					/>
					
					<div className="flex gap-2 mb-4">
						<button
							onClick={togglePlayPause}
							className="px-4 py-2 rounded neu-raised hover:neu-inset"
						>
							{isPlaying ? t('3D_정지') : t('3D_시작')}
						</button>
						<button
							onClick={resetAnimation}
							className="px-4 py-2 rounded neu-raised hover:neu-inset"
						>
							{t('3D_재설정')}
						</button>
					</div>
					
					<div className="p-4 rounded-lg neu-inset">
						<h3 className="text-lg font-semibold text-blue-600">
							{animationData[selectedAnimation].name}
						</h3>
						<p className="mt-1 text-sm text-gray-600">
							{animationData[selectedAnimation].description}
						</p>
					</div>
				</div>

				<div className="space-y-6">
					<div className="p-6 rounded-xl neu-flat">
						<h2 className="mb-4 text-xl font-semibold">{t('3D_애니메이션선택')}</h2>
						<div className="space-y-2">
							{(Object.keys(animationData) as AnimationType[]).map((type) => {
								const data = animationData[type];
								const isSelected = selectedAnimation === type;
								
								return (
									<button
										key={type}
										onClick={() => setSelectedAnimation(type)}
										className={`w-full p-3 rounded-lg text-left transition-all ${
											isSelected 
												? 'bg-blue-50 neu-inset' 
												: 'neu-raised hover:neu-inset'
										}`}
									>
										<h4 className="font-semibold">{data.name}</h4>
										<p className="text-sm text-gray-500">{data.description}</p>
									</button>
								);
							})}
						</div>
					</div>

					<div className="p-6 rounded-xl neu-flat">
						<h2 className="mb-4 text-xl font-semibold">{t('3D_속도조절')}</h2>
						<div className="flex items-center gap-4">
							<span>{t('3D_느리게')}</span>
							<input
								type="range"
								min="0.1"
								max="3"
								step="0.1"
								value={speed}
								onChange={(e) => setSpeed(parseFloat(e.target.value))}
								className="w-full"
							/>
							<span>{t('3D_빠르게')} ({speed.toFixed(1)}x)</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
	// #endregion
} 