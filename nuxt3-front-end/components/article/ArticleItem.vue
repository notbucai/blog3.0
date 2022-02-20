<template>
  <v-card
    class="mx-auto mb-6 article-item"
    :shaped="article.up == 1"
    v-intersect="{
      handler: onIntersect,
      options: {
        threshold: [0, 0.5, 1.0],
      },
    }"
  >
    <!--  -->
    <!--  -->
    <!-- threshold: [0.5, 0.75, 1], -->
    <v-img
      cover
      :aspect-ratio="18 / 9"
      v-if="article.coverURL"
      class="article-pic"
      :src="article.coverURL"
      :lazy-src="article.coverURL"
    />

    <v-card-title>
      <NuxtLink :to="`/article/${article._id}`" class="title_a">
        <span v-if="article.up == 1" class="body-2">[置顶]</span>
        {{ article.title }}
      </NuxtLink>
    </v-card-title>
    <v-card-subtitle>
      <span>{{ article.createdAt }}</span>
    </v-card-subtitle>

    <v-card-text class="text--primary">
      <p>{{ article.summary }}</p>
    </v-card-text>

    <v-card-actions class="d-flex align-center justify-space-between">
      <!-- <v-btn
        variant="text"
         color="pink-lighten-1"
        >开始阅读</v-btn
      > -->
      <!-- <NuxtLink :to="`/article/${article._id}`"> -->
      <!-- // todo link -->
      <v-btn variant="text" color="pink-lighten-1">开始阅读</v-btn>
      <!-- </NuxtLink> -->
      <div>
        <v-btn text>
          <v-icon left>mdi-eye</v-icon>
          {{ article.browseCount }}
        </v-btn>
        <v-btn text :color="hasLike(article.likes) ? 'error' : ''">
          <v-icon
            left
            class="heart-icon"
            :color="hasLike(article.likes) ? 'error' : ''"
            >mdi-cards-heart</v-icon
          >
          {{ article.likes ? article.likes.length : 0 }}
        </v-btn>
        <v-btn text>
          <v-icon left>mdi-message</v-icon>
          {{ article.commentCount }}
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>
<script lang="ts" setup>

import { useChangeLike, useHasLike } from '~~/composables/common';

const props = defineProps({
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
});

const article = computed(() => {
  return props.article;
})


const istransition = useState('istransition', () => false)
const hasLike = useHasLike()
const changeLike = useChangeLike()
function onIntersect (status: boolean, entries: any[], observer) {
  if (entries[0].intersectionRatio >= 0.5) {
    istransition.value = true;
  }
}

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
    .v-img__img {
      transition: transform 0.5s;
    }
  }
  &:hover {
    .article-pic {
      ::v-deep {
        .v-img__img {
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