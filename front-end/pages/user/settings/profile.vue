<template>
  <div class="profile mt-4">
    <v-card class="pl-10 pr-10 _profile-card">
      <v-card-title>个人资料</v-card-title>
      <div class="content body-2">
        <v-divider></v-divider>
        <v-row align="center" class="pl-4 pt-2 pb-2">
          <v-col :cols="2">头像</v-col>
          <v-col>
            <div class="d-flex align-center flex-grow-1 _profile_avatar">
              <v-avatar :size="48" color="blue">
                <img :src="user.avatarURL" alt="alt" />
              </v-avatar>
              <div class="d-flex justify-space-between flex-grow-1 align-center pl-4 pr-2">
                <p class="caption text--secondary mb-0">
                  支持 jpg、png、gif 格式大小 5M 以内的图片
                </p>
                <v-btn
                  color="primary"
                  :elevation="0"
                  small
                  @click="handleOpenFile"
                  >点击上传</v-btn
                >
              </div>
            </div>
          </v-col>
        </v-row>
        <template v-for="(item, index) in formShowJson">
          <v-divider :key="index"></v-divider>
          <v-row align="center" class="pa-4" :key="item.key">
            <v-col :cols="2">{{ item.label }}</v-col>
            <v-col>
              <input
                type="text"
                :value="user[item.key]"
                :ref="item.key"
                :disabled="!selectObj[item.key]"
                @keyup.enter="handleSaveItem(item.key)"
                :placeholder="item.placeholder"
              />
            </v-col>
            <v-col :cols="!selectObj[item.key] ? 1 : 2">
              <v-icon
                @click="handleAllowEdit(item.key)"
                small
                color="primary"
                v-if="!selectObj[item.key]"
                >{{$icons['mdi-pencil']}}</v-icon
              >
              <div v-else class="d-flex align-center">
                <v-btn
                  color="primary"
                  x-small
                  text
                  @click="handleSaveItem(item.key)"
                  >保存</v-btn
                >
                <v-btn text x-small @click="handleSaveClose(item.key)"
                  >取消</v-btn
                >
              </div>
            </v-col>
          </v-row>
        </template>
      </div>
    </v-card>
    <input
      type="file"
      accept="image/*"
      ref="fileRef"
      hidden
      @change="handleUploadFileChange"
    />
    <client-only>
      <v-dialog v-model="cropperDialog" width="500px">
        <v-card>
          <v-card-title primary-title>
            <div
              class="d-flex align-center justify-space-between"
              style="width: 100%"
            >
              <span class="body-1">编辑图片</span>
              <v-icon @click="cropperDialog = false">{{$icons['mdi-close']}}</v-icon>
            </div>
          </v-card-title>
          <div style="height: 400px; width: 500px">
            <vueCropper
              ref="cropper"
              v-if="cropperDialog"
              :autoCrop="cropperOption.autoCrop"
              :img="cropperOption.img"
              :fixed="cropperOption.fixed"
              :centerBox="cropperOption.centerBox"
              :outputType="cropperOption.outputType"
            ></vueCropper>
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :elevation="0" @click="cropperDialog = false">取消</v-btn>
            <v-btn :elevation="0" color="primary" @click="handleCropper"
              >确定</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </client-only>

    <v-overlay :value="overlay" :z-index="9999">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { asyncLoad } from '~/utils/loadScriptComponent';
export default {
  middleware: 'auth',
  components: {
    'vueCropper': asyncLoad.vueCropperComponent
  },
  props: {},
  computed: {
    ...mapState(['user'])
  },
  data () {
    return {
      overlay: false,
      cropperDialog: false,
      cropperOption: {
        img: "",
        autoCrop: true,
        fixed: true,
        centerBox: true,
        outputType: "png"
      },
      selectObj: {
      },
      formShowJson: [
        {
          key: "username",
          label: "用户名",
          placeholder: "请输入用户名",
          require: true,
        },
        {
          key: "job",
          label: "职位",
          placeholder: "请输入职位",
        },
        {
          key: "company",
          label: "公司",
          placeholder: "请输入公司",
        },
        {
          key: "introduce",
          label: "个人介绍",
          placeholder: "请输入个人介绍",
        },
        {
          key: "personalHomePage",
          label: "个人主页",
          placeholder: "请输入个人主页",
          rules: [
            {
              message: "必须是URL",
              regx: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/
            }
          ]
        },
      ]
    };
  },
  mounted () {
  },
  methods: {
    handleUploadFileChange (e) {
      const file = e.srcElement.files[0];
      if (!file) return;
      e.srcElement.value = null;
      this.handleUploadFile(file);
    },
    handleUploadFile (file) {
      const { size } = file;
      if (size / 1024 / 1024 > 5) {
        // TODO 报错
        this.$snackbar.info('图片大小不能大于5m');
        return;
      }
      console.log('file', file);

      this.cropperDialog = true;
      this.cropperOption.img = URL.createObjectURL(file);
      // 打开图片编辑框
    },
    handleOpenFile () {
      this.$refs['fileRef'].click();
    },
    handleAllowEdit (keyName) {
      this.selectObj = {
        [keyName]: true,
      }
      this.$nextTick(() => {
        this.$refs[keyName] && this.$refs[keyName][0] && this.$refs[keyName][0].focus();
      })
    },
    async handleSaveItem (keyName) {
      const value = this.$refs[keyName][0].value;
      const itemJson = this.formShowJson.find(item => item.key == keyName);
      const rules = itemJson.rules || [];
      const require = itemJson.require || false;
      if (value) {
        try {
          rules.forEach(item => {
            if (!item.regx.test(value)) {
              throw new Error(item.message);
            }
          });
        } catch (error) {
          return this.$snackbar.info(error.message)
        }
      } else {
        if (require) {
          return this.$snackbar.info('不能为空')
        }
      }
      await this.handleUpdateUserInfo(keyName, value);
      // 改变当前编辑框状态
      this.selectObj = {}
    },
    async handleUpdateUserInfo (key, value) {
      // 发送ajax
      await this.$axios.put('/api/users/info', {
        [key]: value
      });
      // 获取用户信息
      await this.$store.dispatch('updateUserInfo', {
        key: key,
        value
      });
    },
    handleSaveClose (keyName) {
      // 改变当前编辑框状态
      this.selectObj = {}
    },
    handleCropper () {
      this.overlay = true;
      this.$refs['cropper'].getCropBlob(async data => {
        console.log(data)
        data.name = data.originalname = data.filename = (Date.now()) + '.' + this.cropperOption.outputType;
        const file = new File([data], data.name, { type: data.type })
        try {
          const fd = new FormData();
          fd.append('file', file);
          const fileurl = await this.$axios.post('/api/common/uploadImage', fd);
          // 发送更新信息
          await this.handleUpdateUserInfo('avatarURL', 'https:' + fileurl);
          this.cropperDialog = false;
        } catch (error) {
          console.log('error', error);
        }
        this.overlay = false;
      });
    }
  }
}
</script>
<style lang="scss">
.vue-cropper {
  background-repeat: repeat;
}
</style>
<style lang="scss" scoped>
.profile {
  @media (max-width: 600px) {
    .content {
      .col {
        padding: 0;
      }
      ._profile_avatar {
        /* width: 64px !important; */
        ::v-deep .v-avatar {
          /* width: 54px!important; */
        }
      }
    }
    ._profile-card {
      /* padding: 12px!important; */
      .body-2 {
        font-size: 12px !important;
      }
    }
  }
  input {
    width: 100%;
    padding: 8px 18px;
    border: none;
    &:hover,
    &:focus {
      border: none;
      outline: none;
    }
  }
}
</style>