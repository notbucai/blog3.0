module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: '不才博客',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '这是不才的个人博客，记录生活，学习笔记。专注前端，全面发展。' },
      { hid: 'keywords', name: 'keywords', content: "个人博客,不才,不才博客,不才 Blog,bucai,bucai Blog,blog" }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    './plugins/axios.js',
    './plugins/constant.js',
    './plugins/global-components',
    './plugins/filters.js',
    { src: './plugins/dom.js', ssr: false },
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    ['@nuxtjs/vuetify', {
      theme: {
        icons: {
          iconfont: 'mdi',
        },
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
        // dark: false
      }
    }]
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/style-resources',
    'cookie-universal-nuxt'
  ],
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
    '/api/': { target: 'http://127.0.0.1:9905/', pathRewrite: { '^/api/': '' } }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  }
}
