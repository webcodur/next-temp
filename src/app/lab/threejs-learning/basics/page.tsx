'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function BasicsPage() {
	const mountRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<THREE.Scene | null>(null);
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

	useEffect(() => {
		if (!mountRef.current) return;

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
		mountRef.current.appendChild(renderer.domElement);
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
			if (mountRef.current && renderer.domElement) {
				mountRef.current.removeChild(renderer.domElement);
			}
			renderer.dispose();
			geometry.dispose();
			material.dispose();
		};
		// #endregion
	}, []);

	return (
		<div className="p-8 space-y-8">
			<div className="p-6 rounded-xl neu-flat">
				<h1 className="mb-4 text-3xl font-bold">1단계: 기초 개념</h1>
				<p className="mb-6 text-gray-600">
					Three.js의 핵심인 Scene, Camera, Renderer 삼각구조를 이해해보자
				</p>
			</div>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
				{/* 3D 뷰어 */}
				<div className="p-6 rounded-xl neu-flat">
					<h2 className="mb-4 text-xl font-semibold">실습: 회전하는 정육면체</h2>
					<div 
						ref={mountRef} 
						className="overflow-hidden rounded-lg border border-gray-200"
					/>
				</div>

				{/* 이론 설명 */}
				<div className="p-6 space-y-6 rounded-xl neu-flat">
					<div>
						<h3 className="mb-2 text-lg font-semibold text-blue-600">📦 Scene (장면)</h3>
						<p className="text-sm text-gray-600">
							3D 객체들이 배치되는 가상 공간이다. 
							모든 3D 요소(메쉬, 조명, 카메라 등)의 컨테이너 역할을 한다.
						</p>
					</div>

					<div>
						<h3 className="mb-2 text-lg font-semibold text-green-600">📷 Camera (카메라)</h3>
						<p className="text-sm text-gray-600">
							장면을 바라보는 시점을 정의한다. 
							PerspectiveCamera는 원근감이 있는 일반적인 3D 뷰를 제공한다.
						</p>
					</div>

					<div>
						<h3 className="mb-2 text-lg font-semibold text-purple-600">🖥️ Renderer (렌더러)</h3>
						<p className="text-sm text-gray-600">
							Scene과 Camera 정보를 받아 실제 화면에 그려주는 역할을 한다.
							WebGL을 사용해 GPU에서 빠르게 렌더링한다.
						</p>
					</div>

					<div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
						<h4 className="font-semibold text-yellow-800">💡 핵심 포인트</h4>
						<p className="mt-1 text-sm text-yellow-700">
							Scene + Camera + Renderer = 3D 그래픽의 기본 구조
						</p>
					</div>
				</div>
			</div>

			{/* 코드 설명 */}
			<div className="p-6 rounded-xl neu-flat">
				<h2 className="mb-4 text-xl font-semibold">코드 구조 이해</h2>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
					<div className="p-4 bg-blue-50 rounded-lg">
						<h3 className="mb-2 font-semibold text-blue-800">1. Scene 생성</h3>
						<code className="text-xs text-blue-600">
							new THREE.Scene()
						</code>
					</div>
					<div className="p-4 bg-green-50 rounded-lg">
						<h3 className="mb-2 font-semibold text-green-800">2. Camera 설정</h3>
						<code className="text-xs text-green-600">
							new THREE.PerspectiveCamera()
						</code>
					</div>
					<div className="p-4 bg-purple-50 rounded-lg">
						<h3 className="mb-2 font-semibold text-purple-800">3. Renderer 생성</h3>
						<code className="text-xs text-purple-600">
							new THREE.WebGLRenderer()
						</code>
					</div>
					<div className="p-4 bg-orange-50 rounded-lg">
						<h3 className="mb-2 font-semibold text-orange-800">4. 애니메이션</h3>
						<code className="text-xs text-orange-600">
							requestAnimationFrame()
						</code>
					</div>
				</div>
			</div>
		</div>
	);
} 