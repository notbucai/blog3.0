<template>
  <v-card
    class="mx-auto mb-6 article-item"
    v-intersect="{
      handler: onIntersect,
      options: {
        threshold: [0, 0.5, 1.0],
      },
    }"
    :shaped="article.up == 1"
  >
    <!-- threshold: [0.5, 0.75, 1], -->
    <v-img
      :aspect-ratio="18 / 9"
      v-if="article.coverURL"
      class="article-pic"
      :src="article.coverURL | imageMogr2(800)"
      :lazy-src="article.coverURL | imageMogr2(68)"
    />

    <v-card-title>
      <nuxt-link :to="`/article/${article._id}`" class="title_a">
        <span v-if="article.up == 1" class="body-2">[置顶]</span>
        {{ article.title }}
      </nuxt-link>
    </v-card-title>
    <v-card-subtitle>
      <span>{{ article.createdAt | format }}</span>
    </v-card-subtitle>

    <v-card-text class="text--primary">
      <p>{{ article.summary }}</p>
    </v-card-text>

    <v-card-actions class="d-flex align-center justify-space-between">
      <v-btn text color="error" nuxt :to="`/article/${article._id}`"
        >开始阅读</v-btn
      >
      <div>
        <v-btn text nuxt :to="`/article/${article._id}`">
          <v-icon left>{{ $icons['mdi-eye'] }}</v-icon>
          {{ article.browseCount }}
        </v-btn>
        <v-btn
          text
          :color="hasLike(article.likes) ? 'error' : ''"
          @click="handleLike(article)"
        >
          <v-icon
            left
            class="heart-icon"
            :color="hasLike(article.likes) ? 'error' : ''"
            >{{ $icons['mdi-cards-heart'] }}</v-icon
          >
          {{ article.likes ? article.likes.length : 0 }}
        </v-btn>
        <v-btn text nuxt :to="`/article/${article._id}#comment`">
          <v-icon left>{{ $icons['mdi-message'] }}</v-icon>
          {{ article.commentCount }}
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
    return {
      istransition: false,
    };
  },
  created () { },
  mounted () { },
  methods: {
    onIntersect (entries, observer) {
      if (entries[0].intersectionRatio >= 0.5) {
        this.istransition = true;
      }
    },
    async handleLike (article) {
      const aid = article._id;
      try {
        const likes = this.changeLike(article.likes);
        await this.$axios.put('/api/article/' + aid + '/like');
        this.$set(article, 'likes', likes);
      } catch (error) {
        console.log('error', error);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.article-item {
  transition: background-size 0.2s;
  overflow: hidden;
  .title_a {
    color: inherit;
    text-decoration: none;
  }
  a,
  span,
  i,
  p {
    /* transform: translateY(50%); */
    /* opacity: 0.4; */
    /* transition: transform 0.7s, opacity 1.2s; */
    /* transition-timing-function: ease-out; */
  }
  &.transition {
    a,
    span,
    i,
    p {
      @keyframes itemMove {
        0% {
          transform: translateY(50%);
          opacity: 0.5;
        }
        80% {
          opacity: 0.8;
          transform: translateY(10%);
        }
        100% {
          transform: translateY(0);
          opacity: 1;
        }
      }
      transform: translateY(50%);
      opacity: 0.5;
      animation: itemMove 1.2s forwards;
    }
  }
  ::v-deep {
    .v-image__image {
      transition: transform 0.5s;
    }
  }
  &:hover {
    .article-pic {
      ::v-deep {
        .v-image__image {
          transform: scale(1.2);
        }
      }
    }
    .heart-icon {
      @keyframes heartbeat {
        0% {
          transform: scale(1, 1);
          opacity: 1;
        }
        25% {
          transform: scale(1.3, 1.3);
          opacity: 0.8;
        }
        100% {
          transform: scale(1, 1);
          opacity: 1;
        }
      }
      animation: heartbeat 1s infinite;
    }
  }
}
</style>