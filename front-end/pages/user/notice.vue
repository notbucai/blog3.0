<template>
  <v-container>
    <!-- tab -->
    <v-tabs :value="tabIndex" color="primary" optional slider-color="primary">
      <v-tab v-for="item in tabRoutes" :key="item.path">{{ item.name }}</v-tab>
    </v-tabs>
    <!-- router -->
    <v-row>
      <v-col v-show="tabIndex == 0" v-if="list && list.list">
        <div class="mt-4" v-for="(item, index) in list.list" :key="item.id">
          <NoticeItem :notice="item" />
        </div>
      </v-col>
      <!--  -->
    </v-row>
    <div class="d-flex justify-center mt-6" v-if="list.list">
      <v-btn color="primary" nuxt :loading="loading" @click="handleLoadData" v-if="list.list.length < list.total">加载更多</v-btn>
      <span v-else>没了，别看了。</span>
    </div>
  </v-container>
</template>
<script>
import NoticeItem from '@/components/notice/Item';
export default {
  middleware: 'auth',
  async asyncData ({ $axios }) {
    const list = await $axios.get('/api/users/notify/list?page_index=1&page_size=10');
    console.log('list', list);
    return {
      list,
    }
  },
  components: {
    NoticeItem
  },
  filters: {
    notifyType (type) {
      return {
        1: "文章",
        2: "评论",
        3: "留言",
        4: "系统",
        5: "用户",
        61: "文章",
        62: "评论",
        7: "文章",
      }[type];
    }
  },
  computed: {
    tabIndex () {
      return 0;
    }
  },
  data () {
    return {
      list: {
        list: [],
        total: 0
      },
      loading: false,
      paging: {
        index: 1,
        size: 10,
      },
      tabRoutes: [
        {
          path: '1',
          name: "用户消息"
        }
      ]
    };
  },
  mounted () {
    this.$store.dispatch('emitNoticeCount');
  },
  methods: {
    getPath ({ type, source }) {

      // item.type
      const itemGen = {
        1: {
          key: "id",
          url: "/article/"
        },
        2: {
          key: "sourceId",
          url: "/article/"
        },
        3: {
          key: null,
          url: "/message"
        },
        61: {
          key: "sourceId",
          url: "/article/"
        },
        62: {
          key: null,
          url: "/message"
        },
        7: {
          key: "id",
          url: "/article/"
        },
      }[type];
      if (!itemGen || !source) return '';

      return itemGen.url + (source[itemGen.key] || '');
    },
    handleLoadData() {
      this.paging.index++;
      this.loadData();
    },
    async loadData () {
      const paging = this.paging;
      const list = await this.$axios.get('/api/users/notify/list', {
        params: {
          page_index: paging.index,
          page_size: paging.size,
        }
      });
      console.log('list', list);
      this.list.total = list.total;
      this.list.list.push(...list.list);
    }
  }
};
</script>
<style lang="scss" scoped>
.edit {}
</style>