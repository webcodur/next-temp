'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

type AnimationType = 'rotation' | 'position' | 'scale' | 'color' | 'combined';

const animationData = {
	rotation: {
		name: '회전 애니메이션',
		description: '객체를 X, Y, Z축 중심으로 회전시킨다',
		animate: (mesh: THREE.Mesh, time: number) => {
			mesh.rotation.x = time * 0.5;
			mesh.rotation.y = time * 0.3;
			mesh.rotation.z = time * 0.1;
		},
	},
	position: {
		name: '위치 애니메이션',
		description: '객체를 3D 공간에서 이동시킨다',
		animate: (mesh: THREE.Mesh, time: number) => {
			mesh.position.x = Math.sin(time) * 2;
			mesh.position.y = Math.cos(time * 1.5) * 1;
			mesh.position.z = Math.sin(time * 0.5) * 0.5;
		},
	},
	scale: {
		name: '크기 애니메이션',
		description: '객체의 크기를 동적으로 변경한다',
		animate: (mesh: THREE.Mesh, time: number) => {
			const scale = 0.5 + Math.sin(time * 2) * 0.3;
			mesh.scale.setScalar(scale);
		},
	},
	color: {
		name: '색상 애니메이션',
		description: '재질의 색상을 시간에 따라 변경한다',
		animate: (mesh: THREE.Mesh, time: number) => {
			const material = mesh.material as THREE.MeshLambertMaterial;
			const hue = (time * 0.5) % 1;
			material.color.setHSL(hue, 0.7, 0.5);
		},
	},
	combined: {
		name: '복합 애니메이션',
		description: '여러 애니메이션을 동시에 적용한다',
		animate: (mesh: THREE.Mesh, time: number) => {
			// 회전
			mesh.rotation.x = time * 0.3;
			mesh.rotation.y = time * 0.5;
			
			// 위치 (원형 궤도)
			const radius = 1.5;
			mesh.position.x = Math.cos(time) * radius;
			mesh.position.z = Math.sin(time) * radius;
			mesh.position.y = Math.sin(time * 2) * 0.5;
			
			// 크기
			const scale = 0.8 + Math.sin(time * 3) * 0.2;
			mesh.scale.setScalar(scale);
			
			// 색상
			const material = mesh.material as THREE.MeshLambertMaterial;
			const hue = (time * 0.3) % 1;
			material.color.setHSL(hue, 0.8, 0.6);
		},
	},
};

