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
		return extractTextFromNode((node.props as { children?: React.ReactNode }).children);
	}
	return '';
};

// 텍스트 길이 기반 너비 계산 (한글/영문/숫자 고려)
export const calculateTextWidth = (text: string): number => {
	let width = 0;
	for (const char of text) {
		if (/[가-힣]/.test(char)) {
			width += 16; // 한글 (14px 폰트 기준)
		} else if (/[A-Za-z0-9]/.test(char)) {
			width += 8; // 영문/숫자
		} else {
			width += 10; // 특수문자
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
	
	const extractLabelTexts = (node: React.ReactNode): void => {
		React.Children.forEach(node, (child) => {
			if (React.isValidElement(child)) {
				if (child.type === GridFormRow) {
					// Row의 children에서 Label 찾기
					React.Children.forEach((child.props as { children?: React.ReactNode }).children, (rowChild) => {
						if (React.isValidElement(rowChild) && rowChild.type === GridFormLabel) {
							const labelText = extractTextFromNode((rowChild.props as GridFormLabelProps).children);
							const textWidth = calculateTextWidth(labelText);
							// required 표시 고려 (+20px)
							const totalWidth = textWidth + ((rowChild.props as GridFormLabelProps).required ? 20 : 0);
							maxWidth = Math.max(maxWidth, totalWidth);
						}
					});
				}
			}
		});
	};
	
	extractLabelTexts(children);
	
	// 패딩(32px) + 여유분(40px) 추가
	const totalWidth = maxWidth + 72;
	
	// 최소 120px, 최대 400px 제한
	const clampedWidth = Math.max(120, Math.min(400, totalWidth));
	
	return `${clampedWidth}px`;
};
// #endregion
