import { defineConfig } from 'vitest/config';

export default defineConfig(({ command, mode }) => {
  return {
    test: {
      alias: {
        '@': './src'
      },
      coverage: {
        provider: 'istanbul',
        reporter: ['html']
      }
    },
    define: {
      __BUILD_TS__: '100000000'
    }
  };
});