export default function AnimationsPage() {
	const mountRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<THREE.Scene | null>(null);
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
	const meshRef = useRef<THREE.Mesh | null>(null);
	const clockRef = useRef<THREE.Clock>(new THREE.Clock());
	
	const [selectedAnimation, setSelectedAnimation] = useState<AnimationType>('rotation');
	const [isPlaying, setIsPlaying] = useState(true);
	const [speed, setSpeed] = useState(1);

	useEffect(() => {
		if (!mountRef.current) return;

		const mount = mountRef.current; // ref 값을 변수로 복사

		// #region 기본 설정
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

		// #region 조명 설정
		const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
		directionalLight.position.set(5, 5, 5);
		directionalLight.castShadow = true;
		scene.add(directionalLight);
		// #endregion

		// #region 메인 객체 생성
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshLambertMaterial({ color: 0x00ff88 });
		const mesh = new THREE.Mesh(geometry, material);
		mesh.castShadow = true;
		meshRef.current = mesh;
		scene.add(mesh);

		// 참조용 격자 추가
		const gridHelper = new THREE.GridHelper(10, 10, 0xcccccc, 0xeeeeee);
		gridHelper.position.y = -2;
		scene.add(gridHelper);

		// 바닥 평면
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
				
				// 객체 초기화 (위치, 회전, 크기, 색상)
				meshRef.current.position.set(0, 0, 0);
				meshRef.current.rotation.set(0, 0, 0);
				meshRef.current.scale.set(1, 1, 1);
				
				// 선택된 애니메이션 적용
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
	}, [selectedAnimation, isPlaying, speed]);

	// #region 컨트롤 함수들
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

	return (
		<div className="p-8 space-y-8">
			<div className="p-6 rounded-xl neu-flat">
				<h1 className="mb-4 text-3xl font-bold">4단계: 애니메이션</h1>
				<p className="mb-6 text-gray-600">
					시간 기반 애니메이션으로 3D 객체에 생동감을 부여해보자
				</p>
			</div>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
				{/* 3D 뷰어 */}
				<div className="p-6 rounded-xl neu-flat">
					<h2 className="mb-4 text-xl font-semibold">실습: 애니메이션 실험실</h2>
					<div 
						ref={mountRef} 
						className="overflow-hidden mb-4 rounded-lg border border-gray-200"
					/>
					
					{/* 재생 컨트롤 */}
					<div className="p-4 space-y-3 rounded-lg neu-inset">
						<div className="flex justify-between items-center">
							<span className="text-sm font-semibold">재생 컨트롤</span>
							<div className="flex gap-2">
								<button
									onClick={togglePlayPause}
									className="px-4 py-2 text-sm font-semibold rounded-lg transition-all neu-raised hover:neu-inset"
								>
									{isPlaying ? '⏸️ 정지' : '▶️ 재생'}
								</button>
								<button
									onClick={resetAnimation}
									className="px-4 py-2 text-sm font-semibold rounded-lg transition-all neu-raised hover:neu-inset"
								>
									🔄 리셋
								</button>
							</div>
						</div>
						
						<div className="flex gap-3 items-center">
							<span className="text-sm">속도:</span>
							<input
								type="range"
								min="0.1"
								max="3"
								step="0.1"
								value={speed}
								onChange={(e) => setSpeed(parseFloat(e.target.value))}
								className="flex-1"
							/>
							<span className="font-mono text-sm min-w-12">{speed.toFixed(1)}x</span>
						</div>
					</div>
				</div>

				{/* 애니메이션 선택 패널 */}
				<div className="p-6 rounded-xl neu-flat">
					<h2 className="mb-4 text-xl font-semibold">애니메이션 타입</h2>
					<div className="space-y-3">
						{(Object.keys(animationData) as AnimationType[]).map((type) => {
							const data = animationData[type];
							const isSelected = selectedAnimation === type;
							
							return (
								<button
									key={type}
									onClick={() => setSelectedAnimation(type)}
									className={`w-full p-4 rounded-lg text-left transition-all ${
										isSelected 
											? 'bg-blue-50 neu-inset' 
											: 'neu-raised hover:neu-inset'
									}`}
								>
									<h3 className="mb-1 text-sm font-semibold">{data.name}</h3>
									<p className="text-xs text-gray-600">
										{data.description}
									</p>
								</button>
							);
						})}
					</div>

					{/* 현재 애니메이션 정보 */}
					<div className="p-4 mt-6 rounded-lg neu-inset">
						<h4 className="mb-2 font-semibold text-blue-600">
							현재: {animationData[selectedAnimation].name}
						</h4>
						<p className="text-sm text-gray-600">
							{animationData[selectedAnimation].description}
						</p>
					</div>
				</div>
			</div>

			{/* 이론 설명 */}
			<div className="p-6 rounded-xl neu-flat">
				<h2 className="mb-4 text-xl font-semibold">애니메이션 기초 이론</h2>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					<div>
						<h3 className="mb-2 text-lg font-semibold text-blue-600">⏰ 시간 기반 애니메이션</h3>
						<p className="text-sm text-gray-600">
							<code>Clock</code>을 사용해 일정한 속도로 애니메이션을 구현한다. 
							프레임레이트에 관계없이 동일한 속도를 유지한다.
						</p>
					</div>

					<div>
						<h3 className="mb-2 text-lg font-semibold text-green-600">🔄 requestAnimationFrame</h3>
						<p className="text-sm text-gray-600">
							브라우저의 리프레시 레이트에 맞춰 애니메이션을 실행한다. 
							부드럽고 효율적인 애니메이션을 위해 필수다.
						</p>
					</div>

					<div>
						<h3 className="mb-2 text-lg font-semibold text-purple-600">📊 수학 함수 활용</h3>
						<p className="text-sm text-gray-600">
							<code>Math.sin()</code>, <code>Math.cos()</code> 등을 사용해 
							자연스러운 움직임 패턴을 만든다.
						</p>
					</div>
				</div>

				{/* 코드 팁 */}
				<div className="mt-6 space-y-4">
					<div className="p-4 bg-gray-50 rounded-lg">
						<h4 className="mb-2 font-semibold text-gray-800">🔧 기본 애니메이션 패턴</h4>
						<div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-2">
							<div>
								<h5 className="mb-1 font-semibold">회전:</h5>
								<code className="text-gray-600">mesh.rotation.y = time * speed</code>
							</div>
							<div>
								<h5 className="mb-1 font-semibold">진동:</h5>
								<code className="text-gray-600">mesh.position.x = Math.sin(time) * amplitude</code>
							</div>
							<div>
								<h5 className="mb-1 font-semibold">원형 운동:</h5>
								<code className="text-gray-600">x = Math.cos(time) * radius</code>
							</div>
							<div>
								<h5 className="mb-1 font-semibold">펄스:</h5>
								<code className="text-gray-600">scale = 1 + Math.sin(time * freq) * 0.2</code>
							</div>
						</div>
					</div>

					<div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
						<h4 className="font-semibold text-yellow-800">💡 실습 제안</h4>
						<p className="mt-1 text-sm text-yellow-700">
							각 애니메이션을 실행해보고 속도를 조절해보자. 
							여러 애니메이션을 조합하면 더욱 복잡하고 흥미로운 움직임을 만들 수 있다.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
} 