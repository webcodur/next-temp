'use client';

import React, { useImperativeHandle, forwardRef } from 'react';
import { TipTapEditor } from './tiptap-editor';
import type { TipTapEditorProps, EditorContent } from './tiptap-editor/types';
import { useLocale, useTranslations } from '@/hooks/ui-hooks/useI18n';

// #region 타입
interface EditorProps {
	value?: string;
	onChange?: (content: string) => void;
	placeholder?: string;
	height?: number;
	disabled?: boolean;
	toolbar?: string;
	plugins?: string[];
	colorVariant?: 'primary' | 'secondary';
	className?: string;
}

interface EditorRef {
	setContent: (content: string) => void;
	getContent: () => string;
}
// #endregion

const Editor = forwardRef<EditorRef, EditorProps>(({
	value = '',
	onChange,
	placeholder,
	height = 400,
	disabled = false,
	className = '',
}, ref) => {
	// #region 훅
	const { isRTL } = useLocale();
	const t = useTranslations();
	// #endregion

	// #region 상수
	// 다국어 처리된 placeholder 사용
	const resolvedPlaceholder = placeholder || t('에디터_플레이스홀더_내용입력');
	// #endregion

	// #region 핸들러
	const handleChange = (content: EditorContent) => {
		onChange?.(content.html);
	};
	// #endregion

	// #region ref 처리
	// TipTapEditor는 직접적인 ref 제어를 제공하지 않으므로
	// 현재는 placeholder로 구현
	useImperativeHandle(ref, () => ({
		setContent: () => {
			// TODO: TipTapEditor에서 ref 제어 메서드 제공 시 구현
			console.warn('setContent not implemented yet');
		},
		getContent: () => {
			// TODO: TipTapEditor에서 ref 제어 메서드 제공 시 구현
			console.warn('getContent not implemented yet');
			return '';
		},
	}));
	// #endregion

	// #region TipTap 설정
	const tipTapProps: TipTapEditorProps = {
		content: value,
		placeholder: resolvedPlaceholder,
		onChange: handleChange,
		editable: !disabled,
		showMenuBar: true,
		height: `${height}px`,
		className: className,
		onImageUpload: async (file: File) => {
			// TODO: 이미지 업로드 로직 구현 필요
			return URL.createObjectURL(file);
		},
		onFileUpload: async (file: File) => {
			// TODO: 파일 업로드 로직 구현 필요
			return URL.createObjectURL(file);
		}
	};
	// #endregion

	// #region 렌더링
	return (
		<div className={`tiptap-wrapper ${className}`} dir={isRTL ? 'rtl' : 'ltr'}>
			<TipTapEditor {...tipTapProps} />
		</div>
	);
	// #endregion
});

Editor.displayName = 'Editor';

export default Editor;