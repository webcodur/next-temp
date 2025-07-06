# Barrier3D 기술 문서

## 아키텍처 개요

Three.js WebGL 기반의 3D 차단기 시뮬레이션으로, 실시간 렌더링과 애니메이션을 제공합니다.

## 핵심 구현

### Three.js 씬 구성

```typescript
// 렌더러 생성
const renderer = new THREE.WebGLRenderer({
	antialias: true,
	alpha: true,
	powerPreference: 'high-performance',
});

// 씬과 카메라 설정
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
```

### 카메라 시점 시스템

```typescript
export const CAMERA_POSITIONS = {
	diagonal: {
		position: [3.5, 3.5, 3.5],
		lookAt: [0, 1.5, 0],
	},
	driver: {
		position: [5, 2, 0],
		lookAt: [0, 2, 0],
	},
	security: {
		position: [0, 6, 4],
		lookAt: [0, 2, 0],
	},
} as const;
```

### 애니메이션 시스템

```typescript
const createToggleHandler = (
	barrierArmRef: React.MutableRefObject<THREE.Group | null>,
	isOpen: boolean,
	duration: number
) => {
	const targetRotation = isOpen ? -Math.PI / 2 : 0;

	const animate = () => {
		const progress = easeInOutCubic(elapsedTime / duration);
		const currentRotation =
			startRotation + (targetRotation - startRotation) * progress;

		if (barrierArmRef.current) {
			barrierArmRef.current.rotation.z = currentRotation;
		}
	};
};
```

### 이징 함수

```typescript
export const easeInOutCubic = (t: number): number => {
	return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};
```

## 3D 모델링

### 차단기 구조

```typescript
// 중앙분리대 생성
const roundedRectShape = new THREE.Shape();
const medianGeometry = new THREE.ExtrudeGeometry(roundedRectShape, {
	depth: 0.2,
	bevelEnabled: false,
});

// 차단기 몸체
const bodyGeometry = new THREE.BoxGeometry(...SIZES.BARRIER_BODY);
const bodyMaterial = new THREE.MeshPhongMaterial({
	color: COLORS.BARRIER_BODY,
	shininess: 30,
});
```

### 조명 시스템

```typescript
export const createLights = (scene: THREE.Scene) => {
	// 주변광
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);

	// 직사광
	const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
	directionalLight.position.set(10, 10, 5);
	directionalLight.castShadow = true;

	// 그림자 설정
	directionalLight.shadow.mapSize.width = 2048;
	directionalLight.shadow.mapSize.height = 2048;
};
```

## 성능 최적화

### 렌더링 최적화

```typescript
// 픽셀 비율 제한
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));

// 그림자 최적화
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// 톤 매핑
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
```

### 메모리 관리

```typescript
useEffect(() => {
	return () => {
		// 애니메이션 정리
		if (animationIdRef.current) {
			cancelAnimationFrame(animationIdRef.current);
		}

		// 렌더러 정리
		if (rendererRef.current) {
			rendererRef.current.dispose();
		}

		// 씬 정리
		if (sceneRef.current) {
			sceneRef.current.clear();
		}
	};
}, []);
```

### 반응형 처리

```typescript
const handleResize = useCallback(() => {
	if (rendererRef.current && cameraRef.current) {
		const actualWidth = rect.width - 32;
		const actualHeight = rect.height - 32;

		cameraRef.current.aspect = actualWidth / actualHeight;
		cameraRef.current.updateProjectionMatrix();

		rendererRef.current.setSize(actualWidth, actualHeight);
	}
}, []);
```

## 상태 관리

### 운행 모드 시스템

```typescript
type OperationMode = 'always-open' | 'auto-operation' | 'bypass';

const OPERATION_MODE_NAMES = {
	'always-open': '상시개방',
	'auto-operation': '자동운행',
	bypass: '우회',
} as const;
```

### 애니메이션 상태

```typescript
const [isHovering, setIsHovering] = useState(false);
const [isButtonDisabled, setIsButtonDisabled] = useState(false);
const [isDropdownOpen, setIsDropdownOpen] = useState(false);
```

## 확장성

### 커스텀 시점 추가

```typescript
interface CustomCameraConfig {
	position: [number, number, number];
	lookAt: [number, number, number];
	fov?: number;
}

const addCustomView = (name: string, config: CustomCameraConfig) => {
	CAMERA_POSITIONS[name] = config;
};
```

### 재질 커스터마이징

```typescript
const createCustomMaterial = (color: number, shininess: number = 30) => {
	return new THREE.MeshPhongMaterial({
		color,
		shininess,
		specular: 0x111111,
	});
};
```

## 브라우저 호환성

### WebGL 지원 확인

```typescript
const checkWebGLSupport = () => {
	const canvas = document.createElement('canvas');
	const gl =
		canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
	return !!gl;
};
```

### 폴백 처리

```typescript
if (!checkWebGLSupport()) {
  return <div>WebGL을 지원하지 않는 브라우저입니다.</div>;
}
```
