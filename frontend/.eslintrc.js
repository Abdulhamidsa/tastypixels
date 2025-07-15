module.exports = {
  root: true,
  parser: "@babel/eslint-parser",
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ["next/babel"],
    },
  },
  extends: ["next/core-web-vitals"],
  plugins: ["unused-imports"],
  rules: {
    "no-unused-vars": "off", // let plugin handle it
    "unused-imports/no-unused-imports": "warn", // 🟡 yellow warning
    "unused-imports/no-unused-vars": [
      "warn", // 🟡 yellow warning
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
  },
};
