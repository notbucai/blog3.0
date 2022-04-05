<template>
  <v-container class="content-container links pa-0">
    <div class="title" style="margin: 0px 0px 5px 6px">友邻</div>
    <div class="subtitle-2 red--text text--lighten-1" style="margin: 10px 5px">
      申请规则
    </div>

    <v-card>
      <v-container class="body-2">
        <div>
          如果要和本站交换友链，请按照以下格式发送到
          <a href="mailto:1450941858@qq.com" class="font-weight-bold"
            >1450941858@qq.com</a
          >
        </div>
        <div>
          <div style="margin: 8px 0px">
            <div>博客名字: 不才的博客</div>
            <div>
              博客地址:
              <a href="https://www.notbucai.com">https://www.notbucai.com</a>
            </div>
            <div>博客简介: 啥也不会</div>
            <div style="overflow-wrap: break-word">
              博客头像:
              <a href="https://image.notbucai.com/logo.png" target="_blank"
                >https://image.notbucai.com/logo.png</a
              >
            </div>
          </div>
          <v-divider></v-divider>
          <div style="margin-top: 10px">
            <div class="caption font-italic">
              注① : 希望你的网站非采集以及纯技术站点，且每三个月至少有一次更新。
            </div>
            <div class="caption font-italic">
              注② :
              为了更快的效率，请提前加上我的友链，我会在一天内尽快给出答复，谢谢！
            </div>
            <div class="caption font-italic">2020-06-30</div>
          </div>
        </div>
      </v-container>
    </v-card>

    <div class="subtitle-2" style="margin: 15px 5px 5px">
      朋友们 (默认按添加时间排序)
    </div>

    <v-row>
      <v-col
        :md="3"
        :sm="4"
        :cols="6"
        v-for="(item, index) in links"
        :key="index"
      >
        <v-card :href="item.url" target="_blank" min-height="80">
          <div class="d-flex align-start">
            <v-avatar
              size="46"
              class="ml-2 mt-2"
              style="border-radius: 6px"
              v-if="item.logo"
            >
              <img :src="item.logo" :alt="item.title" />
            </v-avatar>
            <v-card-content>
              <v-card-text class="pb-0 pt-2 font-weight-bold link-info-text">{{
                item.title
              }}</v-card-text>
              <v-card-text
                class="pt-0 mb-2 pb-0 body-2 caption link-info-text"
                >{{ item.intro }}</v-card-text
              >
            </v-card-content>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  head () {
    return {
      title: '友邻',
      meta: []
    }
  },
  async asyncData ({ isDev, route, store, env, params, query, req, res, redirect, error, $axios }) {
    const links = await $axios.get('/api/links/list');
    return {
      links
    }
  },
  components: {},
  computed: {},
  data () {
    return {
      links: []
    };
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.links {
  .link-info-text {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
    word-break: break-all;
  }
}
</style>