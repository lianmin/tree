import { defineConfig } from '@ice/pkg';

// https://pkg.ice.work/reference/config/
export default defineConfig({
  transform: {
    formats: ['cjs', 'es2017'],
  },
  bundle: {
    formats: ['cjs', 'esm', 'es2017'],
  },
});
