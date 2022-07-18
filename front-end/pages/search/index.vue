<template>
  <v-container class="search-container py-0">
    <v-row>
      <v-col :md="8" :sm="12" :cols="12">
        <v-card class="mt-6 px-2 pb-4" :elevation="0">
          <v-card-title>
            <div
              style="width: 100%"
              class="d-flex align-center justify-space-between"
            >
              <span>搜索</span>
              <v-btn
                elevation="0"
                text
                @click="handleClear"
                v-if="this.keywords || (searchArticleData.list && typeof searchArticleData.list.length) || searchArticleDataEmpty"
              >
                <v-icon>{{ $icons['mdi-arrow-left'] }}</v-icon>
              </v-btn>
            </div>
          </v-card-title>
          <v-container class="mt-0">
            <div class="search-input-box">
              <input
                ref="keywords-input"
                v-model="keywords"
                type="text"
                placeholder="请输入关键词..."
                class="search-input-input"
                autofocus
              />
              <v-icon
                v-ripple
                class="search-input-icon"
                @click="handleSearch()"
                >{{ $icons['mdi-magnify'] }}</v-icon
              >
            </div>
          </v-container>
        </v-card>

        <v-card
          class="mt-6 pt-4 px-2 pb-4"
          v-if="searchArticleDataEmpty"
          :elevation="0"
        >
          <v-card-title> 没有找到任何内容 </v-card-title>
        </v-card>

        <v-card
          class="mt-6 pt-4 px-2 pb-4"
          :elevation="0"
          v-if="
            searchArticleData &&
            searchArticleData.list &&
            searchArticleData.list.length
          "
        >
          <v-container>
            <div class="">
              <div class="subtitle-2 mb-2">
                找到 {{ searchArticleData.list.length }} 条结果（用时
                {{ searchArticleData.time }} 毫秒）
              </div>
              <v-divider class="mb-4" />
              <div class="search-article-list-container">
                <ArticleItem
                  v-for="item in searchArticleData.list"
                  :key="item.id"
                  :id="item.id"
                  :title="item.title"
                  :content="item.summary"
                  :keywords="searchArticleData.keyList"
                />
              </div>
            </div>
          </v-container>
        </v-card>

        <v-card v-else class="mt-6 pt-4 px-2 pb-4" :elevation="0">
          <v-container>
            <div class="words_cloud-container">
              <div class="words_cloud-subtitle subtitle-2">
                这是 不才的博客 的站内搜索引擎。
              </div>
              <div class="words_cloud-item d-flex mt-4">
                <div
                  class="words_cloud-label subtitle-2 pt-1"
                  style="min-width: 60px; width: 60px"
                >
                  热搜词：
                </div>
                <div class="words_cloud-list d-flex align-center flex-wrap">
                  <v-btn
                    v-for="item in hotKeywordsList"
                    :key="item.id"
                    color="primary"
                    class="mb-1"
                    plain
                    small
                    text
                    nuxt
                    :to="{ path: '', query: { s: item.value } }"
                    @click="handleSearch(item.value)"
                    >{{ item.value }}</v-btn
                  >
                </div>
              </div>
              <div class="words_cloud-subtitle subtitle-2 mt-4 mb-3">
                你也可以在下面的标签中试试运气。
              </div>
              <div class="words_cloud-all d-flex align-center flex-wrap">
                <template v-for="item in cloudKeywordsList">
                  <v-btn
                    :key="item.id"
                    color="blue-grey darken-2"
                    class="mb-2 my-2 words_cloud-list-item"
                    :style="`opacity: ${
                      0.3 + item.count / 10
                    };font-size: ${Math.min(14 + item.count, 28)}px`"
                    plain
                    text
                    nuxt
                    :to="{ path: '', query: { s: item.value } }"
                    @click="handleSearch(item.value)"
                    >{{ item.value }}</v-btn
                  >
                </template>
              </div>
            </div>
          </v-container>
        </v-card>
      </v-col>
      <v-col :md="4" :sm="12" :cols="12">
        <!-- <tag-list :taglist="taglist" /> -->
        <v-lazy :value="$isServer" transition="scale-transition" min-height="100px">
          <div>
            <side-random-article :list="randomList" />
          </div>
        </v-lazy>
        <v-lazy :value="$isServer" transition="scale-transition" min-height="100px">
          <div>
            <side-comment-list :list="commentlist" />
          </div>
        </v-lazy>
      </v-col>
    </v-row>
    <!-- loading -->
    <Loading v-if="loading" />
  </v-container>
</template>
<script>
import ArticleList from '~/components/article/ArticleList.vue';
import ArticleItem from '@/components/search/ArticleItem.vue';
import TagList from '@/components/TagList.vue';
import SideRandomArticle from '@/components/SideRandomArticle.vue';
import SideCommentList from '@/components/SideCommentList.vue';
import Loading from '@/components/common/Loading.vue';

export default {
  head () {
    const { name } = this;
    return {
      title: name,
      meta: [
        // { hid: 'description', name: 'description', content: name },
        // { hid: 'keywords', name: 'keywords', content: [name].join() }
      ]
    }
  },
  async asyncData ({ params, query, $axios }) {
    const promiseList = [];
    promiseList.push($axios.get('/api/article/list/random'));
    promiseList.push($axios.get('/api/comment/list/new/article'));
    promiseList.push($axios.get('/api/keywords/hot'));
    promiseList.push($axios.get('/api/keywords/list/cloud?size=50'));

    if (query.s) {
      const s = Date.now()
      promiseList.push($axios.get('/api/article/list/search', {
        params: {
          keywords: query.s
        }
      }).then(res => {
        res.time = Date.now() - s;
        return res;
      }))
    }
    const [randomList, commentlist, hotKeywordsList, cloudKeywordsList, searchArticleData] = await Promise.all(promiseList);
    return {
      keywords: query.s || '',
      randomList: randomList || [],
      commentlist: commentlist || [],
      hotKeywordsList,
      cloudKeywordsList,
      searchArticleData: searchArticleData || {},
      loading: false,
      searchArticleDataEmpty: searchArticleData ? searchArticleData.list.length <= 0 : false,
    };
  },
  components: { ArticleItem, Loading, ArticleList, TagList, SideRandomArticle, SideCommentList },
  computed: {},
  data () {
    return {
      name: '',
      articleStore: {
        list: [],
        total: -1
      },
      loading: true,
      keywords: '',
      randomList: [],
      commentlist: [],
      cloudKeywordsList: [],
      hotKeywordsList: [],
      searchArticleData: {
        list: [],
        total: -1
      },
      searchArticleDataEmpty: false,
    };
  },
  mounted () {
    this.$refs['keywords-input'].focus()
  },
  watch: {
    $route () {
      if (process.client) {
        if (this.$route.query.s) {
          this.handleSearch(this.$route.query.s);
          this.handleLoadData();
        } else {
          this.keywords = '';
          this.searchArticleData = {
            list: []
          };
          this.searchArticleDataEmpty = false;
        }
      }
    }
  },
  methods: {
    handleSearch (keywords) {
      const k = (keywords || this.keywords);
      if (!k.trim()) {
        this.$snackbar.info('输入点什么吧');
        return;
      }
      this.$router.push('?s=' + encodeURIComponent(k));
      this.keywords = k;
    },
    async handleLoadData () {
      this.loading = true;
      const s = Date.now();
      const data = await this.$axios.get('/api/article/list/search', {
        params: {
          keywords: this.keywords
        }
      })
        .then(res => {
          res.time = Date.now() - s;
          return res;
        })
        .finally(() => {
          this.loading = false;
        });
      this.searchArticleData = data;
      this.searchArticleDataEmpty = data.list.length <= 0;
    },
    handleClear () {
      this.searchArticleData = {};
      this.$router.push('');
      this.keywords = '';
    }
  }
};
</script>
<style lang="scss" scoped>
.search-container {
  .theme--dark {
    .search-input-box {
      background-color: #272727;
      .search-input-input {
        color: #fff;
        &:focus,
        &:hover {
          background-color: #121212;
        }
      }
      .search-input-icon {
        /* background-color: #2196f3; */
      }
    }
    .words_cloud-all {
      .words_cloud-list-item {
        color: #62cdff !important;
      }
    }
  }
  .search-input-box {
    display: flex;
    align-items: center;
    width: 90%;
    height: 40px;
    background-color: #f4f4f4;
    border-radius: 4px;
    box-sizing: border-box;
    .search-input-input {
      display: block;
      flex-grow: 1;
      box-sizing: border-box;
      height: 100%;
      padding: 10px 16px;
      border: 1px solid transparent;
      transition: all 0.2s;
      border-radius: 4px 0 0 4px;
      &:focus,
      &:hover {
        background-color: #fff;
        border-color: rgba(4, 120, 190, 0.4);
        box-shadow: 0 0 0 4px rgb(4 120 190 / 10%);
        outline: none;
      }
    }
    .search-input-icon {
      height: 100%;
      width: 70px;
      background-color: #2196f3;
      color: #fff;
      border-radius: 0 4px 4px 0;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        opacity: 0.9;
        box-shadow: 0 0 0 4px rgb(4 120 190 / 10%);
      }
    }
  }
}
</style>