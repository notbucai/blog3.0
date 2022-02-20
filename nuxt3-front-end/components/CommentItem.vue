<template>
  <div class="comment-item pa-3" v-ripple>
    <div class="comment-user d-flex align-center justify-space-between">
      <NuxtLink
        v-ripple
        tag="div"
        :to="`/user/${comment.user._id}`"
        class="d-flex align-center"
        v-if="comment.user"
      >
        <div class="mr-2" v-if="comment.user.avatarURL">
          <v-avatar size="36">
            <v-img :src="comment.user.avatarURL | imageMogr2(100, 100)"></v-img>
          </v-avatar>
        </div>
        <div v-if="type !== 'user'">
          <div class="body-2 d-flex align-center">
            <v-btn
              v-if="
                source === 'article' &&
                sourceData &&
                sourceData.user._id === comment.user._id
              "
              color="accent"
              outlined
              tile
              x-small
              disabled
              class="mr-1"
            >作者</v-btn>
            <span class="pr-2">{{ comment.user.username }}</span>
            <v-btn
              color="primary"
              :elevation="0"
              x-small
              @click.stop="handleReply(comment)"
              >回复</v-btn
            >
            <v-btn
              class="ml-2"
              color="error"
              :elevation="0"
              x-small
              @click.stop="handleDelete(comment)"
              :loading="deleteIng"
              v-if="user && comment.user._id == user._id"
              >删除</v-btn
            >
          </div>
          <div class="caption text--secondary">
            {{ comment.createdAt | format }}
          </div>
        </div>
      </NuxtLink>
      <div class="d-flex flex-column align-center">
        <v-btn
          text
          icon
          small
          :color="hasLike(comment.likes) ? 'error' : ''"
          @click="handleClickLike(comment)"
        >
          <v-icon :color="hasLike(comment.likes) ? 'error' : ''">{{
            $icons['mdi-cards-heart']
          }}</v-icon>
        </v-btn>
        <span
          class="body-2"
          :class="hasLike(comment.likes) ? 'error--text' : 'text--secondary'"
          >{{ comment.likes ? comment.likes.length : 0 }}</span
        >
      </div>
    </div>
    <div class="comment-centent">
      <div
        v-html="comment.htmlContent"
        class="markdown-body text--secondary"
      ></div>
    </div>

    <div class="comment-item-reply-box mt-3 pl-3" v-if="comment.replylist">
      <template v-for="_item in comment.replylist">
        <comment-item
          :comment="_item"
          :key="_item._id"
          :source="source"
          @reply="handleReply"
          :source-data="sourceData"
          @delete="handleDelete($event, comment)"
        />
      </template>
    </div>

    <div class="comment-item-reply-btn" v-if="comment.commentCounts">
      <v-btn
        text
        small
        @click="handleGetCommentReply(comment)"
        :loading="comment.isFetReplyIng"
        v-if="!comment.replylist"
        >展开{{ comment.commentCounts }}条回复</v-btn
      >
      <v-btn text small @click="handleGetCommentReply(comment)" v-else
        >收起</v-btn
      >
    </div>
  </div>
</template>
<script>
import CommentItem from './CommentItem';
import { mapState } from 'vuex';
import mixin from '@/utils/mixin';

export default {
  mixins: [mixin],
  name: 'CommentItem',
  components: { CommentItem },
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
    border-top-color: #111 !important;
    background-color: #1f1f1f !important;
  }
}
</style>
<style lang="scss" scoped>
.comment-item {
  border-top: 1px solid #f4f5f6;
  background-color: #fff;
  .comment-item-reply-btn {
    margin-top: 12px;
    display: flex;
    align-items: center;
    &::before {
      content: '';
      height: 1px;
      width: 42px;
      background-color: #888;
    }
  }
  .author-icon {
  }
}
</style>