/*
  파일명: src/app/lab/ui-3d/threejs-geometries/page.tsx
  기능: Three.js에서 제공하는 다양한 기본 도형(Geometries)을 시각적으로 보여주는 페이지
  책임: 사용자가 선택한 도형을 3D 씬에 렌더링하고, 각 도형의 특징과 생성 방법을 설명한다.
*/

'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { useTranslations } from '@/hooks/useI18n';

// #region 타입
type GeometryType = 'box' | 'sphere' | 'cylinder' | 'cone' | 'plane' | 'torus';
// #endregion

export default function GeometriesPage() {
	// #region 훅
	const t = useTranslations();
	const mountRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<THREE.Scene | null>(null);
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
	const meshRef = useRef<THREE.Mesh | null>(null);
	// #endregion

	// #region 상수: 도형 데이터
	const geometryData = useMemo(() => ({
		box: {
			name: t('3D_정육면체'),
			description: t('3D_정육면체설명'),
			create: () => new THREE.BoxGeometry(1, 1, 1),
			color: 0xff6b6b,
		},
		sphere: {
			name: t('3D_구'),
			description: t('3D_구설명'),
			create: () => new THREE.SphereGeometry(1, 32, 16),
			color: 0x4ecdc4,
		},
		cylinder: {
			name: t('3D_원기둥'),
			description: t('3D_원기둥설명'),
			create: () => new THREE.CylinderGeometry(1, 1, 2, 32),
			color: 0x45b7d1,
		},
		cone: {
			name: t('3D_원뿔'),
			description: t('3D_원뿔설명'),
			create: () => new THREE.ConeGeometry(1, 2, 32),
			color: 0xf9ca24,
		},
		plane: {
			name: t('3D_평면'),
			description: t('3D_평면설명'),
			create: () => new THREE.PlaneGeometry(2, 2),
			color: 0x6c5ce7,
		},
		torus: {
			name: t('3D_토러스'),
			description: t('3D_토러스설명'),
			create: () => new THREE.TorusGeometry(1, 0.3, 16, 100),
			color: 0xfd79a8,
		},
	}), [t]);
	// #endregion

	// #region 상태
	const [selectedGeometry, setSelectedGeometry] = useState<GeometryType>('box');
	// #endregion

	// #region useEffect: 씬 초기화
	useEffect(() => {
		if (!mountRef.current) return;

		const mount = mountRef.current;

		// #region 씬 및 렌더러 설정
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0xf0f0f0);
		sceneRef.current = scene;

		const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
		camera.position.z = 5;

		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(800, 600);
		rendererRef.current = renderer;
		mount.appendChild(renderer.domElement);
		// #endregion

		// #region 조명 추가
		const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
		directionalLight.position.set(5, 5, 5);
		scene.add(directionalLight);
		// #endregion

		// #region 애니메이션 루프
		const animate = () => {
			requestAnimationFrame(animate);
			
			if (meshRef.current) {
				meshRef.current.rotation.x += 0.01;
				meshRef.current.rotation.y += 0.01;
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
		};
	}, []);
	// #endregion

	// #region 핸들러
	const changeGeometry = useCallback((type: GeometryType) => {
		if (!sceneRef.current) return;

		if (meshRef.current) {
			sceneRef.current.remove(meshRef.current);
			meshRef.current.geometry.dispose();
			(meshRef.current.material as THREE.Material).dispose();
		}

		const data = geometryData[type];
		const geometry = data.create();
		const material = new THREE.MeshLambertMaterial({ color: data.color });
		const mesh = new THREE.Mesh(geometry, material);
		
		meshRef.current = mesh;
		sceneRef.current.add(mesh);
		setSelectedGeometry(type);
	}, [geometryData]);
	// #endregion

	// #region useEffect: 초기 도형 생성
	useEffect(() => {
		changeGeometry('box');
	}, [changeGeometry]);
	// #endregion

	// #region 렌더링
	const currentData = geometryData[selectedGeometry];

	return (
		<div className="p-8 space-y-8">
			<div className="neu-flat p-6 rounded-xl">
				<h1 className="text-3xl font-bold mb-4">{t('3D_도형제목')}</h1>
				<p className="text-gray-600 mb-6">
					{t('3D_도형설명')}
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<div className="neu-flat p-6 rounded-xl">
					<h2 className="text-xl font-semibold mb-4">{t('3D_실습갤러리')}</h2>
					<div 
						ref={mountRef} 
						className="border border-gray-200 rounded-lg overflow-hidden mb-4"
					/>
					
					<div className="neu-inset p-4 rounded-lg">
						<h3 className="font-semibold text-lg" style={{ color: `#${currentData.color.toString(16)}` }}>
							{currentData.name}
						</h3>
						<p className="text-sm text-gray-600 mt-1">
							{currentData.description}
						</p>
					</div>
				</div>

				<div className="neu-flat p-6 rounded-xl">
					<h2 className="text-xl font-semibold mb-4">{t('3D_도형선택')}</h2>
					<div className="grid grid-cols-2 gap-3">
						{(Object.keys(geometryData) as GeometryType[]).map((type) => {
							const data = geometryData[type];
							const isSelected = selectedGeometry === type;
							
							return (
								<button
									key={type}
									onClick={() => changeGeometry(type)}
									className={`p-4 rounded-lg transition-all ${
										isSelected 
											? 'neu-inset' 
											: 'neu-raised hover:neu-inset'
									}`}
								>
									<div 
										className="w-full h-3 rounded mb-2"
										style={{ backgroundColor: `#${data.color.toString(16)}` }}
									/>
									<h3 className="font-semibold text-sm">{data.name}</h3>
									<p className="text-xs text-gray-600 mt-1 line-clamp-2">
										{data.description}
									</p>
								</button>
							);
						})}
					</div>
				</div>
			</div>

			<div className="neu-flat p-6 rounded-xl">
				<h2 className="text-xl font-semibold mb-4">{t('3D_도형이해')}</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="p-4 bg-blue-50 rounded-lg">
						<h3 className="font-semibold text-blue-800 mb-2">📦 {t('3D_정육면체')}</h3>
						<p className="text-sm text-blue-600">
							{t('3D_정육면체설명')}
						</p>
					</div>
					<div className="p-4 bg-green-50 rounded-lg">
						<h3 className="font-semibold text-green-800 mb-2">🌍 {t('3D_구')}</h3>
						<p className="text-sm text-green-600">
							{t('3D_구설명')}
						</p>
					</div>
					<div className="p-4 bg-purple-50 rounded-lg">
						<h3 className="font-semibold text-purple-800 mb-2">🏛️ {t('3D_원기둥')}</h3>
						<p className="text-sm text-purple-600">
							{t('3D_원기둥설명')}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
	// #endregion
} 