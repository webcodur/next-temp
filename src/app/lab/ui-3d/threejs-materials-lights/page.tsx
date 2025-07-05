'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTranslations } from '@/hooks/useI18n';

type MaterialType = 'basic' | 'lambert' | 'phong' | 'standard' | 'physical';
type LightType = 'ambient' | 'directional' | 'point' | 'spot';

export default function MaterialsLightsPage() {
	const t = useTranslations();
	
	const materialData = {
		basic: {
			name: t('3D_기본재질'),
			description: t('3D_기본재질설명'),
			create: (color: number) => new THREE.MeshBasicMaterial({ color }),
		},
		lambert: {
			name: t('3D_램버트재질'),
			description: t('3D_램버트재질설명'),
			create: (color: number) => new THREE.MeshLambertMaterial({ color }),
		},
		phong: {
			name: t('3D_퐁재질'),
			description: t('3D_퐁재질설명'),
			create: (color: number) =>
				new THREE.MeshPhongMaterial({ color, shininess: 100 }),
		},
		standard: {
			name: t('3D_물리재질'),
			description: t('3D_물리재질설명'),
			create: (color: number) =>
				new THREE.MeshStandardMaterial({
					color,
					metalness: 0.3,
					roughness: 0.4,
				}),
		},
		physical: {
			name: t('3D_물리재질'),
			description: t('3D_물리재질설명'),
			create: (color: number) =>
				new THREE.MeshPhysicalMaterial({
					color,
					metalness: 0.2,
					roughness: 0.3,
					clearcoat: 1.0,
					clearcoatRoughness: 0.1,
				}),
		},
	};

	const lightData = {
		ambient: {
			name: t('3D_환경광'),
			description: t('3D_환경광설명'),
			color: 0x404040,
		},
		directional: {
			name: t('3D_방향광'),
			description: t('3D_방향광설명'),
			color: 0xffffff,
		},
		point: {
			name: t('3D_점광원'),
			description: t('3D_점광원설명'),
			color: 0xffffff,
		},
		spot: {
			name: t('3D_점광원'),
			description: t('3D_점광원설명'),
			color: 0xffffff,
		},
	};

	const mountRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<THREE.Scene | null>(null);
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
	const meshRef = useRef<THREE.Mesh | null>(null);
	const lightsRef = useRef<THREE.Light[]>([]);

	const [selectedMaterial, setSelectedMaterial] =
		useState<MaterialType>('standard');
	const [enabledLights, setEnabledLights] = useState<Set<LightType>>(
		new Set(['ambient', 'directional'])
	);

	useEffect(() => {
		if (!mountRef.current) return;

		const mount = mountRef.current; // ref 값을 변수로 복사

		// #region 기본 설정
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0x202020);
		sceneRef.current = scene;

		const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
		camera.position.z = 5;

		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(800, 600);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		rendererRef.current = renderer;
		mount.appendChild(renderer.domElement);
		// #endregion

		// #region 기본 도형 생성
		const geometry = new THREE.SphereGeometry(1, 32, 16);
		const material = materialData.standard.create(0x00ff88);
		const mesh = new THREE.Mesh(geometry, material);
		mesh.castShadow = true;
		meshRef.current = mesh;
		scene.add(mesh);

		// 바닥 평면 추가
		const planeGeometry = new THREE.PlaneGeometry(10, 10);
		const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
		const plane = new THREE.Mesh(planeGeometry, planeMaterial);
		plane.rotation.x = -Math.PI / 2;
		plane.position.y = -2;
		plane.receiveShadow = true;
		scene.add(plane);
		// #endregion

		// #region 조명 생성
		const lights: { [key in LightType]: THREE.Light } = {
			ambient: new THREE.AmbientLight(lightData.ambient.color, 0.4),
			directional: (() => {
				const light = new THREE.DirectionalLight(
					lightData.directional.color,
					0.8
				);
				light.position.set(5, 5, 5);
				light.castShadow = true;
				light.shadow.mapSize.width = 1024;
				light.shadow.mapSize.height = 1024;
				return light;
			})(),
			point: (() => {
				const light = new THREE.PointLight(lightData.point.color, 1, 100);
				light.position.set(3, 3, 3);
				light.castShadow = true;
				return light;
			})(),
			spot: (() => {
				const light = new THREE.SpotLight(
					lightData.spot.color,
					1,
					100,
					Math.PI / 6
				);
				light.position.set(0, 5, 0);
				light.target = mesh;
				light.castShadow = true;
				return light;
			})(),
		};

		Object.values(lights).forEach((light) => scene.add(light));
		lightsRef.current = Object.values(lights);
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
			geometry.dispose();
			material.dispose();
		};
	}, []);

	// #region 재질 변경
	const changeMaterial = (type: MaterialType) => {
		if (!meshRef.current) return;

		const oldMaterial = meshRef.current.material as THREE.Material;
		oldMaterial.dispose();

		const newMaterial = materialData[type].create(0x00ff88);
		meshRef.current.material = newMaterial;
		setSelectedMaterial(type);
	};
	// #endregion

	// #region 조명 토글
	const toggleLight = (type: LightType) => {
		if (!sceneRef.current) return;

		const newEnabledLights = new Set(enabledLights);
		if (newEnabledLights.has(type)) {
			newEnabledLights.delete(type);
		} else {
			newEnabledLights.add(type);
		}

		// 모든 조명 끄기
		lightsRef.current.forEach((light) => {
			light.intensity = 0;
		});

		// 선택된 조명만 켜기
		const lightTypes: LightType[] = ['ambient', 'directional', 'point', 'spot'];
		lightTypes.forEach((lightType, index) => {
			if (newEnabledLights.has(lightType)) {
				lightsRef.current[index].intensity = lightType === 'ambient' ? 0.4 : 0.8;
			}
		});

		setEnabledLights(newEnabledLights);
	};
	// #endregion

	const currentMaterial = materialData[selectedMaterial];

	return (
		<div className="p-8 space-y-8">
			<div className="neu-flat p-6 rounded-xl">
				<h1 className="text-3xl font-bold mb-4">{t('3D_재질제목')}</h1>
				<p className="text-gray-600 mb-6">
					{t('3D_재질설명')}
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* 3D 뷰어 */}
				<div className="neu-flat p-6 rounded-xl">
					<h2 className="text-xl font-semibold mb-4">{t('3D_재질갤러리')}</h2>
					<div 
						ref={mountRef} 
						className="border border-gray-200 rounded-lg overflow-hidden mb-4"
					/>
					
					{/* 현재 선택된 재질 정보 */}
					<div className="neu-inset p-4 rounded-lg">
						<h3 className="font-semibold text-lg text-green-600">
							{currentMaterial.name}
						</h3>
						<p className="text-sm text-gray-600 mt-1">
							{currentMaterial.description}
						</p>
					</div>
				</div>

				{/* 재질 선택 패널 */}
				<div className="neu-flat p-6 rounded-xl">
					<h2 className="text-xl font-semibold mb-4">{t('3D_재질선택')}</h2>
					<div className="space-y-3">
						{(Object.keys(materialData) as MaterialType[]).map((type) => {
							const data = materialData[type];
							const isSelected = selectedMaterial === type;
							
							return (
								<button
									key={type}
									onClick={() => changeMaterial(type)}
									className={`w-full p-3 rounded-lg text-left transition-all ${
										isSelected 
											? 'neu-inset bg-green-50' 
											: 'neu-raised hover:neu-inset'
									}`}
								>
									<h3 className="font-semibold text-sm">{data.name}</h3>
									<p className="text-xs text-gray-600 mt-1">
										{data.description}
									</p>
								</button>
							);
						})}
					</div>
				</div>

				{/* 조명 제어 패널 */}
				<div className="neu-flat p-6 rounded-xl">
					<h2 className="text-xl font-semibold mb-4">{t('3D_조명패널')}</h2>
					<div className="space-y-3">
						{(Object.keys(lightData) as LightType[]).map((type) => {
							const data = lightData[type];
							const isEnabled = enabledLights.has(type);
							
							return (
								<button
									key={type}
									onClick={() => toggleLight(type)}
									className={`w-full p-3 rounded-lg text-left transition-all ${
										isEnabled 
											? 'neu-inset bg-yellow-50' 
											: 'neu-raised hover:neu-inset'
									}`}
								>
									<h3 className="font-semibold text-sm">{data.name}</h3>
									<p className="text-xs text-gray-600 mt-1">
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
				<h2 className="text-xl font-semibold mb-4">{t('3D_조명이해')}</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<h3 className="text-lg font-semibold mb-3 text-purple-600">🎨 재질 특성</h3>
						<div className="space-y-2 text-sm">
							<div className="p-3 bg-purple-50 rounded">
								<strong>{t('3D_기본재질')}</strong>: {t('3D_기본재질설명')}
							</div>
							<div className="p-3 bg-purple-50 rounded">
								<strong>{t('3D_램버트재질')}</strong>: {t('3D_램버트재질설명')}
							</div>
							<div className="p-3 bg-purple-50 rounded">
								<strong>{t('3D_물리재질')}</strong>: {t('3D_물리재질설명')}
							</div>
						</div>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-3 text-orange-600">💡 조명 종류</h3>
						<div className="space-y-2 text-sm">
							<div className="p-3 bg-orange-50 rounded">
								<strong>{t('3D_환경광')}</strong>: 전체적으로 균일한 빛
							</div>
							<div className="p-3 bg-orange-50 rounded">
								<strong>{t('3D_방향광')}</strong>: 태양처럼 한 방향에서 오는 빛
							</div>
							<div className="p-3 bg-orange-50 rounded">
								<strong>{t('3D_점광원')}</strong>: 전구처럼 한 점에서 퍼지는 빛
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
