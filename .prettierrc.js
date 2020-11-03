// links
// https://prettier.io/docs/en/configuration.html
// https://prettier.io/docs/en/ignore.html
// http://json.schemastore.org/prettierrc
// https://www.codereadability.com/automated-code-formatting-with-prettier/

// how to
// $ (sudo )npm install prettier --global
// $ cd refact-server
// $ prettier --config .prettierrc.js './src/**/*.js' --check
// $ prettier --config .prettierrc.js './src/**/*.js' --write

module.exports = {
    bracketSpacing: true,
    jsxBracketSameLine: true,
    singleQuote: true,
    trailingComma: 'all',
    tabWidth: 4,
    arrowParens: 'always',
    printWidth: 200,
};
