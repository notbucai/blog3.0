import type { NavigationGuard } from 'vue-router'
export type MiddlewareKey = string
declare module "/Users/bucai/ME/wwwroot/blog3.0/nuxt3-naiveui-fd/node_modules/nuxt3/dist/pages/runtime/composables" {
  interface PageMeta {
    middleware?: MiddlewareKey | NavigationGuard | Array<MiddlewareKey | NavigationGuard>
  }
}