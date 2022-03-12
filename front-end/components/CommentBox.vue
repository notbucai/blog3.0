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
    <v-card :elevation="0" style="overflow: hidden">
      <div class="pb-4 pt-2">
        <transition-group
          tag="div"
          appear
          :duration="200"
          enter-active-class="animate__animated animate__bounceIn"
          leave-active-class="animate__animated animate__bounceOut"
        >
          <comment-item
            :comment="item"
            :source="source"
            @reply="handleReply"
            @delete="handleDelete"
            v-for="item in comments"
            :key="item._id"
            :source-data="sourceData"
          />
        </transition-group>
      </div>
    </v-card>
  </div>
</template>
<script>
import CommentItem from './CommentItem';
import { mapState } from 'vuex';
import ComponentLoading from '@/components/common/Loading.vue';

export default {
  components: {
    CommentItem,
    CommentEditor: () => {
      return {
        component: import('./CommentEditor.vue'),
        loading: ComponentLoading,
        delay: 100,
        timeout: 3000
      }
    }
  },
  props: {
    comments: Array,
    source: {
      type: String,
      default: 'article'
    },
    cid: String,
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
      if(this.reply && comment) {
        if(this.reply._id === comment._id){
          this.reply = null;
        }
      }
    }
  }
};
</script>
<style lang="scss">
.CommentBox {
  .theme--dark{
    &.v-card{
      background-color: #000000;
    }
  }
}
</style>
<style lang="scss" scoped>
.CommentBox {
  padding: 30px 40px;
  @media (max-width: 600px) {
    padding: 0;
  }
}
</style>