<template>
  <div class="comment_edit mb-5">
    <client-only>
      <!-- 这里计算一下 高度 -->
      <mavon-editor
        v-if="showEdit"
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
        @imgAdd="handleEditAddImg"
        :autofocus="false"
        :codeStyle="$vuetify.theme.dark ? 'atom-one-light' : 'atom-one-light'"
      >
        <template slot="right-toolbar-after">
          <v-btn
            text
            color="primary"
            class="close-reply-btn"
            @click.stop="handleUnReply"
            v-if="this.reply"
            >取消回复</v-btn
          >
        </template>
      </mavon-editor>
    </client-only>
    <div class="d-flex justify-end">
      <v-btn
        text
        color="#fa1"
        :disabled="!content"
        @click="handleComment"
        :loading="loading"
        >{{ token ? '评论' : '请登录' }}</v-btn
      >
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  components: {
    'mavon-editor': async () => (await import('mavon-editor')).mavonEditor
  },
  props: {
    reply: Object,
    loading: Boolean
  },
  computed: {
    ...mapState(['token']),
    editPlaceholder () {
      return this.reply && this.reply.user
        ? '回复@' + this.reply.user.username
        : '请输入...';
    }
  },
  data () {
    return {
      showEdit: false,
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
  mounted () {
    const io = new IntersectionObserver((entries) => {
      const [change] = entries;
      if (change && change.intersectionRatio > 0 && change.intersectionRatio) {
        this.showEdit = true;
        // 异步加载css
        import('mavon-editor/dist/css/index.css');
        // io.unobserve();
        io.disconnect();
      }
    });
    io.observe(document.querySelector('.comment_edit'));
  },
  methods: {
    handleClear () {
      this.content = '';
    },
    handleUnReply () {
      this.$emit('unReply');
    },
    handleComment () {
      if (!this.token) {
        this.$store.commit('SET_LOGIN_OR_REGISTER_DIALOG')
        return;
      }
      this.$emit('comment', this.content);
    },
    async handleEditAddImg (pos, $file) {
      const formdata = new FormData();
      formdata.append('file', $file);
      const fileurl = await this.$axios.post('/api/common/uploadImage', formdata);
      this.$refs['mdeditor'].$img2Url(pos, fileurl);
    }
  }
};
</script>
<style lang="scss">
.comment_edit {
  .v-note-wrapper .v-note-op .v-left-item,
  .v-note-wrapper .v-note-op .v-right-item {
    flex: none;
  }
  .op-icon-divider {
    display: none;
  }
}
</style>
<style lang="scss" scoped>
.comment_edit {
  .v-note-wrapper.markdown-body {
    width: 100%;
    min-height: 200px;
    max-height: 320px;
    z-index: 1;
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