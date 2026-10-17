import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'public/mockServiceWorker.js'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    // TanStack Query is isolated behind src/api/core/ so a breaking major
    // only touches that folder — see README "Data fetching".
    files: ['**/*.{ts,tsx}'],
    ignores: ['src/api/core/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@tanstack/react-query',
              importNames: [
                'useQuery',
                'useMutation',
                'useQueryClient',
                'useSuspenseQuery',
                'useInfiniteQuery',
                'QueryClient',
              ],
              message: 'Use useApiQuery/useApiMutation/useQueryCache from src/api/core/ instead.',
            },
          ],
        },
      ],
    },
  },
  eslintConfigPrettier,
)
