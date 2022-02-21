import { defineNuxtPlugin } from '#app'
import { createVuetify } from '@vuetify/nightly'
import * as cs from '@vuetify/nightly/components'
import * as ds from '@vuetify/nightly/directives'

export default defineNuxtPlugin((nuxtApp) => {
    console.log('cs', Object.keys(cs).filter(item=>item.includes('Item')));
    
    const vuetify = createVuetify({
        components: cs,
        directives: ds
    });
    nuxtApp.vueApp.use(vuetify)
})