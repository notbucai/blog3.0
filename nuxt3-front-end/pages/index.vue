<template>
  <div>
    <v-row align="center" justify="center">
      <v-col xl="7" lg="8" md="9" sm="11" xs="12">
        <banner
          :recommendedList="homeData.recommendedList || []"
          v-if="homeData.recommendedList && homeData.recommendedList.length"
        />
      </v-col>
    </v-row>
    <v-container class="content-container">
      <!-- class="my-4" -->
      <v-row>
        <v-col :md="8" :sm="12" :cols="12">
          <v-container fluid class="py-0">
            <v-row justify="space-between" align="center">
              <div class="title">全部文章</div>
              <v-switch :value="false" inset label="热门" disabled></v-switch>
            </v-row>
          </v-container>
          <article-list
            :articleStore="homeData.articleStore"
            @loadData="loadData"
          />
        </v-col>
        <v-col :md="4" :sm="12" :cols="12">
          <v-lazy transition="scale-transition" min-height="100px">
            <div>
              <tag-list :taglist="homeData.taglist" />
            </div>
          </v-lazy>
          <v-lazy transition="scale-transition" min-height="100px">
            <div>
              <side-random-article :list="homeData.randomList" />
            </div>
          </v-lazy>
          <v-lazy transition="scale-transition" min-height="100px">
            <div>
              <side-comment-list :list="homeData.commentlist" />
            </div>
          </v-lazy>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts" setup>

// import ArticleItem from '@/components/article/ArticleItem.vue';
// import Banner from '@/components/Banner.vue';
// import SideRandomArticle from '@/components/SideRandomArticle.vue';
// import SideCommentList from '@/components/SideCommentList.vue';
// import ArticleList from '@/components/ArticleList.vue';
// import TagList from '@/components/TagList.vue';
const { data, pending, } = useFetch<string, { code: number, data: any }>('/api/cache/home')

const homeData = computed(() => {
  const [hotList, allList, taglist, randomList, commentlist] = ((data.value || {}).data || []);
  return {
    taglist: taglist || [],
    recommendedList: hotList?.list || [],
    articleStore: allList || {},
    randomList: randomList || [],
    commentlist: commentlist || [],
    timed: Date.now(),
  }
})

const loadData = () => {

}

// export default {
//   scrollToTop: true,
//   async asyncData ({ $axios }) {


//     const t = Date.now()
//     console.time(`INDEX__ASYNC_DATA[${t}]`);
//     const [hotList, allList, taglist, randomList, commentlist] = await $axios.get('/cache/data/home')
//     console.timeEnd(`INDEX__ASYNC_DATA[${t}]`);

//     return {
//       taglist: taglist || [],
//       recommendedList: hotList.list || [],
//       articleStore: allList || {},
//       randomList: randomList || [],
//       commentlist: commentlist || [],
//       timed: Date.now(),
//     };
//   },
//   mounted () {
//   },
//   components: { ArticleItem, Banner, ArticleList, TagList, SideRandomArticle, SideCommentList },
//   data () {
//     return {
//       timed: 0,
//       cycle: false,
//       page_index: 1,
//       taglist: [],
//       articleStore: {
//         list: [],
//         total: 999
//       },
//       randomList: [],
//       recommendedList: [],
//       commentlist: [],
//     };
//   },
//   methods: {
//     async loadData () {
//       const { total, list } = this.articleStore;
//       if (total <= list.length) return;
//       this.page_index++;
//       this.articleLoading = true;

//       const articleData = await this.$axios.get('/api/article/list/all', {
//         params: {
//           page_index: this.page_index
//         }
//       });
//       this.articleStore.total = articleData.total;
//       this.articleStore.list.push(...articleData.list);
//       this.articleLoading = false;
//     }
//   }
// };
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

.tag-item-link {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.theme--dark {
  .Index {
    background-color: #1e1e1e;

    .height {
      background-color: #000;
      color: #fff;
    }

    .v-note-wrapper.markdown-body {
      background-color: inherit;
      border: #303030;
    }

    .v-note-wrapper
      .v-note-panel
      .v-note-edit.divarea-wrapper.scroll-style::-webkit-scrollbar {
      background-color: #000;
    }

    .v-note-wrapper
      .v-note-panel
      .v-note-show
      .v-show-content.scroll-style::-webkit-scrollbar-thumb,
    .v-note-wrapper
      .v-note-panel
      .v-note-show
      .v-show-content-html.scroll-style::-webkit-scrollbar-thumb {
      background-color: #303030;
    }
  }
}
</style>
