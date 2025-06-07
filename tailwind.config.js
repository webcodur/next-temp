/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				slideDown: {
					'0%': { height: '0' },
					'100%': { height: 'var(--radix-collapsible-content-height)' },
				},
				slideUp: {
					'0%': { height: 'var(--radix-collapsible-content-height)' },
					'100%': { height: '0' },
				},
			},
			animation: {
				'slide-down': 'slideDown 100ms ease-in-out',
				'slide-up': 'slideUp 100ms ease-in-out',
			},
			fontFamily: {
				sans: ['system-ui', 'sans-serif'],
				mono: ['ui-monospace', 'monospace'],
			},
			boxShadow: {
				// 뉴모피즘 핵심 3종 (음양각 처리)
				'neu-raised':
					'var(--neu-offset) var(--neu-offset) var(--neu-blur) rgba(var(--neu-dark)), calc(var(--neu-offset) * -1) calc(var(--neu-offset) * -1) var(--neu-blur) rgba(var(--neu-light))',
				'neu-inset':
					'inset var(--neu-offset) var(--neu-offset) var(--neu-blur) rgba(var(--neu-dark)), inset calc(var(--neu-offset) * -1) calc(var(--neu-offset) * -1) var(--neu-blur) rgba(var(--neu-light))',
				'neu-flat':
					'1px 1px 2px rgba(var(--neu-dark)), -1px -1px 2px rgba(var(--neu-light))',
			},
		},
	},
	plugins: [
		function ({ addUtilities }) {
			addUtilities({
				'.scrollbar-hide': {
					'-ms-overflow-style': 'none',
					'scrollbar-width': 'none',
					'&::-webkit-scrollbar': { display: 'none' },
				},
			});
		},
	],
};
