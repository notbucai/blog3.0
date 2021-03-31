<template>
  <div class="CommentBox">
    <!-- 评论框 -->
    <CommentEditor
      ref="CommentEditor"
      :reply="reply"
      :loading="submitIng"
      @comment="handleComment"
      @unReply="handleReply(null)"
      :source="source"
    />
    <!-- 评论列表 -->
    <v-card tile :elevation="0" style="overflow: hidden">
      <div>
        <transition-group
          tag="div"
          appear
          :duration="1000"
          enter-active-class="animate__animated animate__zoomInDown"
          leave-active-class="animate__animated animate__bounceOutRight"
        >
          <comment-item
            :comment="item"
            :source="source"
            @reply="handleReply"
            @delete="handleDelete"
            v-for="item in comments"
            :key="item._id"
          />
        </transition-group>
      </div>
    </v-card>
  </div>
</template>
<script>
import CommentEditor from './CommentEditor';
import CommentItem from './CommentItem';
import { mapState } from 'vuex';

export default {
  components: { CommentItem, CommentEditor },
  props: {
    comments: Array,
    source: {
      type: String,
      default: 'article'
    },
    cid: String
  },
  computed: {
    ...mapState(['user'])
  },
  data () {
    return {
      reply: null,
      submitIng: false
    };
  },
  mounted () { },
  methods: {
    handleReply (item) {
      this.reply = item;
    },
    async handleComment (content) {
      this.submitIng = true;
      const source = this.source;
      const id = this.cid;
      const reply = this.reply;
      const formData = {
        sourceID: id,
        content
      };
      let rootID;
      if (reply) {
        formData['parentID'] = reply._id;
        rootID = formData['rootID'] = reply.parent
          ? reply.parent._id
          : reply._id;
      }
      try {
        const resData = await this.$axios.post(
          '/api/comment/' + source,
          formData
        );
        resData.user = this.user;
        if (reply) {
          resData.parent = reply.parent || reply;
          let replyObj = reply;
          if (rootID) {
            const curr = this.comments.find(item => item._id == rootID);
            console.log('curr', reply, rootID, curr, this.comments);

            replyObj = curr;
          }
          const replylist = replyObj.replylist || [];
          replylist.push(resData);
          this.$set(replyObj, 'replylist', replylist);
        } else {
          this.comments.unshift(resData);
        }
        this.$refs['CommentEditor'] && this.$refs['CommentEditor'].handleClear();
      } catch (error) {
        console.error('error', error);
      }
      this.submitIng = false;
    },
    handleDelete (comment) {
      const index = this.comments.findIndex(item => comment._id == item._id);
      this.comments.splice(index, 1);
    }
  }
};
</script>
<style lang="scss" scoped>
.CommentBox {
  padding: 30px 40px;
  @media (max-width: 600px) {
    padding: 0;
  }
}
</style>