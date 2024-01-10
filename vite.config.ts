import { defineApplicationConfig } from '@vben/vite-config';

export default defineApplicationConfig({
  overrides: {
    optimizeDeps: {
      include: [
        'echarts/core',
        'echarts/charts',
        'echarts/components',
        'echarts/renderers',
        'qrcode',
        '@iconify/iconify',
        'ant-design-vue/es/locale/zh_CN',
        'ant-design-vue/es/locale/en_US',
      ],
    },
    server: {
      proxy: {
        '/basic-api': {
          target: 'http://localhost:1880',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/basic-api`), ''),
          // only https
          // secure: false
        },
        '/upload': {
          target: 'http://localhost:3300/upload',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/upload`), ''),
        },
        '/uibuilder': {
          target: 'http://127.0.0.1:1880/uibuilder',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/uibuilder`), ''),
        },
        // '/nodered': {
        //   target: 'http://127.0.0.1:1880/',
        //   changeOrigin: true,
        //   ws: true,
        //   rewrite: (path) => path.replace(new RegExp(`^/nodered`), ''),
        // },
      },
    },
  },
});
