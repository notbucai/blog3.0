const isDark = new Date().getHours() > 19 && new Date().getHours() < 7;
const axios = require('axios');
const minifyTheme = require('minify-css-string');
const { VueLoaderPlugin } = require('vue-loader')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

const smp = new SpeedMeasurePlugin();

module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  ssr: true,
  telemetry: false,
  publicRuntimeConfig: {
    WEBSITE_LOGO: process.env.WEBSITE_LOGO
  },
  head: {
    // title: '不才的博客',
    titleTemplate: (title) => {
      return title ? `${title} - 不才的博客` : '不才的博客'
    },
    htmlAttrs: {
      lang: 'zh-CN'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '这是不才的博客，用于记录生活、学习笔记。专注WEB前端，全面发展，做一个有梦想又憨憨的咸鱼。网站内容不定期更新，欢迎大家关注，共同交流进步。' },
      { hid: 'keywords', name: 'keywords', content: "个人博客,不才,不才的博客,前端,web,javascript,vue,react,nodejs,不才 Blog,bucai,blog" }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: '//unpkg.com/animate.css@4.1.1/animate.min.css' },
      { rel: 'stylesheet', href: '//unpkg.com/mavon-editor@2.9.0/dist/markdown/github-markdown.min.css' }
    ],
    script: [
      // { src: '//unpkg.com/mavon-editor@2.9.0', defer: true },
      { src: '//unpkg.com/vue@2/dist/vue.min.js', defer: true },
      { src: '//unpkg.com/axios', defer: true },
      // { src: '//unpkg.com/gsap', defer: true },
      { src: '//unpkg.com/vue-router@3/dist/vue-router.min.js', defer: true },
      // { src: '//unpkg.com/browser-image-compression', defer: true },
      // { src: '//unpkg.com/vuetify@2.x/dist/vuetify.min.js', defer: true },
      { src: '//at.alicdn.com/t/font_2451840_fhijy36qb98.js', defer: true }, /*iconfont*/
      { src: 'https://cdn-go.cn/aegis/aegis-sdk/latest/aegis.min.js', defer: true }, /*异常上报*/
      { src: 'https://hm.baidu.com/hm.js?a30ef10be90b4a2b118c6cfe5e2275b9', defer: true }, /*引入百度统计的js*/

    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fafafa' },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/common.scss',
    // { src: "mavon-editor/dist/css/index.css" },
    // { src: "mavon-editor/dist/markdown/github-markdown.min.css" },
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    './plugins/axios.js',
    './plugins/constant.js',
    './plugins/icons.js',
    './plugins/global-components',
    './plugins/filters.js',
    './plugins/router.js',
    './plugins/utils.js',
    { src: './plugins/baiduGa.js', ssr: false }, /* 百度统计 */
    // { src: './plugins/vue-mavon-editor', ssr: false },
    { src: './plugins/file.js', ssr: false },
    // { src: './plugins/vue-cropper.js', ssr: false },
    { src: './plugins/dom.js', ssr: false },
  ],
  /*
  ** Nuxt.js dev-modules
  */
  //  modules: [

  //   ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/style-resources',
    'cookie-universal-nuxt',
    '@nuxtjs/sitemap',
    // 'nuxt-speedkit',
    // 'nuxt-purgecss',
    // '@nuxtjs/pwa',
    ['@nuxtjs/vuetify', {
      treeShake: true,
      defaultAssets: {
        icons: false
      },
      theme: {
        options: { minifyTheme: minifyTheme.default },
        themes: {
          light: {
            // primary: "#ffeb3b",
            // secondary: "#ffc107",
            // accent: "#3f51b5",
            // error: "#673ab7",
            // warning: "#9c27b0",
            // info: "#e91e63",
            // success: "#00bcd4"
          },
        },
        // light: true,
        dark: isDark
      },
      // treeShake: true
    }]
  ],
  speedkit: {
    detection: {
      performance: true,
      browserSupport: true
    },
    performanceMetrics: {
      device: {
        hardwareConcurrency: { min: 2, max: 48 },
        deviceMemory: { min: 2 }
      },
      timing: {
        fcp: 800,
        dcl: 1200
      },
      lighthouseDetectionByUserAgent: false
    },
    fonts: [],

    componentAutoImport: false,
    componentPrefix: undefined,
    disableNuxtImage: true,
    /**
     * IntersectionObserver rootMargin for Compoennts and Assets
     */
    lazyOffset: {
      component: '0%',
      asset: '0%'
    }
  },
  purgeCSS: {
    // whitelist: ['v-application', 'v-application--wrap'],
    // whitelistPatterns: [/^v-((?!application).)*$/, /^theme--*/, /.*-transition/],
    // whitelistPatternsChildren: [/^v-((?!application).)*$/, /^theme--*/],
  },
  vuetify: {
    treeShake: true,
    defaultAssets: {
      // nuxt.config.js
      font: false,
      icons: 'mdi'
    }
  },
  sitemap: {
    hostname: "https://www.notbucai.com/",
    gzip: true,
    routes: async () => {
      const list = [];
      const res = await axios.get('https://www.notbucai.com/api/article/list/all?page_index=1&page_size=100000000')
      const resData = res.data;
      if (resData.code === 0) {
        const a_list = resData.data.list.map((item) => `/article/${item.id}`);
        list.push(...a_list);
      }
      return list;
    }
  },
  styleResources: {
    scss: './assets/variables.scss',
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    proxy: true,

  },
  proxy: {
    '/api/': { target: process.env.NODE_ENV === 'development' ? 'http://localhost:9905/' : 'http://bucai-blog-server:9905/', pathRewrite: { '^/api/': '' } },
    '/socket-gateway': {
      target: process.env.NODE_ENV === 'development' ? 'http://localhost:9905' : 'http://bucai-blog-server:9905',
      ws: true,
      changeOrigin: true,
    }
  },


  optimization: {
    minimize: process.env.NODE_ENV !== 'development',
  },
  render: {
    resourceHints: false
  },
  /*
  ** Build configuration
  */
  build: {
    // loaders: {
    //   vue: {
    //     // prettify: false
    //   }
    // },
    // plugins: [],
    plugins: [
      // new VueLoaderPlugin(),
      // new VuetifyLoaderPlugin()
    ],
    // vendor: [
    //   // 'vue-cropperjs',
    //   // 'mavon-editor',
    //   'highlight.js',
    // ],
    extractCSS: true,
    splitChunks: {
      // layouts: true
    },

    // quiet: true,
    analyze: process.env.ENV_ANALYZE == 'analyze',

    optimization: {
      minimize: process.env.NODE_ENV !== 'development',
      splitChunks: {
        maxInitialRequests: 5,
        maxAsyncRequests: 5
      }
    },
    optimizeCSS: {
      assetNameRegExp: /\.optimize\.css$/g,
      // cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true
    },
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
      if (ctx.isClient) {
        // config.externalsType = 'script';
        config.externals = [
          {
            vue: 'Vue',
            axios: 'axios',
            // 'highlight.js': 'hljs',
            'vue-cropper': 'vue-cropper',
            'mavon-editor': 'MavonEditor',
            'vue-router': 'VueRouter',
            '@splinetool/runtime': 'SplinetoolRuntime',
            'browser-image-compression': 'imageCompression'
          }
        ];
      }

      if (ctx.isDev) {
        return smp.wrap(config);
      }
      return config;
    }
  },
}
