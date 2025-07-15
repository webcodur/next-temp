import * as THREE from 'three';
import { COLORS, POSITIONS, SIZES, SETTINGS } from './constants';

// WebGL 지원 여부 확인 유틸리티
export const isWebGLSupported = () => {
	try {
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
		return context !== null;
	} catch {
		return false;
	}
};

export const createRenderer = (width: number, height: number) => {
	try {
		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
			powerPreference: 'default', // 'high-performance'에서 'default'로 변경
			preserveDrawingBuffer: false, // 메모리 절약
			failIfMajorPerformanceCaveat: false, // 성능 문제가 있어도 실행
		});
		
		renderer.setSize(width, height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, SETTINGS.MAX_PIXEL_RATIO)); // 일관된 픽셀 비율
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFShadowMap; // PCFSoftShadowMap에서 기본 PCFShadowMap으로 변경
		renderer.outputColorSpace = THREE.SRGBColorSpace;
		renderer.toneMapping = THREE.LinearToneMapping; // ACESFilmicToneMapping에서 기본으로 변경
		renderer.toneMappingExposure = 1.0; // 1.2에서 1.0으로 변경
		
		return renderer;
	} catch (error) {
		console.error('WebGL 렌더러 생성 실패:', error);
		throw new Error('WebGL 렌더러를 초기화할 수 없습니다.');
	}
};

export const createLights = (scene: THREE.Scene) => {
	try {
		// 부드러운 환경광
		const ambientLight = new THREE.AmbientLight(0xffffff, SETTINGS.AMBIENT_LIGHT_INTENSITY);
		scene.add(ambientLight);

		// 메인 방향광 (보수적인 설정)
		const directionalLight = new THREE.DirectionalLight(0xffffff, SETTINGS.DIRECTIONAL_LIGHT_INTENSITY);
		directionalLight.position.set(...POSITIONS.LIGHT);
		directionalLight.castShadow = true;
		
		// 안전한 그림자 맵 크기 사용 (모든 GPU에서 호환)
		directionalLight.shadow.mapSize.setScalar(SETTINGS.FALLBACK_SHADOW_MAP_SIZE);
		directionalLight.shadow.camera.near = 0.1;
		directionalLight.shadow.camera.far = 50;
		directionalLight.shadow.bias = -0.0001;
		directionalLight.shadow.radius = 4; // 8에서 4로 줄임 (호환성)
		
		// 그림자 카메라 범위 최적화
		directionalLight.shadow.camera.left = -8;
		directionalLight.shadow.camera.right = 8;
		directionalLight.shadow.camera.top = 8;
		directionalLight.shadow.camera.bottom = -8;
		
		scene.add(directionalLight);

		// 보조 조명 (반대편에서)
		const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
		fillLight.position.set(-5, 8, -5);
		scene.add(fillLight);

		// 상단 조명 (부드러운 전체 조명)
		const topLight = new THREE.DirectionalLight(0xffffff, 0.2);
		topLight.position.set(0, 15, 0);
		scene.add(topLight);
	} catch (error) {
		console.error('조명 생성 실패:', error);
		// 기본 환경광만 추가 (fallback)
		const fallbackLight = new THREE.AmbientLight(0xffffff, 1.0);
		scene.add(fallbackLight);
	}
};

export const createGround = (scene: THREE.Scene) => {
	// 전체 바닥
	const groundGeometry = new THREE.PlaneGeometry(...SIZES.GROUND);
	const groundMaterial = new THREE.MeshPhongMaterial({
		color: COLORS.GROUND,
		shininess: 30,
		specular: 0x111111,
	});
	const ground = new THREE.Mesh(groundGeometry, groundMaterial);
	ground.rotation.x = -Math.PI / 2;
	ground.receiveShadow = true;
	scene.add(ground);

	// 중앙 도로면 (중앙분리대가 없는 부분을 도로 색상으로)
	const centerRoadGeometry = new THREE.PlaneGeometry(0.8, 6);
	const centerRoadMaterial = new THREE.MeshPhongMaterial({
		color: COLORS.ROAD_ASPHALT,
		shininess: 20,
		specular: 0x111111,
	});
	const centerRoad = new THREE.Mesh(centerRoadGeometry, centerRoadMaterial);
	centerRoad.rotation.x = -Math.PI / 2;
	centerRoad.position.set(0, 0.003, 0); // 바닥보다 살짝 위에
	centerRoad.receiveShadow = true;
	scene.add(centerRoad);

	// 좌측 차선 (들어오는 차량용) - 회색 아스팔트
	const leftRoadGeometry = new THREE.PlaneGeometry(...SIZES.ROAD_LEFT);
	const leftRoadMaterial = new THREE.MeshPhongMaterial({
		color: COLORS.ROAD_ASPHALT,
		shininess: 20,
		specular: 0x111111,
	});
	const leftRoad = new THREE.Mesh(leftRoadGeometry, leftRoadMaterial);
	leftRoad.rotation.x = -Math.PI / 2;
	leftRoad.position.set(-2.2, 0.005, 0); // 중앙분리대 너비 증가에 따른 위치 조정
	leftRoad.receiveShadow = true;
	scene.add(leftRoad);

	// 우측 차선 (나가는 차량용) - 회색 아스팔트
	const rightRoadGeometry = new THREE.PlaneGeometry(...SIZES.ROAD_RIGHT);
	const rightRoadMaterial = new THREE.MeshPhongMaterial({
		color: COLORS.ROAD_ASPHALT,
		shininess: 20,
		specular: 0x111111,
	});
	const rightRoad = new THREE.Mesh(rightRoadGeometry, rightRoadMaterial);
	rightRoad.rotation.x = -Math.PI / 2;
	rightRoad.position.set(2.2, 0.005, 0); // 중앙분리대 너비 증가에 따른 위치 조정
	rightRoad.receiveShadow = true;
	scene.add(rightRoad);

	// 차선 구분선 (좌측 차선 가장자리)
	const leftLineGeometry = new THREE.PlaneGeometry(0.1, 6);
	const leftLineMaterial = new THREE.MeshPhongMaterial({
		color: COLORS.ROAD_LINE,
		shininess: 50,
		specular: 0x222222,
	});
	const leftLine = new THREE.Mesh(leftLineGeometry, leftLineMaterial);
	leftLine.rotation.x = -Math.PI / 2;
	leftLine.position.set(-4, 0.01, 0);
	scene.add(leftLine);

	// 차선 구분선 (우측 차선 가장자리)
	const rightLineGeometry = new THREE.PlaneGeometry(0.1, 6);
	const rightLineMaterial = new THREE.MeshPhongMaterial({
		color: COLORS.ROAD_LINE,
		shininess: 50,
		specular: 0x222222,
	});
	const rightLine = new THREE.Mesh(rightLineGeometry, rightLineMaterial);
	rightLine.rotation.x = -Math.PI / 2;
	rightLine.position.set(4, 0.01, 0);
	scene.add(rightLine);
};

