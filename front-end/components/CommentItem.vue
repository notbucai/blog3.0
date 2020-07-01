<template>
  <div class="comment-item pa-3" v-ripple>
    <div class="comment-user d-flex align-center justify-space-between">
      <nuxt-link
        v-ripple
        tag="div"
        :to="`/user/${comment.user._id}`"
        class="d-flex align-center"
        v-if="comment.user"
      >
        <div class="mr-2" v-if="comment.user.avatarURL">
          <v-avatar size="36">
            <v-img :src="comment.user.avatarURL+'?imageMogr2/thumbnail/100x100'"></v-img>
          </v-avatar>
        </div>
        <div v-if="type !== 'user'">
          <div class="body-2 d-flex align-center">
            <span class="pr-2">{{comment.user.username}}</span>
            <v-btn color="primary" :elevation="0" x-small @click.stop="handleReply(comment)">回复</v-btn>
            <v-btn
              class="ml-2"
              color="error"
              :elevation="0"
              x-small
              @click.stop="handleDelete(comment)"
              :loading="deleteIng"
              v-if="user && comment.user._id == user._id"
            >删除</v-btn>
          </div>
          <div class="caption text--secondary">{{comment.createdAt | format}}</div>
        </div>
      </nuxt-link>
      <div class="d-flex flex-column align-center">
        <v-btn
          text
          icon
          small
          :color="hasLike(comment.likes)?'error':''"
          @click="handleClickLike(comment)"
        >
          <v-icon :color="hasLike(comment.likes)?'error':''">mdi-cards-heart</v-icon>
        </v-btn>
        <span
          class="body-2"
          :class="hasLike(comment.likes)?'error--text':'text--secondary'"
        >{{comment.likes ? comment.likes.length : 0}}</span>
      </div>
    </div>
    <div class="comment-centent">
      <div v-html="$utils.markdown(comment.content)" class="markdown-body text--secondary"></div>
    </div>

    <div class="comment-item-reply-box mt-3 pl-3" v-if="comment.replylist">
      <template v-for="(_item) in comment.replylist">
        <comment-item
          :comment="_item"
          :key="_item._id"
          :source="source"
          @reply="handleReply"
          @delete="handleDelete($event,comment)"
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
      >展开{{comment.commentCounts}}条回复</v-btn>
      <v-btn text small @click="handleGetCommentReply(comment)" v-else>收起</v-btn>
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
          content: ''
        };
      }
    },
    source: {
      type: String,
      default: 'article'
    }
  },
  computed: {
    ...mapState(['user'])
  },
  data () {
    return {
      deleteIng: false
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
      const id = this.comment._id;
      await this.$axios.put('/api/comment/' + this.source + '/' + id + '/like');
      const likes = this.changeLike(comment.likes);
      this.$set(comment, 'likes', likes);
    }
  }
};
</script>
<style lang="scss" scoped>
.comment-item {
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
}
</style>