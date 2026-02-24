/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["src/**/*.{njk,html,js}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "var(--color-brand-primary)",
          secondary: "var(--color-brand-secondary)",
          accent: "var(--color-brand-accent)",
        },
      },
    },
  },
  plugins: [],
};
