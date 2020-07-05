// import typescript from 'rollup-plugin-typescript2';
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

import pkg from './package.json'

console.log('kkk rollup externals: ', [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})])

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
  ],
  external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {}), 'firebase/app', 'firebase/firestore'],
  plugins: [
    resolve(),
    // typescript({
    //   rollupCommonJSResolveHack: true,
    //   exclude: '**/__tests__/**',
    //   clean: true
    // }),
    typescript(),
    commonjs(),
  ],
}
