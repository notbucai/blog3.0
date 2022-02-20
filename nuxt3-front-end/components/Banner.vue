<template>
  <v-carousel
    :continuous="false"
    :cycle="false"
    :show-arrows="false"
    hide-delimiter-background
    :delimiter-icon="'mdi-minus'"
    width="100%"
    height="calc(100vh - 68px - 16px)"
    ref="carousel"
    class="bc-banner"
  >
    <v-carousel-item v-for="(item, i) in recommendedList" :key="i">
      <v-img
        class="align-end carousel-image"
        :src="item.coverURL"
        :lazy-src="item.coverURL"
        height="100%"
      >
        <v-container fluid>
          <v-row align="end">
            <div class="carousel-info-box">
              <h1>{{ item.title }}</h1>
              <v-btn color="error" rounded nuxt :to="`/article/${item._id}`"
                >阅读全文</v-btn
              >
            </div>
          </v-row>
        </v-container>
      </v-img>
    </v-carousel-item>
  </v-carousel>
</template>
<script lang="ts" setup>

defineProps<{
  recommendedList: any[]
}>()

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