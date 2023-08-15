/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      'mappin-blue': '#0081A1',
      'mappin-blue-hover': '#4c7f8c'
    },
  },
  plugins: [],
  typeRoots: [
    "src/customModuleTypes",
    "node_modules/@types",
  ]
}
