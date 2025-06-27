/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/unit/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			fontFamily: {
				// 다국어 자동 선택 폰트 (서브셋 최적화)
				multilang: ['MultiLang', 'system-ui', 'sans-serif'],
				// 한국어 전용 폰트 (서브셋)
				pretendard: ['Pretendard', 'system-ui', 'sans-serif'],
				// 영어 전용 폰트
				inter: ['Inter', 'system-ui', 'sans-serif'],
				// 아랍어 전용 폰트
				cairo: ['Cairo', 'system-ui', 'sans-serif'],
				// 한국어 헤드라인 폰트
				headline: ['HY헤드라인M', 'system-ui', 'sans-serif'],
			},
			// 폰트 웨이트 확장 (Pretendard 서브셋용)
			fontWeight: {
				thin: '100',
				extralight: '200',
				light: '300',
				normal: '400',
				medium: '500',
				semibold: '600',
				bold: '700',
				extrabold: '800',
				black: '900',
			},
		},
	},
};
