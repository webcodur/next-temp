/*
  파일명: src/app/lab/ui-3d/threejs-advanced/page.tsx
  기능: Three.js의 고급 기능(텍스처, 파티클, 그림자 등)을 시연하는 페이지
  책임: 사용자가 선택한 기능에 따라 Three.js 씬(Scene)을 동적으로 구성하고 렌더링하며, 각 기능에 대한 설명을 제공한다.
*/

'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

import { useTranslations } from '@/hooks/useI18n';

// #region 타입
type AdvancedFeature = 'texture' | 'particles' | 'postprocessing' | 'shadows' | 'fog' | 'loader';
// #endregion

// #region 파티클 시스템 클래스
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
// #endregion

export default function AdvancedPage() {
	// #region 훅
	const t = useTranslations();
	const mountRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<THREE.Scene | null>(null);
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
	const meshRef = useRef<THREE.Mesh | null>(null);
	const particleSystemRef = useRef<ParticleSystem | null>(null);
	// #endregion

	// #region 상태
	const [selectedFeature, setSelectedFeature] = useState<AdvancedFeature>('texture');
	const [isLoading, setIsLoading] = useState(false);
	// #endregion

	// #region 상수
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
	// #endregion

	// #region useEffect: 씬 초기화 및 정리
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
	// #endregion

	// #region useEffect: 기능별 장면 설정
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
				
				case 'postprocessing':
					// 이 기능은 예제이므로 비워둡니다.
					break;
				
				case 'loader':
					setIsLoading(true);
					setTimeout(() => {
						const geometry = new THREE.TorusKnotGeometry(1, 0.4, 100, 16);
						const material = new THREE.MeshStandardMaterial({
							color: 0x61dafb,
							metalness: 0.8,
							roughness: 0.2,
						});
						const mesh = new THREE.Mesh(geometry, material);
						mesh.castShadow = true;
						meshRef.current = mesh;
						scene.add(mesh);
						setIsLoading(false);
					}, 1500); // 로딩 시뮬레이션
					break;
			}
		};

		setupFeature();

		// 애니메이션 루프
		let animationId: number;
		const animate = () => {
			animationId = requestAnimationFrame(animate);
			
			if (meshRef.current) {
				meshRef.current.rotation.x += 0.005;
				meshRef.current.rotation.y += 0.005;
			}
			
			if (particleSystemRef.current) {
				particleSystemRef.current.update();
			}

			renderer.render(scene, camera);
		};

		animate();

		return () => {
			cancelAnimationFrame(animationId);
			// 씬에서 객체 제거
			scene.children.forEach(child => {
				if (child instanceof THREE.Mesh) {
					child.geometry.dispose();
					if(Array.isArray(child.material)) {
						child.material.forEach(m => m.dispose());
					} else {
						(child.material as THREE.Material).dispose();
					}
					scene.remove(child);
				}
			});
			scene.fog = null;
		};
	}, [selectedFeature]);
	// #endregion

	// #region 핸들러
	const changeFeature = (feature: AdvancedFeature) => {
		setSelectedFeature(feature);
	};
	// #endregion
	
	// #region 렌더링
	return (
		<div className="p-6">
			<h1 className="text-3xl font-bold mb-4">{t('3D_고급기능')}</h1>
			
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				{/* 사이드바 */}
				<div className="md:col-span-1 p-4 rounded-lg neu-flat">
					<h2 className="text-xl font-semibold mb-4">{t('3D_기능선택')}</h2>
					<div className="flex flex-col space-y-2">
						{Object.keys(advancedFeatures).map((key) => (
							<button
								key={key}
								onClick={() => changeFeature(key as AdvancedFeature)}
								className={`
									p-3 text-left rounded-md transition-all
									${selectedFeature === key ? 'neu-inset text-primary' : 'neu-raised'}
								`}
							>
								{advancedFeatures[key as AdvancedFeature].name}
							</button>
						))}
					</div>
				</div>

				{/* 메인 뷰 */}
				<div className="md:col-span-3">
					<div className="p-4 mb-4 rounded-lg neu-flat">
						<h3 className="text-lg font-bold">
							{advancedFeatures[selectedFeature].name}
						</h3>
						<p className="text-sm text-muted-foreground mt-1">
							{advancedFeatures[selectedFeature].description}
						</p>
					</div>

					<div className="relative w-[800px] h-[600px] rounded-lg overflow-hidden neu-inset">
						{isLoading && (
							<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
								<p className="text-white text-xl">{t('공통_로딩중')}</p>
							</div>
						)}
						<div ref={mountRef} className="w-full h-full" />
					</div>
					
					<div className="mt-4 p-4 rounded-lg bg-blue-100 text-blue-800">
						<h4 className="font-semibold">{t('3D_사용법')}</h4>
						<p className="text-sm">{advancedFeatures[selectedFeature].instruction}</p>
					</div>
				</div>
			</div>
		</div>
	);
	// #endregion
} 