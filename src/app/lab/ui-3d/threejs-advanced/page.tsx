'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTranslations } from '@/hooks/useI18n';

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

export default function AdvancedPage() {
	const t = useTranslations();
	const mountRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<THREE.Scene | null>(null);
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
	const meshRef = useRef<THREE.Mesh | null>(null);
	const particleSystemRef = useRef<ParticleSystem | null>(null);
	
	const [selectedFeature, setSelectedFeature] = useState<AdvancedFeature>('texture');
	const [isLoading, setIsLoading] = useState(false);

	const advancedFeatures = {
		texture: {
			name: t('3D_텍스처매핑'),
			description: t('3D_텍스처매핑설명'),
			instruction: t('3D_텍스처매핑가이드'),
		},
		particles: {
			name: t('3D_파티클시스템'),
			description: t('3D_파티클시스템설명'),
			instruction: t('3D_파티클시스템가이드'),
		},
		postprocessing: {
			name: t('3D_후처리효과'),
			description: t('3D_후처리효과설명'),
			instruction: t('3D_후처리효과가이드'),
		},
		shadows: {
			name: t('3D_그림자시스템'),
			description: t('3D_그림자시스템설명'),
			instruction: t('3D_그림자시스템가이드'),
		},
		fog: {
			name: t('3D_안개효과'),
			description: t('3D_안개효과설명'),
			instruction: t('3D_안개효과가이드'),
		},
		loader: {
			name: t('3D_모델로딩'),
			description: t('3D_모델로딩설명'),
			instruction: t('3D_모델로딩가이드'),
		},
	};

	useEffect(() => {
		if (!mountRef.current) return;

		const mount = mountRef.current; // ref 값을 변수로 복사

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
		mount.appendChild(renderer.domElement);
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
			if (mount && renderer.domElement) {
				mount.removeChild(renderer.domElement);
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
			<div className="p-6 rounded-xl neu-flat">
				<h1 className="mb-4 text-3xl font-bold font-multilang">{t('3D_고급기능제목')}</h1>
				<p className="mb-6 text-gray-600 font-multilang">
					{t('3D_고급기능설명')}
				</p>
			</div>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
				{/* 3D 뷰어 */}
				<div className="p-6 rounded-xl neu-flat">
					<h2 className="mb-4 text-xl font-semibold font-multilang">{t('3D_고급실습')}</h2>
					
					{isLoading && (
						<div className="flex items-center justify-center h-[600px] border border-gray-200 rounded-lg">
							<div className="text-center">
								<div className="mx-auto mb-4 w-12 h-12 rounded-full border-b-2 border-blue-500 animate-spin"></div>
								<p className="text-gray-600 font-multilang">{t('3D_고급로딩')}</p>
							</div>
						</div>
					)}
					
					<div 
						ref={mountRef} 
						className={`border border-gray-200 rounded-lg overflow-hidden mb-4 ${isLoading ? 'hidden' : ''}`}
					/>
					
					{/* 현재 기능 설명 */}
					<div className="p-4 rounded-lg neu-inset">
						<h3 className="mb-2 text-lg font-semibold text-purple-600 font-multilang">
							{currentFeature.name}
						</h3>
						<p className="mb-2 text-sm text-gray-600 font-multilang">
							{currentFeature.description}
						</p>
						<p className="text-sm font-semibold text-green-600 font-multilang">
							💡 {currentFeature.instruction}
						</p>
					</div>
				</div>

				{/* 기능 선택 패널 */}
				<div className="p-6 rounded-xl neu-flat">
					<h2 className="mb-4 text-xl font-semibold font-multilang">{t('3D_고급기능')}</h2>
					<div className="space-y-3">
						{(Object.keys(advancedFeatures) as AdvancedFeature[]).map((feature) => {
							const data = advancedFeatures[feature];
							const isActive = selectedFeature === feature;
							
							return (
								<button
									key={feature}
									onClick={() => changeFeature(feature)}
									disabled={isLoading}
									className={`w-full p-4 rounded-lg text-start transition-all ${
										isActive 
											? 'bg-purple-50 neu-inset' 
											: 'neu-raised hover:neu-inset'
									} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
								>
									<h3 className="mb-1 text-sm font-semibold font-multilang">{data.name}</h3>
									<p className="text-xs text-gray-600 font-multilang">
										{data.description}
									</p>
								</button>
							);
						})}
					</div>

					{/* 학습 진행도 */}
					<div className="p-4 mt-6 rounded-lg neu-inset">
						<h4 className="mb-2 font-semibold text-gray-800 font-multilang">{t('3D_학습진행도')}</h4>
						<div className="w-full h-2 bg-gray-200 rounded-full">
							<div 
								className="h-2 bg-linear-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
								style={{ width: '100%' }}
							></div>
						</div>
						<p className="mt-2 text-xs text-gray-600 font-multilang">
							{t('3D_학습완료')}
						</p>
					</div>
				</div>
			</div>

			{/* 이론 설명 */}
			<div className="p-6 rounded-xl neu-flat">
				<h2 className="mb-4 text-xl font-semibold font-multilang">{t('3D_심화이론')}</h2>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					<div>
						<h3 className="mb-2 text-lg font-semibold text-purple-600 font-multilang">{t('3D_텍스처시스템')}</h3>
						<p className="text-sm text-gray-600 font-multilang">
							{t('3D_텍스처시스템설명')}
						</p>
					</div>

					<div>
						<h3 className="mb-2 text-lg font-semibold text-yellow-600 font-multilang">{t('3D_파티클효과')}</h3>
						<p className="text-sm text-gray-600 font-multilang">
							{t('3D_파티클효과설명')}
						</p>
					</div>

					<div>
						<h3 className="mb-2 text-lg font-semibold text-gray-600 font-multilang">{t('3D_그림자안개')}</h3>
						<p className="text-sm text-gray-600 font-multilang">
							{t('3D_그림자안개설명')}
						</p>
					</div>
				</div>

				{/* 다음 단계 안내 */}
				<div className="mt-6 space-y-4">
					<div className="p-4 bg-linear-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-purple-400">
						<h4 className="font-semibold text-purple-800 font-multilang">{t('3D_다음학습')}</h4>
						<div className="mt-2 space-y-1 text-sm text-purple-700">
							<p className="font-multilang">• {t('3D_WebXR')}</p>
							<p className="font-multilang">• {t('3D_물리엔진')}</p>
							<p className="font-multilang">• {t('3D_성능최적화')}</p>
							<p className="font-multilang">• {t('3D_쉐이더프로그래밍')}</p>
						</div>
					</div>

					<div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
						<h4 className="font-semibold text-green-800 font-multilang">{t('3D_실전프로젝트')}</h4>
						<div className="mt-2 space-y-1 text-sm text-green-700">
							<p className="font-multilang">• {t('3D_제품전시관')}</p>
							<p className="font-multilang">• {t('3D_데이터시각화')}</p>
							<p className="font-multilang">• {t('3D_미니게임')}</p>
							<p className="font-multilang">• {t('3D_건축비주얼')}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
} 