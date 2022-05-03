module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      padding: {
        "1/2": "50%",
        full: "100%",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
}
