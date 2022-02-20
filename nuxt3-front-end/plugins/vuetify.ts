import { defineNuxtPlugin } from '#app'
import { createVuetify } from 'vuetify'
import * as cs from 'vuetify/components'
import * as ds from 'vuetify/directives'

export default defineNuxtPlugin((nuxtApp) => {
    const vuetify = createVuetify({
        components: cs,
        directives: ds
    });
    nuxtApp.vueApp.use(vuetify)
})