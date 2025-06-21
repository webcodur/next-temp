'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

type AdvancedFeature = 'texture' | 'particles' | 'postprocessing' | 'shadows' | 'fog' | 'loader';

// 간단한 파티클 시스템
class ParticleSystem {
	particles: THREE.BufferGeometry;
	material: THREE.PointsMaterial;
	system: THREE.Points;
	positions: Float32Array;
	velocities: Float32Array;
	
	constructor(count: number) {
		this.particles = new THREE.BufferGeometry();
		this.positions = new Float32Array(count * 3);
		this.velocities = new Float32Array(count * 3);
		
		// 초기 위치와 속도 설정
		for (let i = 0; i < count * 3; i += 3) {
			this.positions[i] = (Math.random() - 0.5) * 10;
			this.positions[i + 1] = Math.random() * 5;
			this.positions[i + 2] = (Math.random() - 0.5) * 10;
			
			this.velocities[i] = (Math.random() - 0.5) * 0.02;
			this.velocities[i + 1] = Math.random() * 0.01;
			this.velocities[i + 2] = (Math.random() - 0.5) * 0.02;
		}
		
		this.particles.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
		
		this.material = new THREE.PointsMaterial({
			color: 0xffffff,
			size: 0.1,
			transparent: true,
			opacity: 0.8,
		});
		
		this.system = new THREE.Points(this.particles, this.material);
	}
	
	update() {
		const positions = this.particles.attributes.position.array as Float32Array;
		
		for (let i = 0; i < positions.length; i += 3) {
			positions[i] += this.velocities[i];
			positions[i + 1] += this.velocities[i + 1];
			positions[i + 2] += this.velocities[i + 2];
			
			// 경계 체크
			if (positions[i + 1] > 8) {
				positions[i + 1] = 0;
			}
		}
		
		this.particles.attributes.position.needsUpdate = true;
	}
	
	dispose() {
		this.particles.dispose();
		this.material.dispose();
	}
}

const advancedFeatures = {
	texture: {
		name: '텍스처 매핑',
		description: '2D 이미지를 3D 표면에 입혀 사실적인 재질을 만든다',
		instruction: '회전하는 텍스처 큐브를 확인해보세요',
	},
	particles: {
		name: '파티클 시스템',
		description: '수많은 작은 점들로 눈, 불, 연기 등의 효과를 만든다',
		instruction: '떠오르는 파티클들을 관찰해보세요',
	},
	postprocessing: {
		name: '후처리 효과',
		description: '렌더링 후 블룸, 블러 등의 시각 효과를 추가한다',
		instruction: '글로우 효과가 적용된 장면을 확인해보세요',
	},
	shadows: {
		name: '그림자 시스템',
		description: '실시간 그림자를 렌더링해 입체감을 높인다',
		instruction: '움직이는 객체의 그림자를 관찰해보세요',
	},
	fog: {
		name: '안개 효과',
		description: '거리에 따라 객체가 흐려지는 대기 효과를 만든다',
		instruction: '원거리 객체들이 안개에 가려지는 것을 확인해보세요',
	},
	loader: {
		name: '모델 로딩',
		description: 'GLTF, OBJ 등의 3D 모델 파일을 로드한다',
		instruction: '복잡한 3D 모델이 로드되는 과정을 확인해보세요',
	},
};

