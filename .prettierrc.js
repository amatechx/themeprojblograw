module.exports = {
  // Basic formatting options
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  endOfLine: 'lf',
  embeddedLanguageFormatting: 'auto',
  htmlWhitespaceSensitivity: 'css',
  insertPragma: false,
  proseWrap: 'preserve',
  requirePragma: false,

  // File specific configurations
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 80,
        trailingComma: 'none',
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always',
      },
    },
    {
      files: '*.yml',
      options: {
        printWidth: 120,
        tabWidth: 2,
      },
    },
    {
      files: '*.yaml',
      options: {
        printWidth: 120,
        tabWidth: 2,
      },
    },
    {
      files: '*.css',
      options: {
        printWidth: 120,
      },
    },
    {
      files: '*.scss',
      options: {
        printWidth: 120,
      },
    },
    {
      files: '*.less',
      options: {
        printWidth: 120,
      },
    },
    {
      files: '*.html',
      options: {
        printWidth: 120,
        htmlWhitespaceSensitivity: 'ignore',
      },
    },
  ],
};