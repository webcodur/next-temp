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
			colors: {
				// 기본 색상
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},

				// 레이아웃 계층 전용
				surface: {
					1: 'hsl(var(--surface-1))',
					2: 'hsl(var(--surface-2))',
					3: 'hsl(var(--surface-3))',
				},

				// 강조 색상 - 가시성 개선 (브랜드 포인트 색상)
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					0: 'hsl(var(--primary-0))',
					1: 'hsl(var(--primary-1))',
					2: 'hsl(var(--primary-2))',
					3: 'hsl(var(--primary-3))',
					4: 'hsl(var(--primary-4))',
					5: 'hsl(var(--primary-5))',
					6: 'hsl(var(--primary-6))',
					7: 'hsl(var(--primary-7))',
					8: 'hsl(var(--primary-8))',
					9: 'hsl(var(--primary-9))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},

				// 상태 색상
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))',
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))',
				},

				// 기타
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
			},
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
			// 사이드바 메뉴 애니메이션 설정
			animation: {
				fadeIn: 'fadeIn 0.3s ease-out',
				'slide-down': 'slideDown 0.2s ease-out',
				'slide-up': 'slideUp 0.2s ease-out',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				slideDown: {
					'0%': { height: '0px', opacity: '0' },
					'100%': {
						height: 'var(--radix-collapsible-content-height)',
						opacity: '1',
					},
				},
				slideUp: {
					'0%': {
						height: 'var(--radix-collapsible-content-height)',
						opacity: '1',
					},
					'100%': { height: '0px', opacity: '0' },
				},
			},
		},
	},
};
