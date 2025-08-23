'use client';

import { useEffect, useCallback } from 'react';
import { useAtom } from 'jotai';
import { colorSetAtom, COLOR_SETS, type ColorSetKey } from '@/store/colorSet';

// 유틸: 값 범위 고정
const clamp = (value: number, min: number, max: number) =>
	Math.max(min, Math.min(max, value));

// 색상 스케일 업데이트 (단순화)
const updateColorScale = (colorSetKey: ColorSetKey) => {
	if (typeof window === 'undefined') return;

	const colorSet = COLOR_SETS[colorSetKey];
	const isDark = document.documentElement.classList.contains('dark');

	// 다크/라이트별 기본 색상 선택
	const primaryColor = isDark ? colorSet.primary.dark : colorSet.primary.light;
	const secondaryColor = isDark
		? colorSet.secondary.dark
		: colorSet.secondary.light;

	// 오프셋 배열
	const offsets = isDark
		? [-45, -35, -25, -15, -8, 0, 8, 18, 30, 42] // 다크: 어두운 → 밝은
		: [50, 42, 32, 22, 12, 0, -12, -22, -32, -45]; // 라이트: 밝은 → 어두운

	// 기본 색상 변수 설정
	document.documentElement.style.setProperty('--primary', primaryColor);
	document.documentElement.style.setProperty('--secondary', secondaryColor);

	// 스케일 계산
	['primary', 'secondary'].forEach((prefix) => {
		const color = prefix === 'primary' ? primaryColor : secondaryColor;
		const [hStr, sStr, lStr] = color.split(' ');
		const h = hStr.trim();
		const s = sStr.trim();
		const lNum = Number(lStr.replace('%', ''));

		offsets.forEach((offset, idx) => {
			const newL = clamp(lNum + offset, 0, 100);
			const cssValue = `${h} ${s} ${newL}%`;
			document.documentElement.style.setProperty(
				`--${prefix}-${idx}`,
				cssValue
			);
		});
	});
};

/**
 * 단순명료한 색상 시스템 훅
 * - 모든 로직이 여기에 집중됨
 * - localStorage 자동 처리
 * - 다크모드 자동 감지
 * - 무조건 작동함
 */
export function useColorSet() {
	const [colorSet, setColorSetState] = useAtom(colorSetAtom);

	// 초기화 (한번만 실행) - atomWithStorage가 자동으로 localStorage 처리
	useEffect(() => {
		updateColorScale(colorSet);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // 빈 배열 - 한번만 실행

	// 다크모드 감지 (한번만 설정)
	useEffect(() => {
		if (typeof window === 'undefined') return;
		const observer = new MutationObserver(() => {
			updateColorScale(colorSet);
		});
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class'],
		});
		return () => {
			observer.disconnect();
		};
	}, [colorSet]); // colorSet 변경시에도 재설정

	// 색상 변경 함수 - atomWithStorage가 자동으로 localStorage 처리
	const setColorSet = useCallback(
		(newColorSet: ColorSetKey) => {
			// 1. 상태 업데이트 (localStorage 자동 저장됨)
			setColorSetState(newColorSet);

			// 2. 색상 적용
			updateColorScale(newColorSet);
		},
		[setColorSetState]
	);

	return {
		colorSet,
		setColorSet,
		colorSetName: COLOR_SETS[colorSet].name,
	};
}
