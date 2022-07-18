<template>
  <div class="ArticleList">
    <v-lazy
      v-for="item in articleStore.list"
      :key="item.id"
      min-height="160"
      transition="scale-transition"
      :value="$isServer"
    >
      <div>
        <article-item :article="item" />
      </div>
    </v-lazy>
    <div
      class="d-flex justify-center"
      v-if="articleStore.list && articleStore.list.length < articleStore.total"
    >
      <v-btn
        color="error"
        :elevation="0"
        rounded
        :loading="articleLoading"
        @click="loadData"
        >加载更多</v-btn
      >
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
      default () {
        return {
          list: [],
          total: 999
        };
      }
    }
  },
  computed: {},
  data () {
    return {
      articleLoading: false
    };
  },
  mounted () {
    console.log(this.$isServer);
  },
  methods: {
    loadData () {
      this.$emit('loadData');

    }
  }
};
</script>
<style lang="scss" scoped>
.ArticleList {
}
</style>