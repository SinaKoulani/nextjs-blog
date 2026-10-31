import { defineConfig } from 'orval';

export default defineConfig({
  blog: {
    input: './swagger.json',
    output: {
      target: './src/api/generated',
      mode: 'tags-split',
      client: 'axios',
      override: {
        mutator: {
          path: './src/api/axios-manual-api-fetch.ts',
          name: 'customInstance',
        },
      },
    },
  },
});