import React from 'react';
import type { GridFormLabelProps } from './types';

// #region 헬퍼 함수들
// React.ReactNode에서 텍스트 추출
export const extractTextFromNode = (node: React.ReactNode): string => {
	if (typeof node === 'string') {
		return node;
	}
	if (typeof node === 'number') {
		return node.toString();
	}
	if (Array.isArray(node)) {
		return node.map(extractTextFromNode).join('');
	}
	if (React.isValidElement(node)) {
		return extractTextFromNode(
			(node.props as { children?: React.ReactNode }).children
		);
	}
	return '';
};

// 텍스트 길이 기반 너비 계산 (한글/영문/숫자 고려)
export const calculateTextWidth = (text: string): number => {
	let width = 0;
	for (const char of text) {
		if (/[가-힣]/.test(char)) {
			width += 18; // 한글 (더 넉넉하게)
		} else if (/[A-Za-z0-9]/.test(char)) {
			width += 9; // 영문/숫자 (더 넉넉하게)
		} else {
			width += 12; // 특수문자 (더 넉넉하게)
		}
	}
	return width;
};

// children에서 모든 Label 텍스트 추출하여 최적 라벨 너비 계산
export const calculateOptimalLabelWidth = (
	children: React.ReactNode,
	GridFormRow: React.ComponentType<import('./types').GridFormRowProps>,
	GridFormLabel: React.ComponentType<import('./types').GridFormLabelProps>
): string => {
	let maxWidth = 0;
	const allLabelsDetailed: Array<{text: string, width: number, hasRequired: boolean}> = [];
	
	const extractLabelTextsDetailed = (node: React.ReactNode): void => {
		React.Children.forEach(node, (child) => {
			if (React.isValidElement(child)) {
				if (child.type === GridFormRow) {
					// Row의 children에서 Label 찾기
					React.Children.forEach(
						(child.props as { children?: React.ReactNode }).children,
						(rowChild) => {
							if (
								React.isValidElement(rowChild) &&
								rowChild.type === GridFormLabel
							) {
								const labelText = extractTextFromNode(
									(rowChild.props as GridFormLabelProps).children
								);
								const textWidth = calculateTextWidth(labelText);
								const hasRequired = !!(rowChild.props as GridFormLabelProps).required;
								const totalWidth = textWidth + (hasRequired ? 20 : 0);
								
								allLabelsDetailed.push({
									text: labelText,
									width: totalWidth,
									hasRequired
								});
								
								maxWidth = Math.max(maxWidth, totalWidth);
							}
						}
					);
				}
			}
		});
	};

	extractLabelTextsDetailed(children);

	// 패딩(32px) + 여유분(40px) 추가
	const totalWidth = maxWidth + 72;

	// 최소 120px, 최대 400px 제한
	const clampedWidth = Math.max(120, Math.min(400, totalWidth));

	// 디버깅용 로그 (개발 환경에서만)
	if (process.env.NODE_ENV === 'development') {
		const longestLabel = allLabelsDetailed.reduce((prev, current) => 
			(current.width > prev.width) ? current : prev, allLabelsDetailed[0] || {text: '', width: 0, hasRequired: false}
		);
		
		console.log('🔧 GridForm Label Width Calculation (Detail View):', {
			totalLabelsFound: allLabelsDetailed.length,
			allLabelsWithDetails: allLabelsDetailed,
			longestLabel: longestLabel ? `"${longestLabel.text}" (${longestLabel.width}px, required: ${longestLabel.hasRequired})` : 'none',
			maxWidthCalculated: `${maxWidth}px`,
			totalWidthWithPadding: `${totalWidth}px (${maxWidth} + 72px padding)`,
			clampedWidth: `${clampedWidth}px (min: 120px, max: 400px)`,
			finalWidth: `${clampedWidth}px`,
		});
	}

	return `${clampedWidth}px`;
};

