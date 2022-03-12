<!--
 * @Author: bucai
 * @Date: 2020-05-23 11:19:02
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2022-03-12 16:52:01
 * @Description: 
--> 

<template>
  <v-container class="py-0">
    <v-row>
      <v-col :md="8" :sm="12" :cols="12">
        <v-container fluid class="py-0">
          <v-row justify="space-between" align="center">
            <div class="title">{{name}}</div>
            <v-switch :value="false" inset label="列表"></v-switch>
          </v-row>
        </v-container>
        <article-list :articleStore="articleStore" />
      </v-col>
      <v-col :md="4" :sm="12" :cols="12">
        <!-- <tag-list :taglist="taglist" /> -->
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import ArticleList from '~/components/article/ArticleList.vue';
import TagList from '@/components/TagList.vue';

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
  async asyncData ({ params, $axios }) {
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
  data () {
    return {
      name: '',
      articleStore: {
        list: [],
        total: -1
      }
    };
  },
  mounted () { },
  methods: {}
};
</script>
<style lang="scss" scoped>
.tagname {
}
</style>