export default function AdvancedPage() {
	const mountRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<THREE.Scene | null>(null);
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
	const meshRef = useRef<THREE.Mesh | null>(null);
	const particleSystemRef = useRef<ParticleSystem | null>(null);
	
	const [selectedFeature, setSelectedFeature] = useState<AdvancedFeature>('texture');
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!mountRef.current) return;

		// #region 기본 설정
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0x1a1a2e);
		sceneRef.current = scene;

		const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
		camera.position.set(5, 3, 5);
		cameraRef.current = camera;

		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(800, 600);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		rendererRef.current = renderer;
		mountRef.current.appendChild(renderer.domElement);
		// #endregion

		// #region 조명 설정
		const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set(10, 10, 5);
		directionalLight.castShadow = true;
		directionalLight.shadow.mapSize.width = 2048;
		directionalLight.shadow.mapSize.height = 2048;
		scene.add(directionalLight);
		// #endregion

		// #region 기본 바닥 평면
		const planeGeometry = new THREE.PlaneGeometry(20, 20);
		const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
		const plane = new THREE.Mesh(planeGeometry, planeMaterial);
		plane.rotation.x = -Math.PI / 2;
		plane.position.y = -3;
		plane.receiveShadow = true;
		scene.add(plane);
		// #endregion

		return () => {
			if (mountRef.current && renderer.domElement) {
				mountRef.current.removeChild(renderer.domElement);
			}
			renderer.dispose();
		};
	}, []);

	// #region 기능별 장면 설정
	useEffect(() => {
		if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

		const scene = sceneRef.current;
		const camera = cameraRef.current;
		const renderer = rendererRef.current;

		// 기존 메시와 파티클 정리
		if (meshRef.current) {
			scene.remove(meshRef.current);
			meshRef.current.geometry.dispose();
			(meshRef.current.material as THREE.Material).dispose();
		}
		
		if (particleSystemRef.current) {
			scene.remove(particleSystemRef.current.system);
			particleSystemRef.current.dispose();
		}

		// 기능별 설정
		const setupFeature = () => {
			switch (selectedFeature) {
				case 'texture': {
					// 체크보드 텍스처 생성
					const canvas = document.createElement('canvas');
					canvas.width = 512;
					canvas.height = 512;
					const context = canvas.getContext('2d')!;
					
					const tileSize = 64;
					for (let x = 0; x < 8; x++) {
						for (let y = 0; y < 8; y++) {
							context.fillStyle = (x + y) % 2 === 0 ? '#ffffff' : '#000000';
							context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
						}
					}
					
					const texture = new THREE.CanvasTexture(canvas);
					const geometry = new THREE.BoxGeometry(2, 2, 2);
					const material = new THREE.MeshLambertMaterial({ map: texture });
					const mesh = new THREE.Mesh(geometry, material);
					mesh.castShadow = true;
					meshRef.current = mesh;
					scene.add(mesh);
					break;
				}
				
				case 'particles': {
					const particleSystem = new ParticleSystem(1000);
					particleSystemRef.current = particleSystem;
					scene.add(particleSystem.system);
					break;
				}
				
				case 'shadows': {
					const geometry = new THREE.SphereGeometry(1, 32, 16);
					const material = new THREE.MeshLambertMaterial({ color: 0xff6b6b });
					const mesh = new THREE.Mesh(geometry, material);
					mesh.position.y = 1;
					mesh.castShadow = true;
					meshRef.current = mesh;
					scene.add(mesh);
					break;
				}
				
				case 'fog': {
					scene.fog = new THREE.Fog(0x1a1a2e, 5, 25);
					
					// 여러 객체 생성
					for (let i = 0; i < 10; i++) {
						const geometry = new THREE.BoxGeometry(1, 1, 1);
						const material = new THREE.MeshLambertMaterial({ 
							color: new THREE.Color().setHSL(i / 10, 0.7, 0.5) 
						});
						const mesh = new THREE.Mesh(geometry, material);
						mesh.position.set(
							(Math.random() - 0.5) * 20,
							Math.random() * 3,
							-i * 3
						);
						scene.add(mesh);
					}
					break;
				}
				
				default: {
					const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
					const material = new THREE.MeshLambertMaterial({ color: 0x4285f4 });
					const mesh = new THREE.Mesh(geometry, material);
					mesh.castShadow = true;
					meshRef.current = mesh;
					scene.add(mesh);
				}
			}
		};

		setupFeature();

		// #region 애니메이션 루프
		const animate = () => {
			requestAnimationFrame(animate);
			
			// 기본 회전 애니메이션
			if (meshRef.current && selectedFeature !== 'fog') {
				meshRef.current.rotation.x += 0.01;
				meshRef.current.rotation.y += 0.01;
				
				if (selectedFeature === 'shadows') {
					meshRef.current.position.y = 1 + Math.sin(Date.now() * 0.003) * 0.5;
				}
			}
			
			// 파티클 애니메이션
			if (particleSystemRef.current && selectedFeature === 'particles') {
				particleSystemRef.current.update();
			}
			
			// 카메라 자동 회전 (안개 모드)
			if (selectedFeature === 'fog') {
				const time = Date.now() * 0.001;
				camera.position.x = Math.cos(time) * 8;
				camera.position.z = Math.sin(time) * 8;
				camera.lookAt(0, 0, 0);
			}
			
			renderer.render(scene, camera);
		};
		animate();
		// #endregion

		return () => {
			// 안개 제거
			scene.fog = null;
			
			// 추가된 객체들 정리
			const objectsToRemove = [...scene.children];
			objectsToRemove.forEach(obj => {
				if (obj !== scene.children[0] && obj !== scene.children[1] && obj !== scene.children[2]) {
					scene.remove(obj);
					if (obj instanceof THREE.Mesh) {
						obj.geometry.dispose();
						if (obj.material instanceof THREE.Material) {
							obj.material.dispose();
						}
					}
				}
			});
		};
	}, [selectedFeature]);
	// #endregion

	// #region 기능 변경
	const changeFeature = (feature: AdvancedFeature) => {
		setIsLoading(true);
		setSelectedFeature(feature);
		
		// 로딩 시뮬레이션
		setTimeout(() => {
			setIsLoading(false);
		}, 500);
	};
	// #endregion

	const currentFeature = advancedFeatures[selectedFeature];

	return (
		<div className="p-8 space-y-8">
			<div className="neu-flat p-6 rounded-xl">
				<h1 className="text-3xl font-bold mb-4">6단계: 고급 기능</h1>
				<p className="text-gray-600 mb-6">
					Three.js의 고급 기능들로 더욱 사실적이고 복잡한 3D 장면을 만들어보자
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* 3D 뷰어 */}
				<div className="neu-flat p-6 rounded-xl">
					<h2 className="text-xl font-semibold mb-4">실습: 고급 기능 체험</h2>
					
					{isLoading && (
						<div className="flex items-center justify-center h-[600px] border border-gray-200 rounded-lg">
							<div className="text-center">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
								<p className="text-gray-600">로딩 중...</p>
							</div>
						</div>
					)}
					
					<div 
						ref={mountRef} 
						className={`border border-gray-200 rounded-lg overflow-hidden mb-4 ${isLoading ? 'hidden' : ''}`}
					/>
					
					{/* 현재 기능 설명 */}
					<div className="neu-inset p-4 rounded-lg">
						<h3 className="font-semibold text-lg text-purple-600 mb-2">
							{currentFeature.name}
						</h3>
						<p className="text-sm text-gray-600 mb-2">
							{currentFeature.description}
						</p>
						<p className="text-sm font-semibold text-green-600">
							💡 {currentFeature.instruction}
						</p>
					</div>
				</div>

				{/* 기능 선택 패널 */}
				<div className="neu-flat p-6 rounded-xl">
					<h2 className="text-xl font-semibold mb-4">고급 기능</h2>
					<div className="space-y-3">
						{(Object.keys(advancedFeatures) as AdvancedFeature[]).map((feature) => {
							const data = advancedFeatures[feature];
							const isActive = selectedFeature === feature;
							
							return (
								<button
									key={feature}
									onClick={() => changeFeature(feature)}
									disabled={isLoading}
									className={`w-full p-4 rounded-lg text-left transition-all ${
										isActive 
											? 'neu-inset bg-purple-50' 
											: 'neu-raised hover:neu-inset'
									} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
								>
									<h3 className="font-semibold text-sm mb-1">{data.name}</h3>
									<p className="text-xs text-gray-600">
										{data.description}
									</p>
								</button>
							);
						})}
					</div>

					{/* 학습 진행도 */}
					<div className="mt-6 neu-inset p-4 rounded-lg">
						<h4 className="font-semibold text-gray-800 mb-2">🎓 학습 진행도</h4>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div 
								className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
								style={{ width: '100%' }}
							></div>
						</div>
						<p className="text-xs text-gray-600 mt-2">
							축하합니다! 모든 3D 기초 과정을 완료했습니다.
						</p>
					</div>
				</div>
			</div>

			{/* 이론 설명 */}
			<div className="neu-flat p-6 rounded-xl">
				<h2 className="text-xl font-semibold mb-4">고급 기능 심화 이론</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div>
						<h3 className="text-lg font-semibold mb-2 text-purple-600">🖼️ 텍스처 시스템</h3>
						<p className="text-sm text-gray-600">
							UV 매핑을 통해 2D 이미지를 3D 표면에 적용한다. 
							Diffuse, Normal, Specular 등 다양한 맵 타입이 있다.
						</p>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-2 text-yellow-600">✨ 파티클 효과</h3>
						<p className="text-sm text-gray-600">
							수천 개의 점으로 자연 현상을 시뮬레이션한다. 
							BufferGeometry로 성능을 최적화할 수 있다.
						</p>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-2 text-gray-600">🌫️ 그림자와 안개</h3>
						<p className="text-sm text-gray-600">
							실시간 그림자와 거리 기반 안개로 사실감을 높인다. 
							성능과 품질의 균형을 고려해야 한다.
						</p>
					</div>
				</div>

				{/* 다음 단계 안내 */}
				<div className="mt-6 space-y-4">
					<div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
						<h4 className="font-semibold text-purple-800">🚀 다음 학습 방향</h4>
						<div className="text-sm text-purple-700 mt-2 space-y-1">
							<p>• <strong>WebXR:</strong> VR/AR 경험 개발</p>
							<p>• <strong>물리 엔진:</strong> Cannon.js, Ammo.js 연동</p>
							<p>• <strong>성능 최적화:</strong> LOD, Culling, Instancing</p>
							<p>• <strong>쉐이더 프로그래밍:</strong> GLSL 커스텀 효과</p>
						</div>
					</div>

					<div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
						<h4 className="font-semibold text-green-800">💡 실전 프로젝트 아이디어</h4>
						<div className="text-sm text-green-700 mt-2 space-y-1">
							<p>• 3D 제품 전시관 / 포트폴리오 사이트</p>
							<p>• 인터랙티브 데이터 시각화 대시보드</p>
							<p>• 미니 게임 또는 교육용 시뮬레이션</p>
							<p>• 건축 비주얼라이제이션 도구</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
} 