// 기본뷰에서 열별 필드명 길이 최적화 (반응형 고려)
export const calculateColumnLabelWidths = (
	children: React.ReactNode,
	GridFormRow: React.ComponentType<import('./types').GridFormRowProps>,
	GridFormLabel: React.ComponentType<import('./types').GridFormLabelProps>,
	columnsCount: number = 2
): string[] => {
	const allLabels: string[] = [];

	// 모든 라벨 텍스트 수집
	const collectAllLabelTexts = (node: React.ReactNode): void => {
		React.Children.forEach(node, (child) => {
			if (React.isValidElement(child)) {
				if (child.type === GridFormRow) {
					// Row의 children에서 Label 찾기
					React.Children.forEach(
						(child.props as { children?: React.ReactNode }).children,
						(rowChild) => {
							if (
								React.isValidElement(rowChild) &&
								rowChild.type === GridFormLabel
							) {
								const labelText = extractTextFromNode(
									(rowChild.props as GridFormLabelProps).children
								);
								allLabels.push(labelText);
							}
						}
					);
				}
			}
		});
	};

	collectAllLabelTexts(children);

	// 모든 라벨 중 최대 너비 계산
	let maxWidth = 0;
	let longestLabel = '';
	allLabels.forEach((labelText) => {
		const textWidth = calculateTextWidth(labelText);
		if (textWidth > maxWidth) {
			maxWidth = textWidth;
			longestLabel = labelText;
		}
	});

	// 패딩(24px) + 여유분(30px) + required 표시(20px) 추가
	const totalWidth = maxWidth + 74;

	// 최소 120px, 최대 320px 제한 (더 넉넉하게)
	const clampedWidth = Math.max(120, Math.min(320, totalWidth));
	const unifiedWidth = `${clampedWidth}px`;

	// 디버깅용 로그 (개발 환경에서만)
	if (process.env.NODE_ENV === 'development') {
		console.log('🔧 GridForm Label Width Calculation (Default View):', {
			columnsCount,
			totalLabelsFound: allLabels.length,
			allLabels,
			longestLabel: `"${longestLabel}" (${longestLabel.length} chars)`,
			maxWidth: `${maxWidth}px`,
			totalWidthWithPadding: `${totalWidth}px (${maxWidth} + 74px padding)`,
			clampedWidth: `${clampedWidth}px (min: 120px, max: 320px)`,
			finalUnifiedWidth: unifiedWidth,
			appliedToAllColumns: `${columnsCount} columns`,
		});
	}

	// 모든 열에 동일한 너비 적용 (반응형에서 1열이 되어도 일관성 유지)
	return Array.from({ length: columnsCount }, () => unifiedWidth);
};

// 룰즈 컬럼 동적 너비 계산
export const calculateOptimalRulesWidth = (
	children: React.ReactNode,
	GridFormRow: React.ComponentType<import('./types').GridFormRowProps>,
	GridFormRules: React.ComponentType<import('./types').GridFormRulesProps>
): string => {
	let maxWidth = 0;
	const allRulesDetailed: Array<{text: string, width: number}> = [];
	
	const extractRulesTexts = (node: React.ReactNode): void => {
		React.Children.forEach(node, (child) => {
			if (React.isValidElement(child)) {
				if (child.type === GridFormRow) {
					// Row의 children에서 Rules 찾기
					React.Children.forEach(
						(child.props as { children?: React.ReactNode }).children,
						(rowChild) => {
							if (
								React.isValidElement(rowChild) &&
								rowChild.type === GridFormRules
							) {
								const rulesText = extractTextFromNode(
									(rowChild.props as import('./types').GridFormRulesProps).children
								);
								const textWidth = calculateTextWidth(rulesText);
								
								allRulesDetailed.push({
									text: rulesText,
									width: textWidth
								});
								
								maxWidth = Math.max(maxWidth, textWidth);
							}
						}
					);
				}
			}
		});
	};

	extractRulesTexts(children);

	// 룰즈가 없는 경우 최소 너비 반환
	if (allRulesDetailed.length === 0) {
		return '120px';
	}

	// 패딩(24px) + 여유분(40px) 추가
	const totalWidth = maxWidth + 64;

	// 최소 120px, 최대 300px 제한 (룰즈는 적당히 제한)
	const clampedWidth = Math.max(120, Math.min(300, totalWidth));

	// 디버깅용 로그 (개발 환경에서만)
	if (process.env.NODE_ENV === 'development') {
		const longestRules = allRulesDetailed.reduce((prev, current) => 
			(current.width > prev.width) ? current : prev, allRulesDetailed[0] || {text: '', width: 0}
		);
		
		console.log('🔧 GridForm Rules Width Calculation:', {
			totalRulesFound: allRulesDetailed.length,
			allRulesWithDetails: allRulesDetailed,
			longestRules: longestRules ? `"${longestRules.text}" (${longestRules.width}px)` : 'none',
			maxWidthCalculated: `${maxWidth}px`,
			totalWidthWithPadding: `${totalWidth}px (${maxWidth} + 64px padding)`,
			clampedWidth: `${clampedWidth}px (min: 120px, max: 300px)`,
			finalWidth: `${clampedWidth}px`,
		});
	}

	return `${clampedWidth}px`;
};
// #endregion
