<template>
  <div class="comment-item pa-6 pb-2 pt-4">
    <div class="comment-user d-flex align-center justify-space-between">
      <user-card :userId="comment.user._id">
        <nuxt-link
          :to="`/user/${comment.user._id}`"
          class="d-flex align-start text-decoration-none"
        >
          <div class="mr-2" v-if="comment.user.avatarURL">
            <v-avatar size="42">
              <v-img
                :lazy-src="$config.WEBSITE_LOGO"
                :src="comment.user.avatarURL | imageMogr2(68)"
              ></v-img>
            </v-avatar>
          </div>
          <div>
            <div class="body-2 d-flex align-center">
              <v-chip
                v-if="
                  source === 'article' &&
                  sourceData &&
                  sourceData.user._id === comment.user._id
                "
                outlined
                x-small
                color="green"
                label
                class="mr-2"
              >
                作者
              </v-chip>
              <span class="text--secondary">{{ comment.user.username }}</span>
            </div>
          </div>
        </nuxt-link>
      </user-card>
      <div
        class="comment-operate"
        v-if="
          (user && comment.user && comment.user._id == user._id) ||
          type !== 'user'
        "
      >
        <v-menu offset-y :close-on-content-click="true" close-on-click>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              x-small
              class="comment-operate-icon"
              v-bind="attrs"
              v-on="on"
              >{{ $icons['mdi-dots-vertical'] }}</v-icon
            >
          </template>
          <div>
            <div>
              <v-btn
                v-if="type !== 'user'"
                color="primary"
                :elevation="0"
                x-small
                text
                @click="handleReply(comment)"
                >回复</v-btn
              >
            </div>
            <div>
              <v-btn
                color="error"
                :elevation="0"
                x-small
                text
                @click="handleDelete(comment)"
                :loading="deleteIng"
                v-if="user && comment.user && comment.user._id == user._id"
                >删除</v-btn
              >
            </div>
          </div>
        </v-menu>
      </div>
    </div>
    <div class="comment-centent">
      <div v-html="comment.htmlContent" class="markdown-body body-1"></div>
      <div class="mt-1 d-flex align-center">
        <span class="caption text--secondary">{{
          comment.createdAt | format
        }}</span>
        <div class="ml-2 d-flex align-center comment-like">
          <v-btn text x-small :ripple="false" @click="handleClickLike(comment)">
            <v-icon
              x-small
              class="comment-like-icon"
              :color="hasLike(comment.likes) ? 'error' : ''"
              >{{ $icons['mdi-cards-heart'] }}</v-icon
            >
            <span class="caption ml-1">{{
              comment.likes ? comment.likes.length : 0
            }}</span>
          </v-btn>
        </div>
      </div>
    </div>

    <div class="comment-item-reply-box mt-3 pl-3" v-if="comment.replylist">
      <template v-for="_item in comment.replylist">
        <comment-item
          :key="_item._id"
          :comment="_item"
          :source="source"
          @reply="handleReply"
          :source-data="sourceData"
          @delete="handleDelete($event, comment)"
        />
      </template>
    </div>

    <div class="comment-item-reply-btn mt-2" v-if="comment.commentCounts">
      <v-btn
        text
        x-small
        @click="handleGetCommentReply(comment)"
        :loading="comment.isFetReplyIng"
        v-if="!comment.replylist"
        >展开 {{ comment.commentCounts }} 条回复</v-btn
      >
      <v-btn text x-small @click="handleGetCommentReply(comment)" v-else
        >收起</v-btn
      >
    </div>
  </div>
</template>
<script>
import CommentItem from './CommentItem';
import UserCard from '@/components/user/UserCard.vue';
import { mapState } from 'vuex';
import mixin from '@/utils/mixin';

export default {
  mixins: [mixin],
  name: 'CommentItem',
  components: { CommentItem, UserCard },
  props: {
    type: {
      type: String,
      default: 'article'
    },
    comment: {
      type: Object,
      default () {
        return {
          _id: null,
          createdAt: 0,
          htmlContent: ''
        };
      }
    },
    source: {
      type: String,
      default: 'article'
    },
    sourceData: {
      type: Object,
      default () {
        return null;
      }
    }
  },
  computed: {
    ...mapState(['user'])
  },
  data () {
    return {
      deleteIng: false,
    };
  },
  mounted () { },
  methods: {
    async handleGetCommentReply (comment) {
      if (Array.isArray(comment.replylist) && comment.replylist.length > 0) {
        this.$set(comment, 'replylist', null);
        this.$set(comment, 'isFetReplyIng', false);
        return;
      }
      this.$set(comment, 'isFetReplyIng', true);

      const id = comment._id;
      const resData = await this.$axios(
        `/api/comment/list/${this.source}?rootID=${id}`
      );
      this.$set(comment, 'replylist', resData);
    },
    async handleDelete (comment, parent) {
      // 执行删除
      this.deleteIng = true;
      try {
        await this.$axios.delete(`/api/comment/${this.source}/${comment._id}`);
        if (parent) {
          // 在当前列表中移除
          // this.comment.replylist.
          const index = this.comment.replylist.findIndex(
            item => item._id == comment._id
          );
          this.comment.replylist.splice(index, 1);
        } else {
          // 发送给父级
          this.$emit('delete', comment);
        }
      } catch (error) {
        console.error(error);
      }
      this.deleteIng = false;
    },
    handleReply (comment) {
      this.$emit('reply', comment);
    },
    async handleClickLike (comment) {
      const id = comment._id;
      try {
        const likes = this.changeLike(comment.likes);
        await this.$axios.put('/api/comment/' + this.source + '/' + id + '/like');
        this.$set(comment, 'likes', likes);
      } catch (error) {
        console.log('error', error);
      }
    }
  }
};
</script>
<style lang="scss">
.theme--dark {
  .comment-item {
    background-color: #000 !important;
    &::after {
      background-color: #121212 !important;
    }
    .comment-item-reply-btn {
      &::before {
        background-color: #121212 !important;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.comment-item {
  background-color: #fff;
  position: relative;
  &::after {
    content: '';
    display: block;
    position: absolute;
    right: 0;
    bottom: 0;
    height: 1px;
    background-color: #f4f5f6;
    width: calc(100% - 60px);
  }
  &:last-child {
    &::after {
      display: none;
    }
  }
  &:hover {
    .comment-like .comment-like-icon {
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
  .comment-like {
    &:hover {
      .comment-like-icon {
        color: #333;
      }
    }
  }
  .comment-item-reply-btn {
    display: flex;
    align-items: center;
    &::before {
      content: '';
      height: 1px;
      width: 42px;
      background-color: #f4f5f6;
    }
  }
  .author-icon {
  }
  .comment-centent {
    margin-left: 42px + 8px;
    margin-top: -20px;
  }
  .comment-operate {
    position: absolute;
    right: 24px;
    top: 12px;
  }
}
</style>