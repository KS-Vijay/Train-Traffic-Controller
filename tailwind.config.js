/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--color-border)', // strategic border color
        input: 'var(--color-input)', // elevated surface
        ring: 'var(--color-ring)', // medium green
        background: 'var(--color-background)', // near-black
        foreground: 'var(--color-foreground)', // high-contrast white
        primary: {
          DEFAULT: 'var(--color-primary)', // deep forest green
          foreground: 'var(--color-primary-foreground)' // high-contrast white
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', // medium green
          foreground: 'var(--color-secondary-foreground)' // high-contrast white
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', // critical red
          foreground: 'var(--color-destructive-foreground)' // high-contrast white
        },
        muted: {
          DEFAULT: 'var(--color-muted)', // strategic border color
          foreground: 'var(--color-muted-foreground)' // muted gray
        },
        accent: {
          DEFAULT: 'var(--color-accent)', // vibrant orange
          foreground: 'var(--color-accent-foreground)' // near-black
        },
        popover: {
          DEFAULT: 'var(--color-popover)', // elevated surface
          foreground: 'var(--color-popover-foreground)' // high-contrast white
        },
        card: {
          DEFAULT: 'var(--color-card)', // elevated surface
          foreground: 'var(--color-card-foreground)' // high-contrast white
        },
        success: {
          DEFAULT: 'var(--color-success)', // railway-standard green
          foreground: 'var(--color-success-foreground)' // high-contrast white
        },
        warning: {
          DEFAULT: 'var(--color-warning)', // standard railway orange
          foreground: 'var(--color-warning-foreground)' // near-black
        },
        error: {
          DEFAULT: 'var(--color-error)', // critical red
          foreground: 'var(--color-error-foreground)' // high-contrast white
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }]
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },
      animation: {
        'status-breathing': 'statusBreathing 2s ease-in-out infinite',
        'fade-in': 'fadeIn 150ms ease-out',
        'slide-in': 'slideIn 300ms ease-out'
      },
      keyframes: {
        statusBreathing: {
          '0%, 100%': { opacity: '0.85' },
          '50%': { opacity: '1' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      boxShadow: {
        'control-room': '0 2px 8px rgba(0, 0, 0, 0.15)'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animate')
  ],
}