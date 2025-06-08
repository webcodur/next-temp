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
					'0%': {
						height: '0',
						opacity: '0',
					},
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
					'100%': {
						height: '0',
						opacity: '0',
					},
				},
				fadeFlow: {
					'0%': { opacity: '0.1' },
					'15%': { opacity: '0.9' },
					'25%': { opacity: '0.1' },
					'25.1%': { opacity: '0.1' },
					'100%': { opacity: '0.1' },
				},
				tripleFlow: {
					'0%': { opacity: '0.3' },
					'15%': { opacity: '0.8' },
					'20%': { opacity: '0.3' },
					'100%': { opacity: '0.3' },
				},
			},
			animation: {
				'slide-down': 'slideDown 250ms ease-out',
				'slide-up': 'slideUp 200ms ease-in',
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
