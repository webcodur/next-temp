'use client';

import { useRef } from 'react';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';
import { cn } from '@/lib/utils';

// TinyMCE CSS import - 클라이언트에서만 동작
// import 'tinymce/skins/ui/oxide/skin.min.css'

type EditorProps = {
	value: string;
	onChange: (content: string) => void;
	placeholder?: string;
	height?: number | string;
	className?: string;
	init?: Record<string, unknown>;
};

export const Editor = ({
	value,
	onChange,
	placeholder = '내용을 입력하세요...',
	height = 400,
	className,
	init,
}: EditorProps) => {
	// TinyMCE 에디터 인스턴스를 저장하기 위한 ref
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const editorRef = useRef<any>(null);

	// 에디터 설정
	const editorInit = {
		height,
		menubar: true,
		placeholder,
		plugins: [
			'advlist',
			'autolink',
			'lists',
			'link',
			'image',
			'charmap',
			'preview',
			'anchor',
			'searchreplace',
			'visualblocks',
			'code',
			'fullscreen',
			'insertdatetime',
			'media',
			'table',
			'help',
			'wordcount',
			'emoticons',
		],
		toolbar:
			'undo redo | blocks | ' +
			'bold italic forecolor backcolor | alignleft aligncenter ' +
			'alignright alignjustify | bullist numlist outdent indent | ' +
			'removeformat | table image link emoticons | code fullscreen help',
		content_style: `
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
        font-size: 16px; 
        color: hsl(var(--foreground));
        background: hsl(var(--background));
        padding: 20px;
        margin: 0;
      }
      a { color: hsl(var(--brand)); }
      h1, h2, h3, h4, h5, h6 { color: hsl(var(--foreground)); }
      p { margin: 8px 0; }
      
      /* 플레이스홀더 스타일 개선 */
      .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
        margin-top: 6px;
        margin-left: 22px;
        color: hsl(var(--muted-foreground));
        font-style: italic;
        display: flex;
        align-items: center;
        line-height: 1.6;
      }
    `,
		branding: false,
		promotion: false,
		resize: true,
		statusbar: true,
		image_caption: true,
		quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
		quickbars_insert_toolbar: 'image media table hr',
		contextmenu: 'link image table',
		...init,
	};

	return (
		<div className={cn('neu-flat p-4 rounded-lg', className)}>
			<TinyMCEEditor
				apiKey={process.env.NEXT_PUBLIC_API_KEY_EDITOR || ''}
				onInit={(_, editor) => {
					editorRef.current = editor;
				}}
				value={value}
				onEditorChange={(newValue) => {
					onChange(newValue);
				}}
				init={editorInit}
			/>
		</div>
	);
};

export default Editor; 