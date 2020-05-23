<template>
  <v-app>
    <v-app-bar app dense flat :height="56" tile>
      <!-- -->
      <div class="toolbar-content container">
        <div class="toolbar-title">
          <v-btn elevation="0" text href="/" nuxt>不才</v-btn>
        </div>
        <div class="toolbar-nav">
          <v-btn to="/" elevation="0" tile text nuxt>首页</v-btn>
          <v-btn to="/message" elevation="0" tile text nuxt>留言</v-btn>
          <v-btn to="/links" elevation="0" tile text nuxt>友邻</v-btn>
        </div>
        <div class="toolbar-action">
          <v-btn elevation="0" @click="handleChangeTheme" text small>
            <v-icon v-if="$vuetify.theme.dark">mdi-white-balance-sunny</v-icon>
            <v-icon v-if="!$vuetify.theme.dark">mdi-weather-night</v-icon>
          </v-btn>
          <v-btn color="info" elevation="0" @click="SET_LOGIN_OR_REGISTER_DIALOG" v-if="!user">登录</v-btn>
          <div class="pl-2" v-else>
            <current-user />
          </div>
        </div>
      </div>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-content>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <nuxt />
      </v-container>
    </v-content>

    <v-footer app absolute>123</v-footer>

    <LoginOrRegister />
  </v-app>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import LoginOrRegister from '@/components/LoginOrRegister.vue';
import CurrentUser from '@/components/CurrentUser.vue';
export default {
  components: { LoginOrRegister, CurrentUser },
  data() {
    return {};
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    ...mapMutations(['SET_LOGIN_OR_REGISTER_DIALOG']),
    handleChangeTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    }
  }
};
</script>

<style lang="scss">
.theme--light.v-application {
  background-color: #f4f4f4;
}
.theme--light.v-app-bar.v-toolbar.v-sheet {
  background-color: #fff;
}
.theme--dark.v-app-bar.v-toolbar.v-sheet {
  background-color: #151515;
}

.toolbar-content {
  /* max-width: 1440px;
  width: 100%; */
  height: 100%;
  /* margin: 0 auto; */
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .toolbar-title {
    .v-btn.v-size--default {
      font-size: 20px;
      font-weight: bold;
    }
  }
  .toolbar-nav {
    height: 100%;
    .v-btn.v-size--default {
      min-width: 80px;
      margin: 0 6px;
      height: 100%;
      border: none;
    }
  }
  .toolbar-action {
    display: flex;
    align-items: center;
    .v-btn {
      margin-left: 12px;
    }
  }
}
#app .v-card {
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.05);
}
</style>
