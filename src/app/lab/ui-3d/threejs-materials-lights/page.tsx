'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

type MaterialType = 'basic' | 'lambert' | 'phong' | 'standard' | 'physical';
type LightType = 'ambient' | 'directional' | 'point' | 'spot';

const materialData = {
	basic: {
		name: 'Basic Material',
		description: '조명에 영향받지 않는 기본 재질',
		create: (color: number) => new THREE.MeshBasicMaterial({ color }),
	},
	lambert: {
		name: 'Lambert Material',
		description: '확산 반사만 있는 무광택 재질',
		create: (color: number) => new THREE.MeshLambertMaterial({ color }),
	},
	phong: {
		name: 'Phong Material',
		description: '반짝이는 하이라이트가 있는 재질',
		create: (color: number) =>
			new THREE.MeshPhongMaterial({ color, shininess: 100 }),
	},
	standard: {
		name: 'Standard Material',
		description: '물리 기반 렌더링(PBR) 표준 재질',
		create: (color: number) =>
			new THREE.MeshStandardMaterial({
				color,
				metalness: 0.3,
				roughness: 0.4,
			}),
	},
	physical: {
		name: 'Physical Material',
		description: 'Standard의 확장된 물리 기반 재질',
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
		name: '환경광',
		description: '전체적으로 균일한 빛',
		color: 0x404040,
	},
	directional: {
		name: '방향광',
		description: '태양처럼 한 방향에서 오는 빛',
		color: 0xffffff,
	},
	point: {
		name: '점광원',
		description: '전구처럼 한 점에서 퍼지는 빛',
		color: 0xffffff,
	},
	spot: {
		name: '스포트라이트',
		description: '원뿔 모양으로 퍼지는 빛',
		color: 0xffffff,
	},
};

export default function MaterialsLightsPage() {
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
		const newEnabledLights = new Set(enabledLights);

		if (newEnabledLights.has(type)) {
			newEnabledLights.delete(type);
		} else {
			newEnabledLights.add(type);
		}

		setEnabledLights(newEnabledLights);

		// 조명 on/off 적용
		lightsRef.current.forEach((light, index) => {
			const lightType = Object.keys(lightData)[index] as LightType;
			light.visible = newEnabledLights.has(lightType);
		});
	};
	// #endregion

	return (
		<div className="p-8 space-y-8">
			<div className="neu-flat p-6 rounded-xl">
				<h1 className="text-3xl font-bold mb-4">3단계: 재질과 조명</h1>
				<p className="text-muted-foreground mb-6">
					다양한 Material과 Light를 조합해 사실적인 3D 렌더링을 만들어보자
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* 3D 뷰어 */}
				<div className="neu-flat p-6 rounded-xl">
					<h2 className="text-xl font-semibold mb-4">실습: 재질과 조명 실험</h2>
					<div
						ref={mountRef}
						className="border border-border rounded-lg overflow-hidden mb-4"
					/>

					<div className="space-y-3">
						<div className="neu-inset p-3 rounded-lg">
							<span className="text-sm font-semibold">현재 재질: </span>
							<span className="text-primary">
								{materialData[selectedMaterial].name}
							</span>
						</div>
						<div className="neu-inset p-3 rounded-lg">
							<span className="text-sm font-semibold">활성 조명: </span>
							<span className="text-success">
								{Array.from(enabledLights)
									.map((type) => lightData[type].name)
									.join(', ')}
							</span>
						</div>
					</div>
				</div>

				{/* 컨트롤 패널 */}
				<div className="space-y-6">
					{/* 재질 선택 */}
					<div className="neu-flat p-6 rounded-xl">
						<h2 className="text-xl font-semibold mb-4">재질 선택</h2>
						<div className="space-y-2">
							{(Object.keys(materialData) as MaterialType[]).map((type) => {
								const data = materialData[type];
								const isSelected = selectedMaterial === type;

								return (
									<button
										key={type}
										onClick={() => changeMaterial(type)}
										className={`w-full p-3 rounded-lg text-left transition-all ${
											isSelected ? 'neu-inset' : 'neu-raised hover:neu-inset'
										}`}>
										<h3 className="font-semibold text-sm">{data.name}</h3>
										<p className="text-xs text-muted-foreground mt-1">
											{data.description}
										</p>
									</button>
								);
							})}
						</div>
					</div>

					{/* 조명 선택 */}
					<div className="neu-flat p-6 rounded-xl">
						<h2 className="text-xl font-semibold mb-4">조명 제어</h2>
						<div className="space-y-2">
							{(Object.keys(lightData) as LightType[]).map((type) => {
								const data = lightData[type];
								const isEnabled = enabledLights.has(type);

								return (
									<button
										key={type}
										onClick={() => toggleLight(type)}
										className={`w-full p-3 rounded-lg text-left transition-all ${
											isEnabled
												? 'neu-inset bg-warning/10'
												: 'neu-raised hover:neu-inset'
										}`}>
										<div className="flex items-center justify-between">
											<div>
												<h3 className="font-semibold text-sm">{data.name}</h3>
												<p className="text-xs text-muted-foreground mt-1">
													{data.description}
												</p>
											</div>
											<div
												className={`w-3 h-3 rounded-full ${
													isEnabled ? 'bg-warning' : 'bg-muted'
												}`}
											/>
										</div>
									</button>
								);
							})}
						</div>
					</div>
				</div>
			</div>

			{/* 이론 설명 */}
			<div className="neu-flat p-6 rounded-xl">
				<h2 className="text-xl font-semibold mb-4">
					Material과 Light 이해하기
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<h3 className="text-lg font-semibold mb-3 text-primary">
							🎨 Material 종류
						</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<strong>Basic:</strong> 조명 무시, 단순 색상
							</li>
							<li>
								<strong>Lambert:</strong> 확산 반사, 무광택
							</li>
							<li>
								<strong>Phong:</strong> 반사광 포함, 광택
							</li>
							<li>
								<strong>Standard:</strong> 물리 기반(PBR)
							</li>
							<li>
								<strong>Physical:</strong> 고급 물리 효과
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-3 text-warning">
							💡 Light 종류
						</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<strong>Ambient:</strong> 전체 균일 조명
							</li>
							<li>
								<strong>Directional:</strong> 태양광 같은 평행광
							</li>
							<li>
								<strong>Point:</strong> 전구 같은 점광원
							</li>
							<li>
								<strong>Spot:</strong> 손전등 같은 원뿔광
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-6 bg-warning/10 p-4 rounded-lg border-l-4 border-warning">
					<h4 className="font-semibold text-warning-foreground">
						💡 조합 실험하기
					</h4>
					<p className="text-sm text-warning-foreground/80 mt-1">
						다양한 재질과 조명을 조합해보며 각각의 특성을 이해해보자. 특히 물리
						기반 재질은 조명과의 상호작용이 매우 사실적이다.
					</p>
				</div>
			</div>
		</div>
	);
}
