import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

interface CanisterIds {
  [key: string]: string;
}

let canisterIds: CanisterIds = {};
let folder: string[];
const canisterIdsFilePath = '../../configs';

const isDev = false;

try {
  folder = fs.readdirSync(canisterIdsFilePath);
  console.log('folder', folder);
  for (let i = 0; i < folder.length; i++) {
    if (folder[i].indexOf('ms') > -1) {
      const key = folder[i].split('.')[0];
      const fileJSON = JSON.parse(
        fs.readFileSync(`${canisterIdsFilePath}/${folder[i]}`, 'utf-8'),
      );
      canisterIds[`process.env.${key.toUpperCase()}_CANISTERID`] = isDev
        ? JSON.stringify(fileJSON['LOCAL_CANISTERID'])
        : JSON.stringify(fileJSON['PRODUCTION_CANISTERID']);
    }
  }
  console.log(canisterIds);
  // canisterIds = fs.readFileSync('./canisterIds.json', 'utf8')
} catch (e) {
  canisterIds = {};
}
console.log(__dirname);
console.log(path.resolve(__dirname, './src'));
console.log(fs.readdirSync(path.resolve(__dirname, './src/components')));
// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    // usePluginImport({
    //   libraryName: 'antd',
    //   libraryDirectory: 'es',
    //   style(name) {
    //     // use less
    //     return `antd/es/${name}/style/index.js`;
    //   },
    // }),
  ],
  resolve: {
    alias: [
      { find: /^~/, replacement: '' },
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      // { find: '@c', replacement: path.resolve(__dirname, 'config') },
    ],
  },
  css: {
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true,
      },
    },
  },
  build: {
    target: 'esnext',
    // manifest: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080/',
        changeOrigin: false,
      },
    },
  },
  define: {
    // Here we can define global constants
    // This is required for now because the code generated by dfx relies on process.env being set
    // ...canisterIds,
    'process.env': {},
  },
});
