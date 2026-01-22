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
        'warm-orange': '#FF6B35',
        'warm-orange-light': '#FFB084',
        'warm-orange-dark': '#E85D2A',
        'deep-orange': '#FF4500',
        'coral': '#FF7F50',
        'peach': '#FFDAB9',
        'sunset': '#FF8C42',
        'cream-secondary': '#FFF3E0',
        'text-primary': '#3D2817',
        'text-secondary': '#8C7B70',
        'text-muted': '#C4B5AA',
        'accent-gold': '#FFD700',
        'accent-yellow': '#FFC107',
        'accent-green': '#8FD14F',
        'accent-blue': '#87CEEB',
        'accent-purple': '#DDA0DD',
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
        'neumorphic': '8px 8px 16px #E6DCC8, -8px -8px 16px #FFFFFF',
        'neumorphic-pressed': 'inset 4px 4px 8px #E6DCC8, inset -4px -4px 8px #FFFFFF',
        'soft-float': '0 10px 40px -10px rgba(255, 107, 53, 0.4)',
        'glass': '0 8px 32px 0 rgba(255, 107, 53, 0.15)',
        'glow': '0 0 30px rgba(255, 215, 0, 0.5)'
      },
      backgroundImage: {
        'gradient-divine': 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 25%, #FFB084 50%, #FF7F50 75%, #FF6B35 100%)',
        'gradient-sunrise': 'linear-gradient(135deg, #FF6B35 0%, #FFD700 100%)',
        'gradient-sunset': 'linear-gradient(180deg, #FF4500 0%, #FF8C42 50%, #FFD700 100%)'
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
}