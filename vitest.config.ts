import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'node',
		globals: true,
		include: ['**/*.test.ts', '**/*.spec.ts'],
		exclude: ['node_modules', 'dist', 'generated'],
		typecheck: {
			tsconfig: './tsconfig.json',
		},
	},
});
