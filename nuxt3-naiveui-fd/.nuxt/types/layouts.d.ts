import { ComputedRef, Ref } from 'vue'
export type LayoutKey = string
declare module "/Users/bucai/ME/wwwroot/blog3.0/nuxt3-naiveui-fd/node_modules/nuxt3/dist/pages/runtime/composables" {
  interface PageMeta {
    layout?: false | LayoutKey | Ref<LayoutKey> | ComputedRef<LayoutKey>
  }
}