<template>
  <v-container>
    <banner :recommendedList="recommendedList" v-if="recommendedList && recommendedList.length" />
    <!-- class="my-4" -->
    <v-row>
      <v-col :md="8" :sm="12" :cols="12">
        <v-container fluid class="py-0">
          <v-row justify="space-between" align="center">
            <div class="title">全部文章</div>
            <v-switch :value="false" inset label="热门" disabled></v-switch>
          </v-row>
        </v-container>
        <article-list :articleStore="articleStore" @loadData="loadData" />
      </v-col>
      <v-col :md="4" :sm="12" :cols="12">
        <tag-list :taglist="taglist" />
        <side-random-article :list="randomList" />
        <side-comment-list :list="commentlist" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ArticleItem from '@/components/article/ArticleItem.vue';
import Banner from '@/components/Banner.vue';
import SideRandomArticle from '@/components/SideRandomArticle.vue';
import SideCommentList from '@/components/SideCommentList.vue';
import ArticleList from '@/components/ArticleList.vue';
import TagList from '@/components/TagList.vue';
export default {
  scrollToTop: true,
  async asyncData ({ $axios }) {
    const promiseList = [];
    promiseList.push($axios.get('/api/article/list/hot'));
    promiseList.push($axios.get('/api/article/list/all'));
    promiseList.push($axios.get('/api/tag/list/effect'));
    promiseList.push($axios.get('/api/article/list/random'));
    promiseList.push($axios.get('/api//comment/list/new/article'));

    const [hotList, allList, taglist, randomList, commentlist] = await Promise.all(promiseList);
    return {
      taglist: taglist || [],
      recommendedList: hotList.list || [],
      articleStore: allList || {},
      randomList: randomList || [],
      commentlist: commentlist || []
    };
  },
  mounted () { },
  components: { ArticleItem, Banner, ArticleList, TagList, SideRandomArticle, SideCommentList },
  data () {
    return {
      cycle: false,
      page_index: 1,
      taglist: [],
      articleStore: {
        list: [],
        total: 999
      },
      randomList: [],
      recommendedList: [],
      commentlist: [],
    };
  },
  methods: {
    async loadData () {
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
