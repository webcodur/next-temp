'use client';

import React, { useRef, useEffect } from 'react';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';
import { useLocale, useTranslations } from '@/hooks/useI18n';

interface EditorProps {
	value?: string;
	onChange?: (content: string) => void;
	placeholder?: string;
	height?: number;
	disabled?: boolean;
	toolbar?: string;
	plugins?: string[];
	className?: string;
}

const Editor: React.FC<EditorProps> = ({
	value = '',
	onChange,
	placeholder,
	height = 400,
	disabled = false,
	toolbar,
	plugins,
	className = '',
}) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const editorRef = useRef<any>(null);
	const { isRTL, currentLocale } = useLocale();
	const t = useTranslations();
	
	// 다국어 처리된 placeholder 사용
	const resolvedPlaceholder = placeholder || t('에디터_플레이스홀더_내용입력');

	const defaultToolbar = isRTL
		? 'undo redo | blocks | ' +
    'bold italic forecolor backcolor | alignright aligncenter ' +
    'alignleft alignjustify | bullist numlist outdent indent | ' +
    'removeformat | help'
		: 'undo redo | blocks | ' +
    'bold italic forecolor backcolor | alignleft aligncenter ' +
    'alignright alignjustify | bullist numlist outdent indent | ' +
    'removeformat | help';

	const defaultPlugins = [
		'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
		'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
		'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
	];

	// RTL에 따른 에디터 설정
	const getEditorConfig = () => ({
		height,
		menubar: false,
		plugins: plugins || defaultPlugins,
		toolbar: toolbar || defaultToolbar,
		placeholder: resolvedPlaceholder,
		directionality: (isRTL ? 'rtl' : 'ltr') as 'rtl' | 'ltr',
		language: currentLocale === 'ar' ? 'ar' : currentLocale === 'en' ? 'en' : 'ko_KR',
		content_style: `
			body { 
				font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
				font-size: 14px;
				direction: ${isRTL ? 'rtl' : 'ltr'};
				text-align: ${isRTL ? 'right' : 'left'};
			}
			.mce-content-body { 
				${isRTL ? 'margin-right: 22px;' : 'margin-left: 22px;'}
			}
		`,
		branding: false,
		resize: false,
		statusbar: false,
		setup: (editor: unknown) => {
			const typedEditor = editor as { on: (event: string, callback: () => void) => void; getContent: () => string };
			typedEditor.on('change', () => {
				const content = typedEditor.getContent();
				onChange?.(content);
			});
		},
	});

	useEffect(() => {
		if (editorRef.current) {
			editorRef.current.setContent(value);
		}
	}, [value]);

	return (
		<div className={`overflow-hidden rounded-lg neu-flat ${className}`}>
			<TinyMCEEditor
				apiKey={process.env.NEXT_PUBLIC_API_KEY_EDITOR || "no-api-key"}
				onInit={(evt, editor) => editorRef.current = editor}
				init={getEditorConfig()}
				disabled={disabled}
			/>
		</div>
	);
};

export default Editor; 