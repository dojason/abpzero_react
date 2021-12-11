import {IConfig, IPlugin } from 'umi-types';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import aliyunTheme from '@ant-design/aliyun-theme';
import slash from 'slash2';
import webpackPlugin from './plugin.config';
const { pwa } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins: IPlugin[] = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        enable: false,
        default: 'zh-CN',
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
]; // 针对 preview.pro.ant.design 的 GA 统计代码

if (isAntDesignProPreview) {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push([
    'umi-plugin-pro',
    {
      serverUrl: 'https://ant-design-pro.netlify.com',
    },
  ]);
}

export default {
  plugins,
  block: {
    // 国内用户可以使用码云
    // defaultGitUrl: 'https://gitee.com/ant-design/pro-blocks',
    defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  hash: true,
  targets: {
    ie: 11,
  },
  devtool: isAntDesignProPreview ? 'source-map' : false,
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/account',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'account',
          path: '/account/login',
          component: './account/login',
        },
        {
          name: 'account',
          path: '/account/register',
          component: './account/register',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      Routes: ['src/pages/Authorized'],
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/welcome',
            },
            {
              path: '/welcome',
              name: '首页',
              icon: 'smile',
              component: './Welcome',
            },
            {
              path: '/admin',
              name: '管理',
              icon: 'setting',
              routes: [
                {
                  path: '/admin/organizationUnits',
                  name: '组织机构',
                  icon: 'team',
                  component: './admin/organizationUnits',
                },
                {
                  path: '/admin/roles',
                  name: '角色',
                  icon: 'safety',
                  component: './admin/roles',
                },
                {
                  path: '/admin/users',
                  name: '用户',
                  icon: 'user',
                  component: './admin/users',
                },
                {
                  path: '/admin/languages',
                  name: '语言列表',
                  icon: 'unordered-list',
                  component: './admin/languages',
                },
                {
                  path: '/admin/languageTexts/:name',
                  name: '语言列表',
                  component: './admin/languages/languageText',
                  hideInMenu: true,
                },
                {
                  path: '/admin/auditLogs',
                  name: '审计日志',
                  icon: 'schedule',
                  component: './admin/auditLogs',
                },
                {
                  path: '/admin/notifications',
                  name: '通知',
                  component: './admin/shared/notifications',
                  hideInMenu: true,
                },
                {
                  path: '/admin/dataDictionarys',
                  name: '数据字典',
                  icon: 'profile',
                  component: './admin/dataDictionarys',
                },
                {
                  path: '/admin/settings',
                  icon: 'setting',
                  name: '设置',
                  component: './admin/settings',
                },
              ],
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: aliyunTheme,
  define: {
    'process.env.REACT_APP_APP_BASE_URL': process.env.REACT_APP_APP_BASE_URL,
    'process.env.REACT_APP_REMOTE_SERVICE_BASE_URL': process.env.REACT_APP_REMOTE_SERVICE_BASE_URL,
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  copy: [
    {
      from: 'node_modules/@aspnet/signalr/dist/browser/signalr.min.js',
      to: 'dist',
    },
    {
      from: 'node_modules/abp-web-resources/Abp/Framework/scripts/libs/abp.signalr-client.js',
      to: 'dist',
    },
    {
      from: 'src/lib/abp.js',
      to: 'dist',
    },
  ],
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack: webpackPlugin,
  /*
  proxy: {
    '/server/api/': {
      target: 'https://preview.pro.ant.design/',
      changeOrigin: true,
      pathRewrite: { '^/server': '' },
    },
  },
  */
} as IConfig;
