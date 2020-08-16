<template>
  <div class="Index">
    <div class="height">
      <input type="text" class="a_title" placeholder="请输入标题..." v-model="formData.title" />
      <div class="action pr-2">
        <div class="mr-2">
          <v-menu offset-y :close-on-content-click="false" :nudge-bottom="10" left>
            <template v-slot:activator="{ on }">
              <v-btn text v-on="on">
                <v-icon size="20">mdi-image-size-select-actual</v-icon>
              </v-btn>
            </template>
            <v-card :width="260" :min-height="140" class="d-flex align-center justify-center pa-3">
              <v-btn
                text
                v-if="!formData.coverURL"
                x-large
                @click="handleUpload"
                :loading="fileUploading"
              >
                <v-icon x-large>mdi-cloud-upload-outline</v-icon>
                <input type="file" hidden ref="upload" accept="image/*" @change="onUpload" />
              </v-btn>
              <div v-else>
                <v-img :src="formData.coverURL" :width="240">
                  <div class="d-flex flex-end justify-end">
                    <v-btn :elevation="0" small dark @click="handleDelImage">
                      <v-icon small>mdi-trash-can</v-icon>
                    </v-btn>
                  </div>
                </v-img>
              </div>
            </v-card>
          </v-menu>
        </div>

        <div class="pr-3">
          <v-menu offset-y :close-on-content-click="false" :nudge-bottom="10">
            <template v-slot:activator="{ on }">
              <v-btn color="error" text :elevation="0" v-on="on">发布</v-btn>
            </template>
            <v-card width="240px">
              <v-card-text>标签</v-card-text>
              <div class="pa-2">
                <v-chip
                  class="ma-2"
                  small
                  label
                  :outlined="!item.selectd"
                  v-for="item in taglistSelect"
                  :key="item._id"
                  @click="handleSelectItem(item)"
                  color="primary"
                >
                  <v-icon x-small left>mdi-{{item.iconURL}}</v-icon>
                  {{item.name}}
                </v-chip>
              </div>
              <v-card-actions>
                <div class="pa-2">
                  <v-btn
                    color="error"
                    small
                    tile
                    outlined
                    @click="handlePublish"
                    :loading="loading"
                  >发布</v-btn>
                </div>
              </v-card-actions>
            </v-card>
          </v-menu>
        </div>
        <div>
          <current-user />
        </div>
      </div>
    </div>
    <div class="edit_box">
      <client-only>
        <mavon-editor
          v-model="formData.content"
          :boxShadow="false"
          editorBackground="inherit"
          previewBackground="inherit"
          :toolbarsFlag="false"
          :tabSize="2"
          ref="mdeditor"
          @imgAdd="handleEditAddImg"
          :codeStyle="$vuetify.theme.dark ? 'atom-one-light' : 'atom-one-light'"
        />
      </client-only>
    </div>
  </div>
</template>
<script>
import CurrentUser from '@/components/CurrentUser.vue';
export default {
  layout: 'empty',
  components: { CurrentUser },
  async asyncData ({ params, query, $axios }) {
    if (params.type == 'new') {
      return {};
    }
    const id = query.id;
    const data = await $axios.get(`/api/article/${id}/basis`);

    return {
      isUpdate: true,
      formData: {
        id: data._id,
        title: data.title,
        coverURL: data.coverURL,
        content: data.content,
        tags: data.tags
      },
    };
  },
  computed: {
    taglistSelect () {
      return this.taglist.map(item => {
        const isSelectd = (this.formData.tags || []).find(
          tag => item._id == tag
        );
        return {
          ...item,
          selectd: !!isSelectd
        };
      });
    }
  },
  data () {
    return {
      isUpdate: false,
      taglist: [],
      loading: false,
      fileUploading: false,
      formData: {
        title: '',
        coverURL: '',
        // htmlContent: '',
        content: '',
        tags: []
      }
    };
  },
  async mounted () {
    const resData = await this.$axios.get('/api/tag/list');
    this.taglist = resData;
    const formData = this.formData;
  },
  methods: {
    handleSelectItem (item) {
      const tag = this.taglist.find(tag => tag._id == item._id);
      const tagIndex = this.formData.tags.findIndex(tagId => tagId == tag._id);
      this.$set(tag, 'selectd', !item.selectd);
      if (tagIndex >= 0) {
        this.formData.tags.splice(tagIndex, 1);
      } else {
        this.formData.tags.push(tag._id);
      }
    },
    renderHtml (content = '') {
      const md = this.$refs['mdeditor'].markdownIt;
      const resRender = md.render(content);
      return resRender;
    },
    getSummary (content = '') {
      const resRender = this.renderHtml(content);
      const divEl = document.createElement('div');
      divEl.innerHTML = resRender;
      const p = divEl.querySelector('p');
      const text = p ? p.innerText : '';
      return text.substring(0, 180);
    },
    async handlePublish () {
      const formData = this.formData;
      formData.tags = this.taglistSelect.filter(item => item.selectd).map(item => item._id);
      // formData.summary = this.getSummary(formData.content);
      // formData.htmlContent = this.renderHtml(formData.content);
      // tags
      if (formData.title.length < 1 || formData.title.length > 100) {
        return this.$snackbar.error('标题不能为空,且不能超过100个字符');
      }
      if (formData.content.length < 50) {
        return this.$snackbar.error('内容不能少于50个字符');
      }
      this.loading = true;
      let resData;

      if (this.isUpdate) {
        console.log('formData', formData);

        resData = await this.$axios.put(
          `/api/article/${formData.id}`,
          formData
        );
      } else {
        resData = await this.$axios.post('/api/article', formData);
      }

      // formData
      // TODO: 跳转成功页面
      this.$router.push('/article/' + (resData._id || formData.id));
      this.loading = false;
      this.formData = {
        // htmlContent: '',
        coverURL: '',
        content: '',
        tags: [],
        title: ''
      };
    },
    handleUpload () {
      this.$refs['upload'].click();
    },
    async handleuploadImg (file) {
      const size = this.$file.fileSize(file);
      if (size > 3) {
        return this.$snackbar.error('文件大小不能超过3m');
      }
      this.fileUploading = true;
      const fd = new FormData();
      fd.append('file', file);
      try {
        const url = await this.$axios.post('/api/common/uploadImage', fd);
        // url
        this.formData.coverURL = 'https:' + url;
      } catch (error) {
        console.error(error);
      }
      this.fileUploading = false;
    },
    onUpload (e) {
      // console.log();
      const files = e.target.files;
      [...files].forEach(file => {
        this.handleuploadImg(file);
      });
    },
    handleDelImage () {
      this.formData.coverURL = '';
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
.Index {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  .height {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    box-sizing: border-box;
    color: #000;
    font-weight: bold;
    padding: 0 12px;
    background-color: #fff;
    .a_title {
      height: 100%;
      flex: 1;
      padding: 12px;
      font-size: 28px;
      outline: none;
    }
    .action {
      display: flex;
      align-items: center;
    }
  }
  .edit_box {
    flex: 1;
    overflow: hidden;
    .v-note-wrapper.markdown-body {
      height: 100%;
    }
  }
}
</style>