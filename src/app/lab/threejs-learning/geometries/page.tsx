'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

type GeometryType = 'box' | 'sphere' | 'cylinder' | 'cone' | 'plane' | 'torus';

const geometryData = {
	box: {
		name: '정육면체',
		description: '가장 기본적인 3D 도형. 건물, 상자 등에 활용',
		create: () => new THREE.BoxGeometry(1, 1, 1),
		color: 0xff6b6b,
	},
	sphere: {
		name: '구',
		description: '완전한 원형. 행성, 공 등에 활용',
		create: () => new THREE.SphereGeometry(1, 32, 16),
		color: 0x4ecdc4,
	},
	cylinder: {
		name: '원기둥',
		description: '기둥 형태. 파이프, 기둥 등에 활용',
		create: () => new THREE.CylinderGeometry(1, 1, 2, 32),
		color: 0x45b7d1,
	},
	cone: {
		name: '원뿔',
		description: '뾰족한 형태. 나무, 산 등에 활용',
		create: () => new THREE.ConeGeometry(1, 2, 32),
		color: 0xf9ca24,
	},
	plane: {
		name: '평면',
		description: '2D 면. 바닥, 벽 등에 활용',
		create: () => new THREE.PlaneGeometry(2, 2),
		color: 0x6c5ce7,
	},
	torus: {
		name: '토러스',
		description: '도넛 형태. 링, 타이어 등에 활용',
		create: () => new THREE.TorusGeometry(1, 0.3, 16, 100),
		color: 0xfd79a8,
	},
};

export default function GeometriesPage() {
	const mountRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<THREE.Scene | null>(null);
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
	const meshRef = useRef<THREE.Mesh | null>(null);
	const [selectedGeometry, setSelectedGeometry] = useState<GeometryType>('box');

	useEffect(() => {
		if (!mountRef.current) return;

		// #region 기본 설정
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0xf0f0f0);
		sceneRef.current = scene;

		const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
		camera.position.z = 5;

		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(800, 600);
		rendererRef.current = renderer;
		mountRef.current.appendChild(renderer.domElement);
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
			if (mountRef.current && renderer.domElement) {
				mountRef.current.removeChild(renderer.domElement);
			}
			renderer.dispose();
		};
	}, []);

	// #region 도형 변경 함수
	const changeGeometry = (type: GeometryType) => {
		if (!sceneRef.current) return;

		// 기존 메쉬 제거
		if (meshRef.current) {
			sceneRef.current.remove(meshRef.current);
			meshRef.current.geometry.dispose();
			(meshRef.current.material as THREE.Material).dispose();
		}

		// 새 도형 생성
		const data = geometryData[type];
		const geometry = data.create();
		const material = new THREE.MeshLambertMaterial({ color: data.color });
		const mesh = new THREE.Mesh(geometry, material);
		
		meshRef.current = mesh;
		sceneRef.current.add(mesh);
		setSelectedGeometry(type);
	};
	// #endregion

	// 초기 도형 생성
	useEffect(() => {
		changeGeometry('box');
	}, [sceneRef.current]);

	const currentData = geometryData[selectedGeometry];

	return (
		<div className="p-8 space-y-8">
			<div className="neu-flat p-6 rounded-xl">
				<h1 className="text-3xl font-bold mb-4">2단계: 기본 도형</h1>
				<p className="text-gray-600 mb-6">
					다양한 Geometry를 사용해 기본 3D 도형들을 만들어보자
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* 3D 뷰어 */}
				<div className="neu-flat p-6 rounded-xl">
					<h2 className="text-xl font-semibold mb-4">실습: 도형 갤러리</h2>
					<div 
						ref={mountRef} 
						className="border border-gray-200 rounded-lg overflow-hidden mb-4"
					/>
					
					{/* 현재 선택된 도형 정보 */}
					<div className="neu-inset p-4 rounded-lg">
						<h3 className="font-semibold text-lg" style={{ color: `#${currentData.color.toString(16)}` }}>
							{currentData.name}
						</h3>
						<p className="text-sm text-gray-600 mt-1">
							{currentData.description}
						</p>
					</div>
				</div>

				{/* 도형 선택 패널 */}
				<div className="neu-flat p-6 rounded-xl">
					<h2 className="text-xl font-semibold mb-4">도형 선택</h2>
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

			{/* 이론 설명 */}
			<div className="neu-flat p-6 rounded-xl">
				<h2 className="text-xl font-semibold mb-4">Geometry 이해하기</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div>
						<h3 className="text-lg font-semibold mb-2 text-blue-600">🔧 Geometry란?</h3>
						<p className="text-sm text-gray-600">
							3D 객체의 형태와 구조를 정의하는 데이터다. 
							점(vertices), 면(faces), UV 좌표 등을 포함한다.
						</p>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-2 text-green-600">🎨 Material과의 관계</h3>
						<p className="text-sm text-gray-600">
							Geometry는 형태만 정의하고, Material이 색상과 질감을 담당한다.
							Mesh = Geometry + Material
						</p>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-2 text-purple-600">⚡ 성능 고려사항</h3>
						<p className="text-sm text-gray-600">
							복잡한 도형일수록 더 많은 연산이 필요하다.
							LOD(Level of Detail) 기법으로 최적화할 수 있다.
						</p>
					</div>
				</div>

				<div className="mt-6 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
					<h4 className="font-semibold text-blue-800">💡 실습 팁</h4>
					<p className="text-sm text-blue-700 mt-1">
						각 도형의 매개변수를 변경해보며 다양한 형태를 만들어보자. 
						예: BoxGeometry(width, height, depth)
					</p>
				</div>
			</div>
		</div>
	);
} 