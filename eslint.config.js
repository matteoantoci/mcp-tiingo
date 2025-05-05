import js from '@eslint/js';
// Correct imports for typescript-eslint flat config
import tseslintPlugin from '@typescript-eslint/eslint-plugin';
import tseslintParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier'; // Keep this for rules disabling formatting
import prettierPlugin from 'eslint-plugin-prettier'; // Keep this for running prettier as a rule
import globals from 'globals'; // Import globals

export default [
  // Base JS Recommended Rules
  js.configs.recommended,

  // TypeScript Configuration
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslintParser,
      globals: { // Add Node.js globals
        ...globals.node,
      },
      parserOptions: {
        project: './tsconfig.json', // Point to your tsconfig
        tsconfigRootDir: import.meta.dirname, // Helps ESLint find tsconfig relative to eslint.config.js
      },
    },
    plugins: {
      '@typescript-eslint': tseslintPlugin,
      import: importPlugin, // Move import plugin here for TS files
      prettier: prettierPlugin, // Move prettier plugin here
    },
    rules: {
      // Apply recommended TS rules
      ...tseslintPlugin.configs.recommended.rules,
      // Apply recommended-requiring-type-checking rules (optional, but good)
      // ...tseslintPlugin.configs['recommended-requiring-type-checking'].rules,

      // Your custom rules (keep these)
      '@typescript-eslint/no-explicit-any': 'warn', // Changed to warn from error temporarily
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      "arrow-body-style": ["warn", "as-needed"],
      'func-style': ['error', 'expression', { allowArrowFunctions: true }], // Keep
      'prefer-arrow-callback': 'error', // Keep

      // Import plugin rules (keep these)
      "import/no-unresolved": "off", // Often problematic with TS paths, keep off or configure resolver
      "import/named": "error",
      "import/default": "error",
      "import/namespace": "error",
      "import/no-self-import": "error",
      "import/no-cycle": "warn",
      "import/no-useless-path-segments": "warn",

      // Prettier rules (keep these)
      "prettier/prettier": "error" // Runs Prettier as an ESLint rule
    },
    // Settings like import/resolver might be needed here if using path aliases
    // settings: {
    //   'import/resolver': {
    //     typescript: {} // Or node if not using aliases
    //   },
    // },
  },

  // Prettier config to disable conflicting rules (keep this)
  prettierConfig,

  // Ignore patterns (keep this)
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**'],
  },
];
