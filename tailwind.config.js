export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { 
    extend: {
      fontFamily: {
        'geist': ['Geist', 'system-ui', 'sans-serif'],
        'inter': ['Inter', 'system-ui', 'sans-serif'],
        'space-grotesk': ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        '8xl': '90rem',
      }
    } 
  },
  plugins: [require('@tailwindcss/typography')],
}
