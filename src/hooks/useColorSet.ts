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

	console.log(`✅ 색상 적용: ${colorSet.name} (${isDark ? '다크' : '라이트'})`);
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

	// 초기화 (한번만 실행)
	useEffect(() => {
		console.log('🚀 색상 시스템 초기화 시작');

		// localStorage에서 불러오기
		const stored = localStorage.getItem('color-set');
		if (stored && stored in COLOR_SETS && stored !== colorSet) {
			console.log(`📦 localStorage에서 복원: ${stored}`);
			setColorSetState(stored as ColorSetKey);
			updateColorScale(stored as ColorSetKey);
		} else {
			updateColorScale(colorSet);
		}

		console.log('✅ 색상 시스템 초기화 완료');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // 빈 배열 - 한번만 실행

	// 다크모드 감지 (한번만 설정)
	useEffect(() => {
		if (typeof window === 'undefined') return;

		console.log('🔍 다크모드 감지 설정');

		const observer = new MutationObserver(() => {
			console.log('🌓 테마 변경 감지 - 색상 업데이트');
			updateColorScale(colorSet);
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class'],
		});

		return () => {
			observer.disconnect();
			console.log('🔍 다크모드 감지 해제');
		};
	}, [colorSet]); // colorSet 변경시에도 재설정

	// 색상 변경 함수
	const setColorSet = useCallback(
		(newColorSet: ColorSetKey) => {
			console.log(`🎨 색상 변경: ${colorSet} → ${newColorSet}`);

			// 1. 상태 업데이트
			setColorSetState(newColorSet);

			// 2. localStorage 저장
			localStorage.setItem('color-set', newColorSet);

			// 3. 색상 적용
			updateColorScale(newColorSet);

			console.log(`✅ 색상 변경 완료: ${newColorSet}`);
		},
		[colorSet, setColorSetState]
	);

	return {
		colorSet,
		setColorSet,
		colorSetName: COLOR_SETS[colorSet].name,
	};
}
