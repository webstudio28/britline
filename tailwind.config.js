/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["src/**/*.{njk,html,js}"],
  theme: {
    extend: {
      colors: {
        brand: {
          buttercream: "var(--color-brand-buttercream)",
          blue: "var(--color-brand-blue)",
          accent: "var(--color-brand-accent)",
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
