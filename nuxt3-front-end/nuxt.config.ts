import { defineNuxtConfig } from 'nuxt3'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  css: ['vuetify/lib/styles/main.sass', '@mdi/font/css/materialdesignicons.css'],
  build: {
    transpile: ['vuetify']
  },
  vite: {
    define: {
      'process.env': {
        DEBUG: true,
        NODE_ENV: process.env.NODE_ENV
      }
    }
  },
})
