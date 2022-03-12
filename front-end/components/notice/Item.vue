<template>
  <v-card class="notice-item">
    <v-card-title class="pb-2">
      <div class="d-flex align-center">
        <v-lazy
          min-height="42"
          min-width="42"
          :value="$isServer"
          v-if="notice.sender"
        >
          <v-avatar size="42">
            <v-img
              :lazy-src="$config.WEBSITE_LOGO"
              :src="notice.sender.avatarURL | imageMogr2(56)"
            ></v-img>
          </v-avatar>
        </v-lazy>
        <div class="d-flex flex-column">
          <div class="d-flex align-center">
            <v-btn
              v-if="notice.sender"
              nuxt
              :to="'/user/' + notice.sender._id"
              color="success"
              plain
              small
              >{{ notice.sender.username }}</v-btn
            >
            <div class="body-2">{{ template[notice.senderAction] }}</div>
            <div
              v-if="
                notice.objectType === 'article' &&
                objectType[notice.objectType] &&
                notice.source
              "
              class="body-2"
            >
              {{ objectType[notice.objectType] }}
            </div>
            <v-btn
              v-if="notice.objectType"
              nuxt
              small
              :to="url(notice.objectType, notice.objectID)"
              color="success"
              plain
            >
              {{
                notice.objectType === 'article' && notice.source
                  ? notice.source.title
                  : objectType[notice.objectType]
              }}
            </v-btn>
          </div>
          <div class="pl-3 d-flex align-center">
            <span class="caption text--secondary">{{
              notice.createdAt | format
            }}</span>
          </div>
        </div>
      </div>
    </v-card-title>
    <div class="pb-4 pl-4 body-2">
      {{ notice.message }}
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
        article: '文章', // 文章·
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