<template>
  <v-card class="notice-item">
    <v-card-title>
      <v-lazy min-height="56" min-width="56" v-if="notice.sender">
        <v-avatar size="56">
          <v-img :src="notice.sender.avatarURL | imageMogr2(56)"></v-img>
        </v-avatar>
      </v-lazy>
      <v-btn
        v-if="notice.sender"
        nuxt
        :to="'/user/' + notice.sender._id"
        color="success"
        plain
        large
        class="title"
        >{{ notice.sender.username }}</v-btn
      >
      <div>{{ template[notice.senderAction] }}</div>
      <v-btn
        v-if="objectType[notice.objectType]"
        nuxt
        :to="url(notice.objectType, notice.objectID)"
        color="success"
        plain
        large
        class="title"
        >{{ objectType[notice.objectType] }}</v-btn
      >
    </v-card-title>

    <div class="pa-4" v-if="notice.objectType === 'article' && notice.source">
      <div class="article-box">
        <NuxtLink
          :to="'/article/' + notice.source._id"
          class="article-link mb-4 pa-4"
        >
          <header class="text-h6 mb-2">
            <span>
              {{ notice.source.title }}
            </span>
          </header>
          <main class="body-2">
            <span>{{ notice.source.summary }}</span>
          </main>
        </NuxtLink>
      </div>
    </div>
  </v-card>
</template>
<script>
export default {
  props: {
    notice: Object
  },
  data () {
    return {
      template: {
        comment: "评论了你的",
        like: "点赞了你的",
        follow: "关注了你",
      },
      objectType: {
        article: '文章', // 文章
        comment: '评论', // 评论
        message: '回复', // 回复
        user: '用户', // 用户
      },
    };
  },
  created () {
  },
  methods: {
    url (type, id) {

      return {
        article: `/article/${id}`, // 文章
        comment: `/article/${id}#comment`, // 评论
        message: '/message', // 回复
        user: `/user/${id}`, // 用户
      }[type];
    }
  }
}
</script>
<style lang="scss" scoped>
.notice-item {
  &.theme--dark {
    .article-box {
      .article-link {
        background-color: #263238;
        header {
          color: #eceff1;
        }
        main {
          color: #cfd8dc;
        }
      }
    }
  }
  .article-box {
    .article-link {
      text-decoration: none;
      display: block;
      border-radius: 4px;
      background-color: #eceff1;
      header {
        color: #263238;
      }
      main {
        color: #37474f;
      }
    }
  }
}
</style>