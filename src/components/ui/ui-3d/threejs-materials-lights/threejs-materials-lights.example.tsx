/*
  파일명: src/components/ui/ui-3d/threejs-materials-lights/threejs-materials-lights.example.tsx
  기능: Three.js의 다양한 재질(Materials)과 조명(Lights) 효과를 시연하는 예제
  책임: 사용자가 선택한 재질과 조명 조합에 따라 3D 객체를 렌더링하고, 각 요소의 시각적 차이를 비교할 수 있도록 한다.
*/

'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

import { useTranslations } from '@/hooks/useI18n';

// #region 타입
type MaterialType = 'basic' | 'lambert' | 'phong' | 'standard' | 'physical';
type LightType = 'ambient' | 'directional' | 'point' | 'spot';
// #endregion

interface ThreejsMaterialsLightsProps {
	colorVariant?: 'primary' | 'secondary';
}

export default function ThreejsMaterialsLightsExample({ 
	colorVariant = 'primary' 
}: ThreejsMaterialsLightsProps = {}) {
	// #region 훅 및 참조
	const t = useTranslations();
	const mountRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<THREE.Scene | null>(null);
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
	const meshRef = useRef<THREE.Mesh | null>(null);
	const lightsRef = useRef<THREE.Light[]>([]);
	// #endregion

	// #region 색상 variant에 따른 기본 색상
	const baseColor = colorVariant === 'primary' ? 0x3b82f6 : 0x06b6d4; // blue-500 vs cyan-500
	
	// #region 상수: 재질 및 조명 데이터
	const materialData = {
		basic: {
			name: t('3D_기본재질'),
			description: t('3D_기본재질설명'),
			create: (color: number = baseColor) => new THREE.MeshBasicMaterial({ color }),
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
	// #endregion

	// #region 상태
	const [selectedMaterial, setSelectedMaterial] =
		useState<MaterialType>('standard');
	const [enabledLights, setEnabledLights] = useState<Set<LightType>>(
		new Set(['ambient', 'directional'])
	);
	// #endregion

	// #region Three.js 씬 초기화
	useEffect(() => {
		if (!mountRef.current) return;

		const mount = mountRef.current;

		// #region 씬 및 렌더러 설정
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
	}, [lightData.ambient.color, lightData.directional.color, lightData.point.color, lightData.spot.color, materialData.standard]);
	// #endregion

	// #region 재질 및 조명 핸들러
	const changeMaterial = (type: MaterialType) => {
		if (!meshRef.current) return;

		const oldMaterial = meshRef.current.material as THREE.Material;
		oldMaterial.dispose();

		const newMaterial = materialData[type].create(0x00ff88);
		meshRef.current.material = newMaterial;
		setSelectedMaterial(type);
	};

	const toggleLight = (type: LightType) => {
		if (!sceneRef.current) return;

		const newEnabledLights = new Set(enabledLights);
		if (newEnabledLights.has(type)) {
			newEnabledLights.delete(type);
		} else {
			newEnabledLights.add(type);
		}

		lightsRef.current.forEach((light) => {
			light.intensity = 0;
		});

		const lightTypes: LightType[] = ['ambient', 'directional', 'point', 'spot'];
		lightTypes.forEach((lightType, index) => {
			if (newEnabledLights.has(lightType)) {
				lightsRef.current[index].intensity = lightType === 'ambient' ? 0.4 : 0.8;
			}
		});

		setEnabledLights(newEnabledLights);
	};
	// #endregion

	// #region 렌더링
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
				<div className="lg:col-span-2">
					<div className="neu-flat p-6 rounded-xl">
						<h2 className="text-xl font-semibold mb-4">{t('3D_재질갤러리')}</h2>
						<div 
							ref={mountRef} 
							className="border border-gray-200 rounded-lg overflow-hidden mb-4"
						/>
						
						<div className="neu-inset p-4 rounded-lg">
							<h3 className="font-semibold text-lg text-blue-600">
								{currentMaterial.name}
							</h3>
							<p className="text-sm text-gray-600 mt-1">
								{currentMaterial.description}
							</p>
						</div>
					</div>
				</div>

				{/* 컨트롤 패널 */}
				<div className="space-y-6">
					<div className="neu-flat p-6 rounded-xl">
						<h3 className="text-lg font-semibold mb-4">{t('3D_재질선택')}</h3>
						<div className="space-y-2">
							{(Object.keys(materialData) as MaterialType[]).map((type) => (
								<button
									key={type}
									onClick={() => changeMaterial(type)}
									className={`w-full p-2 text-left rounded-md transition-all ${
										selectedMaterial === type
											? 'neu-inset bg-blue-50'
											: 'neu-raised hover:neu-inset'
									}`}
								>
									{materialData[type].name}
								</button>
							))}
						</div>
					</div>

					<div className="neu-flat p-6 rounded-xl">
						<h3 className="text-lg font-semibold mb-4">{t('3D_조명선택')}</h3>
						<div className="space-y-2">
							{(Object.keys(lightData) as LightType[]).map((type) => (
								<label key={type} className="flex items-center gap-2 cursor-pointer">
									<input
										type="checkbox"
										checked={enabledLights.has(type)}
										onChange={() => toggleLight(type)}
										className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
									/>
									<span>{lightData[type].name}</span>
								</label>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* 핵심 이론 */}
			<div className="neu-flat p-6 rounded-xl">
				<h2 className="text-xl font-semibold mb-4">{t('3D_핵심이론')}</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="p-4 bg-blue-50 rounded-lg">
						<h3 className="font-semibold text-blue-800 mb-2">🎨 {t('3D_재질이란')}</h3>
						<p className="text-sm text-blue-600">
							{t('3D_재질이란설명')}
						</p>
					</div>
					<div className="p-4 bg-green-50 rounded-lg">
						<h3 className="font-semibold text-green-800 mb-2">💡 {t('3D_조명이란')}</h3>
						<p className="text-sm text-green-600">
							{t('3D_조명이란설명')}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
	// #endregion
} 