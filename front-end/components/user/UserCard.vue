<template>
  <div class="user-card">
    <v-menu
      rounded
      v-model="menuShow"
      :close-on-content-click="false"
      :offset-y="true"
      max-width="280"
      min-width="260"
      elevation="0"
      open-on-hover
    >
      <template v-slot:activator="{ on, attrs }">
        <div v-on="on" v-bind="attrs">
          <slot />
        </div>
      </template>

      <v-card elevation="0" :loading="loading">
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <v-img
                :src="
                  (data
                    ? data.avatarURL
                    : 'https://image.notbucai.com/logo.png') | imageMogr2(68)
                "
                :lazy-src="
                  (data
                    ? data.avatarURL
                    : 'https://image.notbucai.com/logo.png') | imageMogr2(10)
                "
              />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{
                data ? data.username : '-'
              }}</v-list-item-title>
              <v-list-item-subtitle
                >{{ data ? data.job || '' : '' }}
                {{ data ? '@' + data.company || '' : '' }}</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <div class="d-flex align-center pl-2 pr-2 pb-4">
          <div class="d-flex flex-column align-center flex-grow-1">
            <span class="text-center subtitle-1 mb-1 font-weight-bold">
              {{ (data && data.likeCount) || '0' }}
            </span>
            <span class="text-center body-2 grey--text text--darken-2"
              >点赞</span
            >
          </div>
          <div class="d-flex flex-column align-center flex-grow-1">
            <span class="text-center subtitle-1 mb-1 font-weight-bold">{{
              (data && data.browseCount) || '0'
            }}</span>
            <span class="text-center body-2 grey--text text--darken-2"
              >阅读</span
            >
          </div>
        </div>
      </v-card>
    </v-menu>
  </div>
</template>
<script>
export default {
  props: {
    userId: String
  },
  data () {
    return {
      menuShow: false,
      data: null,
      loading: false,
    };
  },
  watch: {
    menuShow (v) {
      if (v && !this.data) {
        // 获取数据
        this.initGetData();
      }
    }
  },
  methods: {
    async initGetData () {
      if (this.loading) return;
      this.loading = true;
      const data = await this.$axios.get(`/bff/user/${this.userId}/card`)
      this.data = data;
      this.loading = false;
    }
  }
}
</script>
<style lang="scss" scoped>
.user-card {
}
</style>