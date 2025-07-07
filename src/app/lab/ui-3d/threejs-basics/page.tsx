/*
  파일명: src/app/lab/ui-3d/threejs-basics/page.tsx
  기능: Three.js의 가장 기본적인 3요소(Scene, Camera, Renderer)를 사용하여 3D 렌더링의 핵심 원리를 시연하는 페이지
  책임: 정육면체(Cube)를 생성하고, 애니메이션 루프를 통해 회전시키며, 각 구성 요소의 역할을 설명한다.
*/

'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { useTranslations } from '@/hooks/useI18n';

export default function BasicsPage() {
	// #region 훅
	const t = useTranslations();
	const mountRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<THREE.Scene | null>(null);
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
	// #endregion

	// #region useEffect: 씬 초기화 및 애니메이션
	useEffect(() => {
		if (!mountRef.current) return;

		const mount = mountRef.current;

		// #region Scene 생성
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0xf0f0f0);
		sceneRef.current = scene;
		// #endregion

		// #region Camera 설정
		const camera = new THREE.PerspectiveCamera(
			75, // 시야각
			800 / 600, // 종횡비
			0.1, // 가까운 클리핑 평면
			1000 // 먼 클리핑 평면
		);
		camera.position.z = 5;
		// #endregion

		// #region Renderer 생성
		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(800, 600);
		rendererRef.current = renderer;
		mount.appendChild(renderer.domElement);
		// #endregion

		// #region 기본 정육면체 추가
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		const cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		// #endregion

		// #region 애니메이션 루프
		const animate = () => {
			requestAnimationFrame(animate);
			
			cube.rotation.x += 0.01;
			cube.rotation.y += 0.01;
			
			renderer.render(scene, camera);
		};
		animate();
		// #endregion

		// #region 정리 함수
		return () => {
			if (mount && renderer.domElement) {
				mount.removeChild(renderer.domElement);
			}
			renderer.dispose();
			geometry.dispose();
			material.dispose();
		};
		// #endregion
	}, []);
	// #endregion

	// #region 렌더링
	return (
		<div className="p-8 space-y-8">
			<div className="p-6 rounded-xl neu-flat">
				<h1 className="mb-4 text-3xl font-bold">{t('3D_기초제목')}</h1>
				<p className="mb-6 text-gray-600">
					{t('3D_기초설명')}
				</p>
			</div>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
				{/* 3D 뷰어 */}
				<div className="p-6 rounded-xl neu-flat">
					<h2 className="mb-4 text-xl font-semibold">{t('3D_실습정육면체')}</h2>
					<div 
						ref={mountRef} 
						className="overflow-hidden rounded-lg border border-gray-200"
					/>
				</div>

				{/* 이론 설명 */}
				<div className="p-6 space-y-6 rounded-xl neu-flat">
					<div>
						<h3 className="mb-2 text-lg font-semibold text-blue-600">📦 {t('3D_씬제목')}</h3>
						<p className="text-sm text-gray-600">
							{t('3D_씬설명')}
						</p>
					</div>

					<div>
						<h3 className="mb-2 text-lg font-semibold text-green-600">📷 {t('3D_카메라제목')}</h3>
						<p className="text-sm text-gray-600">
							{t('3D_카메라설명')}
						</p>
					</div>

					<div>
						<h3 className="mb-2 text-lg font-semibold text-purple-600">🖥️ {t('3D_렌더러제목')}</h3>
						<p className="text-sm text-gray-600">
							{t('3D_렌더러설명')}
						</p>
					</div>

					<div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
						<h4 className="font-semibold text-yellow-800">💡 {t('3D_핵심포인트')}</h4>
						<p className="mt-1 text-sm text-yellow-700">
							{t('3D_핵심포인트설명')}
						</p>
					</div>
				</div>
			</div>

			{/* 코드 설명 */}
			<div className="p-6 rounded-xl neu-flat">
				<h2 className="mb-4 text-xl font-semibold">{t('3D_코드구조')}</h2>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
					<div className="p-4 bg-blue-50 rounded-lg">
						<h3 className="mb-2 font-semibold text-blue-800">1. {t('3D_씬생성')}</h3>
						<code className="text-xs text-blue-600">
							new THREE.Scene()
						</code>
					</div>
					<div className="p-4 bg-green-50 rounded-lg">
						<h3 className="mb-2 font-semibold text-green-800">2. {t('3D_카메라설정')}</h3>
						<code className="text-xs text-green-600">
							new THREE.PerspectiveCamera()
						</code>
					</div>
					<div className="p-4 bg-purple-50 rounded-lg">
						<h3 className="mb-2 font-semibold text-purple-800">3. {t('3D_렌더러생성')}</h3>
						<code className="text-xs text-purple-600">
							new THREE.WebGLRenderer()
						</code>
					</div>
					<div className="p-4 bg-orange-50 rounded-lg">
						<h3 className="mb-2 font-semibold text-orange-800">4. {t('3D_애니메이션')}</h3>
						<code className="text-xs text-orange-600">
							requestAnimationFrame()
						</code>
					</div>
				</div>
			</div>
		</div>
	);
	// #endregion
} 