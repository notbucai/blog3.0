<!--
 * @Author: bucai
 * @Date: 2020-05-23 11:19:02
 * @LastEditors: bucai
 * @LastEditTime: 2020-05-23 13:34:50
 * @Description: 
--> 

<template>
  <v-container>
    <v-row>
      <v-col cols="8">
        <div class="title">
          标签
          <span>{{name}}</span> 的文章
        </div>

        <article-list :articleStore="articleStore" />
      </v-col>
      <v-col cols="4">
        <tag-list :taglist="taglist" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import ArticleList from '@/components/ArticleList.vue';
import TagList from '@/components/TagList.vue';

export default {
  async asyncData({ params, $axios }) {
    const { name } = params;
    const resData = await $axios.post(
      `/api/tag/${encodeURIComponent(name)}/article`,
      {
        page_size: 20,
        page_index: 1
      }
    );
    return {
      articleStore: resData,
      name
    };
  },
  components: { ArticleList, TagList },
  computed: {},
  data() {
    return {
      name: '',
      articleStore: {
        list: [],
        total: -1
      }
    };
  },
  mounted() {},
  methods: {}
};
</script>
<style lang="scss" scoped>
.tagname {
}
</style>