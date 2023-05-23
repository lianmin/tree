import { defineConfig } from '@ice/pkg';

export default defineConfig({
  transform: {
    formats: ['es2017'],
  },
  bundle: {
    formats: ['esm', 'es2017'],
  },
});
