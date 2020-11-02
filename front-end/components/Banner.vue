<template>
  <v-carousel
    :continuous="false"
    :cycle="false"
    :show-arrows="false"
    hide-delimiter-background
    delimiter-icon="mdi-minus"
    width="100%"
    :height="carouselHeight"
    v-resize="onResize"
    ref="carousel"
  >
    <v-carousel-item v-for="(item, i) in recommendedList" :key="i">
      <v-img
        class="align-end carousel-image"
        :src="item.coverURL+'?imageMogr2/thumbnail/800x'"
        :height="carouselHeight"
        :lazy-src="item.coverURL+'?imageMogr2/thumbnail/100x'"
      >
        <v-container fluid>
          <v-row align="end">
            <div class="carousel-info-box">
              <h1>{{item.title}}</h1>
              <v-btn color="error" rounded nuxt :to="`/article/${item._id}`">阅读全文</v-btn>
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
      carouselHeight: 1200
    };
  },
  mounted () {
    this.onResize();
  },
  methods: {
    onResize () {
      const el = this.$refs['carousel'].$el;
      const top = this.$dom.getElementToPageTop(el);
      const innerHeight = window.innerHeight;
      this.carouselHeight = innerHeight - top - 10;
    },
  }
};
</script>
<style lang="scss" scoped>
</style>