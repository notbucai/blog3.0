<template>
  <div class="comment_edit mb-5">
    <div class="comment_edit-editor">
      <Loading :absolute="true" :hidden="!uploading" />
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
          fontSize="16px"
          :ishljs="false"
          :toolbars="markdownOption"
          :placeholder="editPlaceholder"
          ref="mdeditor"
          @imgAdd="handleEditAddImg"
          :autofocus="false"
          :codeStyle="$vuetify.theme.dark ? 'atom-one-light' : 'atom-one-light'"
        >
          <template slot="left-toolbar-before">
            <div class="edit-icon-list">
              <div class="edit-icon-item" @click="handleOperateClick('bold')">
                <i class="edit_icon icon-bold"></i>
              </div>
              <div class="edit-icon-item" @click="handleOperateClick('italic')">
                <i class="edit_icon icon-italic"></i>
              </div>
              <div
                class="edit-icon-item"
                @click="handleOperateClick('underline')"
              >
                <i class="edit_icon icon-underline"></i>
              </div>
              <div
                class="edit-icon-item"
                @click="handleOperateClick('strikethrough')"
              >
                <i class="edit_icon icon-strikethrough"></i>
              </div>
              <!-- 间隔 -->
              <div class="gap"></div>
              <div
                class="edit-icon-item xxs-hide"
                @click="handleOperateClick('header3')"
              >
                <i class="edit_icon icon-heading-h1"></i>
              </div>
              <div
                class="edit-icon-item xs-hide xxs-hide"
                @click="handleOperateClick('header4')"
              >
                <i class="edit_icon icon-heading-h2"></i>
              </div>
              <div
                class="edit-icon-item xs-hide xxs-hide"
                @click="handleOperateClick('header5')"
              >
                <i class="edit_icon icon-heading-h3"></i>
              </div>
              <div class="gap"></div>
              <div class="edit-icon-item" @click="handleOperateClick('code')">
                <i class="edit_icon icon-code-inline"></i>
              </div>
              <div
                class="edit-icon-item xs-hide"
                @click="handleOperateClick('link')"
              >
                <i class="edit_icon icon-link"></i>
              </div>
              <div
                class="edit-icon-item xs-hide"
                @click="handleOperateClick('imagelink')"
              >
                <i class="edit_icon icon-image"></i>
              </div>
            </div>
          </template>
          <template slot="right-toolbar-before">
            <div class="edit-icon-list">
              <div
                class="edit-icon-item xs-hide"
                @click="handleOperateClick('help')"
              >
                <i class="edit_icon icon-cat_help"></i>
              </div>
              <div
                class="edit-icon-item"
                :class="{ active: operate['preview'] }"
                @click="handleOperateClick('preview')"
              >
                <i class="edit_icon icon-show"></i>
              </div>
              <div
                class="edit-icon-item xxs-hide"
                @click="handleOperateClick('redo')"
              >
                <i class="edit_icon icon-redo"></i>
              </div>
              <div
                class="edit-icon-item xxs-hide"
                @click="handleOperateClick('undo')"
              >
                <i class="edit_icon icon-undo"></i>
              </div>
            </div>
          </template>
        </mavon-editor>
      </client-only>
    </div>
    <div class="d-flex justify-space-between mt-2 align-center">
      <div class="d-flex align-center">
        <p class="body-2 mb-0" v-if="$route.path === '/message'">
          欢迎留言，互换友链请移步
          <nuxt-link to="/links">友邻</nuxt-link> 页面申请
        </p>
      </div>
      <div>
        <v-btn
          text
          color="primary"
          class="close-reply-btn"
          @click.stop="handleUnReply"
          v-if="this.reply"
          small
          >取消回复</v-btn
        >
        <v-btn
          text
          color="#fa1"
          :disabled="!content"
          @click="handleComment"
          :loading="loading || uploading"
          >{{ token ? '评论' : '请登录' }}</v-btn
        >
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { asyncLoad } from '@/utils/loadScriptComponent';
import Loading from '@/components/common/Loading.vue';

export default {
  components: {
    'mavon-editor': asyncLoad.mavonEditorComponent,
    Loading,
  },
  props: {
    reply: Object,
    loading: Boolean,
  },
  computed: {
    ...mapState(['token']),
    editPlaceholder () {
      return this.reply && this.reply.user
        ? '回复@' + this.reply.user.username
        : '请发表核善的评论';
    }
  },
  data () {
    return {
      showEdit: false,
      markdownOption: {
      },
      content: '',
      uploading: false,
      operate: {}
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
    this.$store.commit('SET_KEYBOARD_SHOW', true);
  },
  beforeDestroy() {
    this.$store.commit('SET_KEYBOARD_SHOW', false);
  },
  methods: {
    handleOperateClick (operate) {
      this.$refs['mdeditor'].toolbar_left_click(operate);
      this.$refs['mdeditor'].toolbar_right_click(operate);
      this.$set(this.operate, operate, !this.operate[operate])
    },
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
      this.uploading = true;
      const formdata = new FormData();
      formdata.append('file', $file);
      const fileurl = await this.$axios.post('/api/common/uploadImage', formdata);
      this.$refs['mdeditor'].$img2Url(pos, fileurl);
      this.uploading = false;
    }
  }
};
</script>
<style lang="scss">
.comment_edit {
  .v-note-op {
    border: none !important;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      display: block;
      width: calc(100% - 24px);
      height: 1px;
      background-color: #f4f5f6;
    }
  }
  .v-note-wrapper {
    border: none !important;
    .auto-textarea-wrapper {
      & textarea::placeholder {
        color: #b2b9c9;
      }
    }
  }
}
.theme--dark {
  .comment_edit {
    .v-note-wrapper {
      background-color: #1e1e1e;
      .auto-textarea-wrapper {
        & textarea::placeholder {
          color: #333333;
        }
      }
    }
    .v-note-op {
      &::after {
        background-color: #121212;
      }
    }
    .edit-icon-list {
      .edit-icon-item {
        &:hover,
        &.active {
          background-color: #121212 !important;
        }
        i.edit_icon {
          color: #ccc;
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
@import url(//at.alicdn.com/t/font_3238881_rw3b9pyc28o.css);

.comment_edit {
  .comment_edit-editor {
    min-height: 200px;
    position: relative;
    &::after {
      content: '组件加载中...';
      position: absolute;
      z-index: 0;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      border-radius: 4px;
      background-color: rgba($color: #888888, $alpha: 0.1);
    }
  }
  .v-note-wrapper.markdown-body {
    width: 100%;
    min-height: 200px;
    max-height: 200px;
    z-index: 1;
  }
  .v-right-item {
    display: flex;
    align-items: center;
    .edit-icon-list {
      flex-direction: row-reverse;
    }
  }
  .edit-icon-list {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 100%;
    padding: 0 6px;
    .edit-icon-item {
      display: flex;
      width: 28px;
      height: 28px;
      align-items: center;
      justify-content: center;
      border-radius: 2px;
      cursor: pointer;
      transition: all 0.2s;
      &:hover,
      &.active {
        background-color: #f4f5f6;
      }
      .edit_icon {
        color: #333;
        font-size: 20px;
      }
      @media (max-width: 750px) {
        &.xs-hide {
          display: none;
        }
      }
      @media (max-width: 480px) {
        &.xxs-hide {
          display: none;
        }
      }
    }
    .gap {
      width: 10px;
    }
  }

  .close-reply-btn {
    // position: absolute;
    // right: 0;
    /* 
    z-index: 10;
    right: 40px;
    top: 30px; */
  }
}
</style>