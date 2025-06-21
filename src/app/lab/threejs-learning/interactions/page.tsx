'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

type InteractionType = 'orbit' | 'pan' | 'zoom' | 'click' | 'hover' | 'drag';

// 간단한 OrbitControls 구현
class SimpleOrbitControls {
	camera: THREE.PerspectiveCamera;
	domElement: HTMLCanvasElement;
	enableDamping = true;
	dampingFactor = 0.25;
	enableZoom = true;
	enablePan = true;
	enableRotate = true;

	private isMouseDown = false;
	private mouseX = 0;
	private mouseY = 0;
	private targetX = 0;
	private targetY = 0;
	private distance = 10;

	constructor(camera: THREE.PerspectiveCamera, domElement: HTMLCanvasElement) {
		this.camera = camera;
		this.domElement = domElement;
		this.setupEventListeners();
	}

	private setupEventListeners() {
		this.domElement.addEventListener('mousedown', this.onMouseDown.bind(this));
		this.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
		this.domElement.addEventListener('mouseup', this.onMouseUp.bind(this));
		this.domElement.addEventListener('wheel', this.onWheel.bind(this));
	}

	private onMouseDown(event: MouseEvent) {
		this.isMouseDown = true;
		this.mouseX = event.clientX;
		this.mouseY = event.clientY;
	}

	private onMouseMove(event: MouseEvent) {
		if (!this.isMouseDown || !this.enableRotate) return;

		const deltaX = event.clientX - this.mouseX;
		const deltaY = event.clientY - this.mouseY;

		this.targetX += deltaX * 0.01;
		this.targetY += deltaY * 0.01;
		this.targetY = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.targetY));

		this.mouseX = event.clientX;
		this.mouseY = event.clientY;
	}

	private onMouseUp() {
		this.isMouseDown = false;
	}

	private onWheel(event: WheelEvent) {
		if (!this.enableZoom) return;
		this.distance += event.deltaY * 0.01;
		this.distance = Math.max(3, Math.min(20, this.distance));
	}

	update() {
		const x = Math.cos(this.targetY) * Math.cos(this.targetX) * this.distance;
		const y = Math.sin(this.targetY) * this.distance;
		const z = Math.cos(this.targetY) * Math.sin(this.targetX) * this.distance;

		this.camera.position.set(x, y, z);
		this.camera.lookAt(0, 0, 0);
	}

	dispose() {
		this.domElement.removeEventListener('mousedown', this.onMouseDown.bind(this));
		this.domElement.removeEventListener('mousemove', this.onMouseMove.bind(this));
		this.domElement.removeEventListener('mouseup', this.onMouseUp.bind(this));
		this.domElement.removeEventListener('wheel', this.onWheel.bind(this));
	}
}

const interactionData = {
	orbit: {
		name: '궤도 회전',
		description: '마우스 드래그로 카메라를 회전시킨다',
		instruction: '마우스로 드래그해보세요',
	},
	pan: {
		name: '패닝',
		description: '마우스로 화면을 이동시킨다',
		instruction: 'Shift + 드래그로 이동해보세요',
	},
	zoom: {
		name: '줌',
		description: '마우스 휠로 확대/축소한다',
		instruction: '마우스 휠을 사용해보세요',
	},
	click: {
		name: '클릭 선택',
		description: '객체를 클릭해서 선택한다',
		instruction: '정육면체를 클릭해보세요',
	},
	hover: {
		name: '호버 효과',
		description: '마우스를 올리면 객체가 반응한다',
		instruction: '정육면체 위에 마우스를 올려보세요',
	},
	drag: {
		name: '드래그 이동',
		description: '객체를 드래그해서 이동시킨다',
		instruction: '정육면체를 드래그해보세요',
	},
};

