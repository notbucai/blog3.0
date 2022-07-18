<template>
  <div class="CommentBox">
    <!-- 评论框 -->
    <div class="CommentEditor-container">
      <CommentEditor
        ref="CommentEditor"
        :reply="reply"
        :loading="submitIng"
        @comment="handleComment"
        @unReply="handleReply(null)"
        :source="source"
      />
    </div>
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
            :key="item.id"
            :source-data="sourceData"
          />
        </transition-group>
      </div>
    </v-card>
    <client-only>
      <BindPhone
        v-if="user && !user.phone"
        :visible.sync="bindPhoneModal"
        @success="handleBindPhoneSuccess"
      />
    </client-only>
  </div>
</template>
<script>
import CommentItem from './CommentItem';
import { mapState } from 'vuex';
import ComponentLoading from '@/components/common/Loading.vue';

export default {
  components: {
    CommentItem,
    BindPhone: () => import('@/components/user/BindPhone.vue'),
    CommentEditor: () => {
      return {
        component: import('../comment/CommentEditor.vue'),
        loading: ComponentLoading,
        delay: 100,
        timeout: 3000,
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
      submitIng: false,
      bindPhoneModal: false,
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
        sourceId: id,
        content
      };
      let rootId;
      if (reply) {
        formData['parentId'] = reply.id;
        rootId = formData['rootId'] = reply.parent
          ? reply.parent.id
          : reply.id;
      }
      console.log('this.user.phone', this.user.phone);
      if (!this.user.phone) {
        // 存储旧数据
        this.cacheContent = content;
        this.submitIng = false;
        return this.handleBindPhone();
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
          if (rootId) {
            const curr = this.comments.find(item => item.id == rootId);
            console.log('curr', reply, rootId, curr, this.comments);

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
      const index = this.comments.findIndex(item => comment.id == item.id);
      this.comments.splice(index, 1);
      if (this.reply && comment) {
        if (this.reply.id === comment.id) {
          this.reply = null;
        }
      }
    },
    handleBindPhone () {
      this.bindPhoneModal = true;
    },
    handleBindPhoneSuccess () {
      this.$nextTick(() => {
        this.handleComment(this.cacheContent);
      });
    }
  }
};
</script>
<style lang="scss">
.CommentBox {
  .theme--dark {
    &.v-card {
      background-color: #1e1e1e;
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
  .CommentEditor-container {
    min-height: 200px;
  }
}
</style>