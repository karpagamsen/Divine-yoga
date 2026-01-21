/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFF9F5',
        'warm-orange': '#FF9A5A',
        'warm-orange-light': '#FFD9A0',
        'warm-orange-dark': '#E07A3C',
        'cream-secondary': '#FFF3E0',
        'text-primary': '#4A3B32',
        'text-secondary': '#8C7B70',
        'text-muted': '#C4B5AA',
        'accent-gold': '#D4AF37',
        'accent-green': '#A8C6A0',
        'accent-blue': '#A0C4FF',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        card: "24px",
        hero: "32px"
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Nunito', 'sans-serif'],
        accent: ['Dancing Script', 'cursive']
      },
      boxShadow: {
        'neumorphic': '6px 6px 12px #E6DCC8, -6px -6px 12px #FFFFFF',
        'neumorphic-pressed': 'inset 4px 4px 8px #E6DCC8, inset -4px -4px 8px #FFFFFF',
        'soft-float': '0 10px 30px -10px rgba(255, 154, 90, 0.3)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)'
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
}