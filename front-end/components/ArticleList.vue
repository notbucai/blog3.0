<template>
  <div class="ArticleList">
    <article-item v-for="item in articleStore.list" :key="item._id" :article="item" />
    <div class="d-flex justify-center" v-if="articleStore.list.length < articleStore.total">
      <v-btn color="error" :elevation="0" rounded :loading="articleLoading" @click="loadData">加载更多</v-btn>
    </div>
  </div>
</template>
<script>
import ArticleItem from '@/components/article/ArticleItem.vue';
export default {
  components: { ArticleItem },
  props: {
    articleStore: {
      required: true,
      type: Object,
      default() {
        return {
          list: [],
          total: 999
        };
      }
    }
  },
  computed: {},
  data() {
    return {
      articleLoading: false
    };
  },
  mounted() {},
  methods: {
    loadData() {
      this.$emit('loadData');
    }
  }
};
</script>
<style lang="scss" scoped>
.ArticleList {}
</style>