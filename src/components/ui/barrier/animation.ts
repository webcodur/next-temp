import * as THREE from 'three';
import { COLORS } from './constants';

export const easeInOutCubic = (t: number): number => {
	return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export const interpolateColor = (
	startColor: number,
	targetColor: number,
	progress: number
): number => {
	const startR = (startColor >> 16) & 0xff;
	const startG = (startColor >> 8) & 0xff;
	const startB = startColor & 0xff;

	const targetR = (targetColor >> 16) & 0xff;
	const targetG = (targetColor >> 8) & 0xff;
	const targetB = targetColor & 0xff;

	const currentR = Math.round(startR + (targetR - startR) * progress);
	const currentG = Math.round(startG + (targetG - startG) * progress);
	const currentB = Math.round(startB + (targetB - startB) * progress);

	return (currentR << 16) | (currentG << 8) | currentB;
};

export const createToggleHandler = (
	isOpen: boolean,
	animationDuration: number,
	barrierArmRef: React.MutableRefObject<THREE.Group | null>,
	armMaterialRef: React.MutableRefObject<THREE.MeshPhongMaterial | null>,
	ledMaterialRef: React.MutableRefObject<THREE.MeshPhongMaterial | null>,
	onToggle?: () => void
) => {
	return () => {
		if (!barrierArmRef.current || !armMaterialRef.current || !onToggle) return;

		const targetRotation = isOpen ? 0 : Math.PI / 2;
		const startRotation = barrierArmRef.current.rotation.z;
		const startColor = isOpen ? COLORS.ARM_OPEN : COLORS.ARM_CLOSED;
		const targetColor = isOpen ? COLORS.ARM_CLOSED : COLORS.ARM_OPEN;
		const startTime = Date.now();

		const animateRotation = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / animationDuration, 1);
			const eased = easeInOutCubic(progress);

			// 회전 애니메이션
			if (barrierArmRef.current) {
				barrierArmRef.current.rotation.z =
					startRotation + (targetRotation - startRotation) * eased;
			}

			// 색상 애니메이션
			if (armMaterialRef.current) {
				const currentColor = interpolateColor(startColor, targetColor, eased);
				armMaterialRef.current.color.setHex(currentColor);
			}

			// LED 색상 변경
			if (ledMaterialRef.current) {
				const newLedColor = !isOpen ? COLORS.LED_OPEN : COLORS.LED_CLOSED;
				const newEmissive = !isOpen
					? COLORS.LED_EMISSIVE_OPEN
					: COLORS.LED_EMISSIVE_CLOSED;
				ledMaterialRef.current.color.setHex(newLedColor);
				ledMaterialRef.current.emissive.setHex(newEmissive);
			}

			if (progress < 1) {
				requestAnimationFrame(animateRotation);
			} else {
				// 최종 색상 설정
				armMaterialRef.current?.color.setHex(targetColor);
				if (ledMaterialRef.current) {
					const finalLedColor = !isOpen ? COLORS.LED_OPEN : COLORS.LED_CLOSED;
					const finalEmissive = !isOpen
						? COLORS.LED_EMISSIVE_OPEN
						: COLORS.LED_EMISSIVE_CLOSED;
					ledMaterialRef.current.color.setHex(finalLedColor);
					ledMaterialRef.current.emissive.setHex(finalEmissive);
				}
				onToggle();
			}
		};

		animateRotation();
	};
};
