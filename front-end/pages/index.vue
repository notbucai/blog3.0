<template>
  <v-container>
    <v-carousel
      :continuous="false"
      :cycle="cycle"
      :show-arrows="false"
      hide-delimiter-background
      delimiter-icon="mdi-minus"
      width="100%"
      :height="carouselHeight"
      ref="carousel"
    >
      <v-carousel-item v-for="(item, i) in recommendedList" :key="i">
        <v-img
          class="align-end carousel-image"
          :src="item.coverURL"
          :height="carouselHeight"
          :lazy-src="item.coverURL+'?imageMogr2/thumbnail/100x'"
        >
          <v-container fluid>
            <v-row align="end">
              <div class="carousel-info-box">
                <h1>{{item.title}}</h1>
                <v-btn color="error" rounded>阅读全文</v-btn>
              </div>
            </v-row>
          </v-container>
        </v-img>
      </v-carousel-item>
    </v-carousel>
    <!-- class="my-4" -->
    <v-row>
      <v-col cols="8">
        <v-container fluid class="py-0">
          <v-row justify="space-between" align="center">
            <div class="title">全部文章</div>
            <v-switch :value="false" inset label="列表"></v-switch>
          </v-row>
        </v-container>

        <v-card
          class="mx-auto mb-6 article-item"
          v-for="(item, index) in articleStore.list"
          :key="index"
        >
          <v-lazy>
            <v-img
              :aspect-ratio="18/9"
              v-if="item.coverURL"
              :src="item.coverURL"
              :lazy-src="item.coverURL+'?imageMogr2/thumbnail/100x'"
            />
          </v-lazy>

          <v-card-title>
            <nuxt-link :to="`/article/${item._id}`" class="title_a">{{item.title}}</nuxt-link>
          </v-card-title>
          <v-card-subtitle>{{item.createdAt | format}}</v-card-subtitle>

          <v-card-text class="text--primary">
            <div>{{item.summary}}</div>
          </v-card-text>

          <v-card-actions>
            <v-btn text color="error">开始阅读</v-btn>
          </v-card-actions>
        </v-card>
        <div class="d-flex justify-center" v-if="articleStore.list.length < articleStore.total">
          <v-btn
            color="error"
            :elevation="0"
            rounded
            :loading="articleLoading"
            @click="loadData"
          >加载更多</v-btn>
        </div>
      </v-col>
      <v-col cols="4">
        <v-container fluid class="my-1">
          <v-row justify="space-between" align="center">
            <div class="title">标签</div>
          </v-row>
        </v-container>
        <v-card class="mx-auto mb-6 pa-2">
          <nuxt-link to="/tag/xxx" class="tag-item-link">
            <v-chip class="ma-2" label v-for="(item, index) in taglist" :key="index">
              <v-icon left>mdi-{{item.icon}}</v-icon>
              {{item.name}}
            </v-chip>
          </nuxt-link>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    const promiseList = [];
    promiseList.push($axios.get('/api/article/list/hot'));
    promiseList.push($axios.get('/api/article/list/all'));
    promiseList.push($axios.get('/api/tag/list/effect'));
    const [hotList, allList, taglist] = await Promise.all(promiseList);
    return {
      taglist: taglist || [],
      recommendedList: hotList.list || [],
      articleStore: allList || {}
    };
  },
  mounted() {
    const el = this.$refs['carousel'].$el;
    const top = this.$dom.getElementToPageTop(el);
    console.log(top);
    const innerHeight = window.innerHeight;
    this.carouselHeight = innerHeight - top - 10;
  },
  data() {
    return {
      carouselHeight: 0,
      cycle: false,
      page_index: 1,
      articleLoading: false,
      taglist:[],
      articleStore: {
        list: [],
        total: 999
      },
      recommendedList: []
    };
  },
  methods: {
    async loadData() {
      const { total, list } = this.articleStore;
      if (total <= list.length) return;
      this.page_index++;
      this.articleLoading = true;

      const articleData = await this.$axios.get('/api/article/list/all', {
        params: {
          page_index: this.page_index
        }
      });
      this.articleStore.total = articleData.total;
      this.articleStore.list.push(...articleData.list);
      this.articleLoading = false;
    }
  }
};
</script>

<style lang="scss">
.carousel-info-box {
  margin-bottom: 60px;
  padding: 0 40px;
  h1 {
    font-weight: normal;
    margin-bottom: 20px;
  }
}
.carousel-image {
  border-radius: 8px;
  color: #fff;
}
.article-item .title_a {
  color: inherit;
  text-decoration: none;
}
.tag-item-link {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}
</style>