export default function InteractionsPage() {
	const mountRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<THREE.Scene | null>(null);
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
	const controlsRef = useRef<SimpleOrbitControls | null>(null);
	const meshRef = useRef<THREE.Mesh | null>(null);
	const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
	const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());

	const [selectedInteraction, setSelectedInteraction] = useState<InteractionType>('orbit');
	const [isHovered, setIsHovered] = useState(false);
	const [isSelected, setIsSelected] = useState(false);

	useEffect(() => {
		if (!mountRef.current) return;

		const mount = mountRef.current; // ref 값을 변수로 복사

		// #region 기본 설정
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0xf0f4f8);
		sceneRef.current = scene;

		const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
		camera.position.set(5, 3, 5);
		cameraRef.current = camera;

		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(800, 600);
		rendererRef.current = renderer;
		mount.appendChild(renderer.domElement);

		// 궤도 컨트롤 생성
		const controls = new SimpleOrbitControls(camera, renderer.domElement);
		controlsRef.current = controls;
		// #endregion

		// #region 조명 설정
		const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
		directionalLight.position.set(5, 5, 5);
		scene.add(directionalLight);
		// #endregion

		// #region 인터랙티브 객체 생성
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshLambertMaterial({ color: 0x4285f4 });
		const mesh = new THREE.Mesh(geometry, material);
		meshRef.current = mesh;
		scene.add(mesh);

		// 참조용 그리드
		const gridHelper = new THREE.GridHelper(10, 10, 0xcccccc, 0xeeeeee);
		scene.add(gridHelper);

		// 축 헬퍼
		const axesHelper = new THREE.AxesHelper(2);
		scene.add(axesHelper);
		// #endregion

		// #region 마우스 이벤트 핸들러
		const onMouseMove = (event: MouseEvent) => {
			const rect = renderer.domElement.getBoundingClientRect();
			mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
			mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

			// 레이캐스팅
			raycasterRef.current.setFromCamera(mouseRef.current, camera);
			const intersects = raycasterRef.current.intersectObject(mesh);

			if (selectedInteraction === 'hover') {
				if (intersects.length > 0) {
					setIsHovered(true);
					renderer.domElement.style.cursor = 'pointer';
				} else {
					setIsHovered(false);
					renderer.domElement.style.cursor = 'default';
				}
			}
		};

		const onClick = (event: MouseEvent) => {
			if (selectedInteraction === 'click') {
				const rect = renderer.domElement.getBoundingClientRect();
				mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
				mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

				raycasterRef.current.setFromCamera(mouseRef.current, camera);
				const intersects = raycasterRef.current.intersectObject(mesh);

				setIsSelected(intersects.length > 0);
			}
		};

		renderer.domElement.addEventListener('mousemove', onMouseMove);
		renderer.domElement.addEventListener('click', onClick);
		// #endregion

		// #region 애니메이션 루프
		const animate = () => {
			requestAnimationFrame(animate);
			
			// 컨트롤 업데이트
			if (selectedInteraction === 'orbit' || selectedInteraction === 'zoom') {
				controls.update();
			}

			// 호버 효과
			if (meshRef.current && selectedInteraction === 'hover') {
				if (isHovered) {
					meshRef.current.scale.setScalar(1.1);
					(meshRef.current.material as THREE.MeshLambertMaterial).color.setHex(0xff6b6b);
				} else {
					meshRef.current.scale.setScalar(1);
					(meshRef.current.material as THREE.MeshLambertMaterial).color.setHex(0x4285f4);
				}
			}

			// 선택 효과
			if (meshRef.current && selectedInteraction === 'click') {
				if (isSelected) {
					meshRef.current.rotation.y += 0.05;
					(meshRef.current.material as THREE.MeshLambertMaterial).color.setHex(0x34a853);
				} else {
					(meshRef.current.material as THREE.MeshLambertMaterial).color.setHex(0x4285f4);
				}
			}

			renderer.render(scene, camera);
		};
		animate();
		// #endregion

		return () => {
			if (mount && renderer.domElement) {
				mount.removeChild(renderer.domElement);
			}
			controls.dispose();
			renderer.dispose();
			geometry.dispose();
			material.dispose();
			renderer.domElement.removeEventListener('mousemove', onMouseMove);
			renderer.domElement.removeEventListener('click', onClick);
		};
	}, [selectedInteraction, isHovered, isSelected]);

	// #region 인터랙션 타입 변경
	const changeInteraction = (type: InteractionType) => {
		setSelectedInteraction(type);
		setIsHovered(false);
		setIsSelected(false);

		// 컨트롤 설정 업데이트
		if (controlsRef.current) {
			controlsRef.current.enableRotate = type === 'orbit';
			controlsRef.current.enableZoom = type === 'zoom' || type === 'orbit';
			controlsRef.current.enablePan = type === 'pan';
		}

		// 메시 초기화
		if (meshRef.current) {
			meshRef.current.scale.setScalar(1);
			meshRef.current.rotation.set(0, 0, 0);
			(meshRef.current.material as THREE.MeshLambertMaterial).color.setHex(0x4285f4);
		}
	};
	// #endregion

	const currentData = interactionData[selectedInteraction];

	return (
		<div className="p-8 space-y-8">
			<div className="neu-flat p-6 rounded-xl">
				<h1 className="text-3xl font-bold mb-4">5단계: 인터랙션</h1>
				<p className="text-gray-600 mb-6">
					마우스와 키보드로 3D 장면과 상호작용해보자
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* 3D 뷰어 */}
				<div className="neu-flat p-6 rounded-xl">
					<h2 className="text-xl font-semibold mb-4">실습: 인터랙션 체험</h2>
					<div 
						ref={mountRef} 
						className="border border-gray-200 rounded-lg overflow-hidden mb-4"
					/>
					
					{/* 현재 인터랙션 안내 */}
					<div className="neu-inset p-4 rounded-lg">
						<h3 className="font-semibold text-lg text-blue-600 mb-2">
							{currentData.name}
						</h3>
						<p className="text-sm text-gray-600 mb-2">
							{currentData.description}
						</p>
						<p className="text-sm font-semibold text-green-600">
							💡 {currentData.instruction}
						</p>
					</div>
				</div>

				{/* 인터랙션 선택 패널 */}
				<div className="neu-flat p-6 rounded-xl">
					<h2 className="text-xl font-semibold mb-4">인터랙션 타입</h2>
					<div className="space-y-3">
						{(Object.keys(interactionData) as InteractionType[]).map((type) => {
							const data = interactionData[type];
							const isActive = selectedInteraction === type;
							
							return (
								<button
									key={type}
									onClick={() => changeInteraction(type)}
									className={`w-full p-4 rounded-lg text-left transition-all ${
										isActive 
											? 'neu-inset bg-blue-50' 
											: 'neu-raised hover:neu-inset'
									}`}
								>
									<h3 className="font-semibold text-sm mb-1">{data.name}</h3>
									<p className="text-xs text-gray-600">
										{data.description}
									</p>
								</button>
							);
						})}
					</div>

					{/* 상태 표시 */}
					<div className="mt-6 space-y-2">
						{selectedInteraction === 'hover' && (
							<div className={`neu-inset p-3 rounded-lg ${isHovered ? 'bg-red-50' : 'bg-gray-50'}`}>
								<span className="text-sm font-semibold">
									호버 상태: {isHovered ? '🔴 활성' : '⚫ 비활성'}
								</span>
							</div>
						)}
						
						{selectedInteraction === 'click' && (
							<div className={`neu-inset p-3 rounded-lg ${isSelected ? 'bg-green-50' : 'bg-gray-50'}`}>
								<span className="text-sm font-semibold">
									선택 상태: {isSelected ? '🟢 선택됨' : '⚫ 선택 안됨'}
								</span>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* 이론 설명 */}
			<div className="neu-flat p-6 rounded-xl">
				<h2 className="text-xl font-semibold mb-4">인터랙션 기초 이론</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div>
						<h3 className="text-lg font-semibold mb-2 text-blue-600">🎯 레이캐스팅</h3>
						<p className="text-sm text-gray-600">
							마우스 위치에서 3D 공간으로 광선을 쏘아 객체와의 교차점을 찾는다. 
							클릭, 호버 등의 상호작용 구현에 필수다.
						</p>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-2 text-green-600">🖱️ 마우스 이벤트</h3>
						<p className="text-sm text-gray-600">
							HTML5 Canvas의 마우스 이벤트를 3D 좌표로 변환한다. 
							정규화된 좌표(-1 ~ 1)로 변환하는 과정이 중요하다.
						</p>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-2 text-purple-600">🎮 카메라 컨트롤</h3>
						<p className="text-sm text-gray-600">
							OrbitControls 같은 컨트롤러로 직관적인 3D 네비게이션을 제공한다. 
							궤도 회전, 팬, 줌 기능을 포함한다.
						</p>
					</div>
				</div>

				{/* 코드 팁 */}
				<div className="mt-6 space-y-4">
					<div className="bg-gray-50 p-4 rounded-lg">
						<h4 className="font-semibold text-gray-800 mb-2">🔧 핵심 구현 패턴</h4>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
							<div>
								<h5 className="font-semibold mb-1">마우스 좌표 변환:</h5>
								<code className="text-gray-600 block">
									mouse.x = (event.clientX / width) * 2 - 1<br/>
									mouse.y = -(event.clientY / height) * 2 + 1
								</code>
							</div>
							<div>
								<h5 className="font-semibold mb-1">레이캐스팅:</h5>
								<code className="text-gray-600 block">
									raycaster.setFromCamera(mouse, camera)<br/>
									intersects = raycaster.intersectObjects()
								</code>
							</div>
						</div>
					</div>

					<div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
						<h4 className="font-semibold text-green-800">💡 실습 가이드</h4>
						<p className="text-sm text-green-700 mt-1">
							각 인터랙션을 직접 체험해보며 동작 원리를 이해해보자. 
							실제 3D 애플리케이션에서는 이런 기법들을 조합해 풍부한 사용자 경험을 만든다.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
} 