export const createBarrier = (
	scene: THREE.Scene,
	isOpen: boolean,
	ledMaterialRef: React.MutableRefObject<THREE.MeshPhongMaterial | null>,
	armMaterialRef: React.MutableRefObject<THREE.MeshPhongMaterial | null>,
	barrierArmRef: React.MutableRefObject<THREE.Group | null>
) => {
	// 차단기 전체를 담을 그룹 생성
	const barrierGroup = new THREE.Group();
	barrierGroup.userData = { isBarrier: true };

	// 중앙분리대 생성 (둥근 모서리 직사각형)
	const roundedRectShape = new THREE.Shape();
	const width = 0.8;
	const height = 4;
	const radius = 0.1; // 모서리 둥글기 정도

	// 둥근 모서리 직사각형 경로 생성
	roundedRectShape.moveTo(-width / 2 + radius, -height / 2);
	roundedRectShape.lineTo(width / 2 - radius, -height / 2);
	roundedRectShape.quadraticCurveTo(
		width / 2,
		-height / 2,
		width / 2,
		-height / 2 + radius
	);
	roundedRectShape.lineTo(width / 2, height / 2 - radius);
	roundedRectShape.quadraticCurveTo(
		width / 2,
		height / 2,
		width / 2 - radius,
		height / 2
	);
	roundedRectShape.lineTo(-width / 2 + radius, height / 2);
	roundedRectShape.quadraticCurveTo(
		-width / 2,
		height / 2,
		-width / 2,
		height / 2 - radius
	);
	roundedRectShape.lineTo(-width / 2, -height / 2 + radius);
	roundedRectShape.quadraticCurveTo(
		-width / 2,
		-height / 2,
		-width / 2 + radius,
		-height / 2
	);

	const extrudeSettings = {
		depth: 0.2,
		bevelEnabled: false,
	};

	const medianGeometry = new THREE.ExtrudeGeometry(
		roundedRectShape,
		extrudeSettings
	);
	const medianMaterial = new THREE.MeshPhongMaterial({
		color: COLORS.CURB,
		shininess: 20,
		specular: 0x111111,
	});
	const median = new THREE.Mesh(medianGeometry, medianMaterial);
	median.position.set(...POSITIONS.MEDIAN_STRIP);
	median.rotation.x = -Math.PI / 2; // 바닥에 평평하게 눕힘
	median.castShadow = true;
	median.receiveShadow = true;
	barrierGroup.add(median);

	// 차단기 몸체
	const bodyGeometry = new THREE.BoxGeometry(...SIZES.BARRIER_BODY);
	const bodyMaterial = new THREE.MeshPhongMaterial({
		color: COLORS.BARRIER_BODY,
		shininess: 60,
		specular: 0x333333,
	});
	const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
	body.position.set(...POSITIONS.BARRIER_BODY);
	body.castShadow = true;
	barrierGroup.add(body);

	// LED
	const ledGeometry = new THREE.SphereGeometry(...SIZES.LED);
	const ledMaterial = new THREE.MeshPhongMaterial({
		color: isOpen ? COLORS.LED_OPEN : COLORS.LED_CLOSED,
		emissive: isOpen ? COLORS.LED_EMISSIVE_OPEN : COLORS.LED_EMISSIVE_CLOSED,
		shininess: 100,
		specular: 0x444444,
	});
	ledMaterialRef.current = ledMaterial;
	const led = new THREE.Mesh(ledGeometry, ledMaterial);
	led.position.set(...POSITIONS.LED);
	barrierGroup.add(led);

	// 차단기 팔
	const armGroup = new THREE.Group();
	armGroup.position.set(...POSITIONS.ARM_GROUP);
	barrierGroup.add(armGroup);
	barrierArmRef.current = armGroup;

	const armGeometry = new THREE.BoxGeometry(...SIZES.ARM);
	const armMaterial = new THREE.MeshPhongMaterial({
		color: isOpen ? COLORS.ARM_OPEN : COLORS.ARM_CLOSED,
		shininess: 80,
		specular: 0x222222,
	});
	armMaterialRef.current = armMaterial;
	const arm = new THREE.Mesh(armGeometry, armMaterial);
	arm.position.set(...POSITIONS.ARM);
	arm.castShadow = true;
	armGroup.add(arm);

	if (isOpen) {
		armGroup.rotation.z = Math.PI / 2;
	}

	// 차단기 그룹을 씬에 추가
	scene.add(barrierGroup);
};
