/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./public/**/*.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blue-100': '#DBEAFE',
        'blue-200': '#BFDBFE',
        'blue-400': '#60A5FA',
        'blue-800': '#1E40AF',
        'green-400': '#4ADE80',
        'gray-200': '#E5E7EB',
        'gray-400': '#9CA3AF',
        'gray-600': '#4B5563',
        'gray-800': '#1F2937',
        'purple-50': '#F5F3FF',
      },
      fontSize: {
        'xs': '.75rem',
        'sm': '.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        'full': '9999px',
      },
      spacing: {
        '5%': '5%',
        '10%': '10%',
        '15%': '15%',
        '20%': '20%',
        '25%': '25%',
        '30%': '30%',
        '40%': '40%',
        '50%': '50%',
        '60%': '60%',
        '75%': '75%',
        '80%': '80%',
      },
      boxShadow: {
        'md': '0 4px 14px 0 rgba(0,0,0,0.07)',
      },
      rotate: {
        '3': '3deg',
      }
    },
  },
  plugins: [],
}