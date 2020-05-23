<template>
  <div class="comment_edit mb-5">
    <client-only>
      <mavon-editor
        v-model="content"
        :boxShadow="false"
        :subfield="false"
        editorBackground="inherit"
        toolbarsBackground="inherit"
        previewBackground="inherit"
        :tabSize="2"
        :ishljs="false"
        :toolbars="markdownOption"
        :placeholder="editPlaceholder"
        ref="mdeditor"
        :codeStyle="$vuetify.theme.dark ? 'atom-one-light' : 'atom-one-light'"
      >
        <template slot="right-toolbar-after">
          <v-btn
            text
            color="primary"
            class="close-reply-btn"
            @click.stop="handleUnReply"
            v-if="this.reply"
          >取消回复</v-btn>
        </template>
      </mavon-editor>
    </client-only>
    <div class="d-flex justify-end">
      <v-btn text color="#fa1" :disabled="!content" @click="handleComment" :loading="loading">评论</v-btn>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    reply: Object,
    loading: Boolean
  },
  computed: {
    editPlaceholder() {
      return this.reply && this.reply.user
        ? '回复@' + this.reply.user.username
        : '请输入...';
    }
  },
  data() {
    return {
      markdownOption: {
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        preview: true, // 预览
        trash: true, // 清空
        help: true // 帮助
      },
      content: ''
    };
  },
  mounted() {},
  methods: {
    handleClear(){
      this.content = '';
    },
    handleUnReply() {
      this.$emit('unReply');
    },
    handleComment() {
      this.$emit('comment', this.content);
    }
  }
};
</script>
<style lang="scss" scoped>
.comment_edit {
  .v-note-wrapper.markdown-body {
    width: 100%;
    min-height: 200px;
    max-height: 320px;
  }

  .close-reply-btn {
    position: absolute;
    right: 0;
    /* 
    z-index: 10;
    right: 40px;
    top: 30px; */
  }
}
</style>