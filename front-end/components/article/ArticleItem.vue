<template>
  <v-card class="mx-auto mb-6 article-item">
    <v-lazy>
      <v-img
        :aspect-ratio="18/9"
        v-if="article.coverURL"
        :src="article.coverURL"
        :lazy-src="article.coverURL+'?imageMogr2/thumbnail/100x'"
      />
    </v-lazy>

    <v-card-title>
      <nuxt-link :to="`/article/${article._id}`" class="title_a">{{article.title}}</nuxt-link>
    </v-card-title>
    <v-card-subtitle>{{article.createdAt | format}}</v-card-subtitle>

    <v-card-text class="text--primary">
      <div>{{article.summary}}</div>
    </v-card-text>

    <v-card-actions class="d-flex align-center justify-space-between">
      <v-btn text color="error" nuxt :to="`/article/${article._id}`">开始阅读</v-btn>
      <div>
        <v-btn text>
          <v-icon left>mdi-eye</v-icon>
          {{article.browseCount}}
        </v-btn>
        <v-btn text :color="hasLike(article.likes)?'error':''">
          <v-icon left :color="hasLike(article.likes)?'error':''">mdi-cards-heart</v-icon>
          {{article.likes ? article.likes.length : 0}}
        </v-btn>
        <v-btn text>
          <v-icon left>mdi-message</v-icon>
          {{article.commentCount}}
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>
<script>
import mixin from '@/utils/mixin';
export default {
  mixins: [mixin],
  components: {},
  props: {
    article: {
      type: Object,
      default () {
        return {
          _id: null,
          coverURL: null,
          createdAt: 0,
          summary: '',
          browseCount: 0,
          loveCount: 0,
          commentCount: 0
        };
      }
    }
  },
  computed: {},
  data () {
    return {};
  },
  created () { },
  mounted () { },
  methods: {}
};
</script>
<style lang="scss" scoped>
.article-item .title_a {
  color: inherit;
  text-decoration: none;
}
</style>