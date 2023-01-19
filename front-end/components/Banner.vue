<template>
  <v-carousel
    :continuous="false"
    :cycle="false"
    :show-arrows="false"
    hide-delimiter-background
    :delimiter-icon="$icons['mdi-minus']"
    width="100%"
    height="80vh"
    v-resize="onResize"
    ref="carousel"
    class="bc-banner"
  >
    <v-carousel-item v-for="(item, i) in recommendedList" :key="i">
      <v-img
        class="align-end carousel-image"
        :src="item.coverUrl | imageMogr2(600)"
        :lazy-src="item.coverUrl | imageMogr2(68)"
        height="100%"
      >
        <v-container fluid>
          <v-row align="end">
            <div class="carousel-info-box">
              <h1>{{ item.title }}</h1>
              <v-btn color="error" rounded nuxt :to="`/article/${item.id}`"
                >阅读全文</v-btn
              >
            </div>
          </v-row>
        </v-container>
      </v-img>
    </v-carousel-item>
  </v-carousel>
</template>
<script>
export default {
  components: {},
  props: {
    recommendedList: Array
  },
  computed: {},
  data () {
    return {
      carouselHeight: 980
    };
  },
  mounted () {
    this.onResize();
  },
  methods: {
    onResize () {
      // const el = this.$refs['carousel'].$el;
      // const top = this.$dom.getElementToPageTop(el);
      // const innerHeight = window.innerHeight;
      // this.carouselHeight = innerHeight - top - 10;
      // this.$vuetify.goTo(0, 0);
    },
  }
};
</script>
<style lang="scss" scoped>
.bc-banner {
  transition: height 0.2s;
  /* height: calc(100vh - 68px - 24px); */
  .carousel-image {
    transition: height 0.2s;
  }
}
</style>