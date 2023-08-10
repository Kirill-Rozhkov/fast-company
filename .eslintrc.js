module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: ["plugin:react/recommended", "standard"],
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 12,
        sourceType: "module"
    },
    plugins: ["react"],
    rules: {
        indent: [0, 4],
        semi: [0, "never"],
        "space-before-function-paren": [0, "never"],
        quotes: [0, "single", { avoidEscape: true }],
        "eol-last": 0,
        "no-multiple-empty-lines": ["warn", { max: 2 }],
        "no-unused-vars": 0,
        "multiline-ternary": [0, "always"],
        "object-shorthand": "off"
    }
};