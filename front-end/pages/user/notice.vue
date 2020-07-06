<template>
  <v-container>
    <!-- tab -->
    <v-tabs :value="tabIndex" color="primary" optional slider-color="primary">
      <v-tab v-for="item in tabRoutes" :key="item.path">{{item.name}}</v-tab>
    </v-tabs>
    <!-- router -->
    <v-row>
      <v-col :md="9" :sm="12" :cols="12" v-show="tabIndex == 0">
        <div class="mb-4" v-for="(item, index) in list" :key="index">
          <v-card>
            <v-card-title>
              {{item.user?item.user.username:'有人'}}{{item.content}}你的
              <nuxt-link :to="getPath(item)">{{item.type|notifyType}}</nuxt-link>
            </v-card-title>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  middleware: 'auth',
  async asyncData ({ $axios }) {
    const list = await $axios.get('/api/users/notify/list');
    return {
      list
    }
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
      list: [],
      tabRoutes: [
        {
          path: '1',
          name: "用户消息"
        }
      ]
    };
  },

  mounted () { },
  methods: {
    getPath ({ type, source }) {

      // item.type
      const itemGen = {
        1: {
          key: "_id",
          url: "/article/"
        },
        2: {
          key: "sourceID",
          url: "/article/"
        },
        3: {
          key: null,
          url: "/message"
        },
        61: {
          key: "sourceID",
          url: "/article/"
        },
        62: {
          key: null,
          url: "/message"
        },
        7: {
          key: "_id",
          url: "/article/"
        },
      }[type];
      if (!itemGen || !source) return '';

      return itemGen.url + (source[itemGen.key] || '');
    }
  }
};
</script>
<style lang="scss" scoped>
.edit {
}
</style>