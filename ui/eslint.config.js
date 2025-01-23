import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	js.configs.recommended,
	...tseslint.configs.strictTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	eslintPluginUnicorn.configs['flat/recommended'],
	{
		languageOptions: {
			parserOptions: {
				extraFileExtensions: ['.svelte'],
				projectService: true,
				tsconfigRootDir: import.meta.dirname
			},
			globals: {
				...globals.browser,
				...globals.node,
				google: 'readonly',
				gtag: 'readonly'
			}
		},
		rules: {
			// Ensures that correct values are returned, which is often a problem when generating directions.
			'@typescript-eslint/explicit-function-return-type': [
				'error',
				{
					allowExpressions: true
				}
			],
			// Makes Svelte snippets unusable
			'@typescript-eslint/no-confusing-void-expression': 'off',
			// conflicts with Svelte $props rune
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/only-throw-error': 'off',
			'@typescript-eslint/prefer-nullish-coalescing': 'off',
			'@typescript-eslint/prefer-promise-reject-errors': 'off',
			'@typescript-eslint/restrict-template-expressions': [
				'error',
				{
					allowAny: false,
					allowBoolean: true,
					allowNullish: false,
					allowNumber: true,
					allowRegExp: false,
					allowNever: false
				}
			],
			'@typescript-eslint/unbound-method': 'off',
			// its broken
			'unicorn/expiring-todo-comments': 'off',
			'unicorn/no-array-reduce': 'off',
			'unicorn/no-await-expression-member': 'off',
			'unicorn/no-null': 'off',
			'unicorn/filename-case': 'off',
			'unicorn/prevent-abbreviations': 'off',
			eqeqeq: 'error',
			'func-style': ['error', 'expression', { allowArrowFunctions: true }],
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			yoda: 'error'
		},
		linterOptions: {
			reportUnusedDisableDirectives: 'error'
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser
			}
		},
		rules: {
			'unicorn/prefer-top-level-await': 'off',
			'@typescript-eslint/no-floating-promises': 'off'
		}
	},
	{
		ignores: [
			'build/',
			'.svelte-kit/',
			'dist/',
			'coverage/',
			'src/lib/components/ui/',
			'src/lib/utils.ts',
			'src/lib/gibberish.js',
			'static',
			'vite.config.ts.timestamp-*'
		]
	}
);
