<template>
  <v-app>
    <v-app-bar app dense flat :height="56" tile hide-on-scroll :scroll-threshold="56">
      <!-- -->
      <div class="toolbar-content container">
        <div class="toolbar-title">
          <v-btn elevation="0" text href="/" nuxt>不才</v-btn>
        </div>
        <div class="toolbar-nav">
          <v-btn to="/" elevation="0" tile text nuxt>首页</v-btn>
          <v-btn to="/message" elevation="0" tile text nuxt>留言</v-btn>
          <v-btn to="/links" elevation="0" tile text nuxt>友邻</v-btn>
          <v-btn to="/friends" elevation="0" tile text nuxt>圈子</v-btn>
          <!-- <v-btn to="/timelines" elevation="0" tile text nuxt>归档</v-btn> -->
        </div>
        <div class="toolbar-action">
          <v-btn elevation="0" small nuxt to="/search/" text>
            <v-icon>{{ $icons['mdi-magnify'] }}</v-icon>
          </v-btn>
          <v-btn elevation="0" @click="handleChangeTheme" text small>
            <v-icon v-if="$vuetify.theme.dark">{{
              $icons['mdi-white-balance-sunny']
            }}</v-icon>
            <v-icon v-if="!$vuetify.theme.dark">{{
              $icons['mdi-weather-night']
            }}</v-icon>
          </v-btn>

          <v-btn elevation="0" text small v-if="user" @click="handleGoMessage">
            <v-badge
              color="error"
              :content="noticeStatus.unread"
              :value="noticeStatus && noticeStatus.unread"
              small
              overlap
            >
              <v-icon>{{ $icons['mdi-bell'] }}</v-icon>
            </v-badge>
          </v-btn>
          <v-btn
            color="info"
            elevation="0"
            @click="SET_LOGIN_OR_REGISTER_DIALOG"
            v-if="!user"
            >登录</v-btn
          >
          <div class="pl-2" v-else>
            <current-user />
          </div>
        </div>
        <div class="toolbar-apps">
          <v-icon @click="handleShowSide">{{ $icons['mdi-menu'] }}</v-icon>
        </div>
      </div>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <nuxt />
      </v-container>
    </v-main>

    <v-lazy :value="$isServer" transition="scale-transition" min-height="100px">
      <v-footer app absolute>
        <v-container>
          <div class="footer">
            <p>
              &copy; 2021
              <a href="/">不才</a> All Rights Reserved.
            </p>
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 14px;
              "
            >
              <a
                href="http://beian.miit.gov.cn/"
                target="_blank"
                style="font-size: 12px; color: #888;"
                rel="noopener noreferrer"
                >赣ICP备15001741号</a
              >
              <a
                href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44030602006687"
                target="_blank"
                style="font-size: 12px; color: #888;"
                rel="noopener noreferrer"
              >
                <img
                  src="https://image.notbucai.com/static/ghs.png"
                  loading="lazy"
                  width="12px"
                />
                粤公网安备 44030602006687号</a
              >
            </div>
          </div>
        </v-container>
      </v-footer>
    </v-lazy>
    <LoginOrRegister v-if="LoginOrRegisterDialog" />
    <NavigationDrawer v-if="sideStatus" />
    <Keyboard v-if="keyboardShow" />
    <ScrollToTop />
    <SvgWalle />
  </v-app>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex';
import CurrentUser from '@/components/CurrentUser.vue';
// import NavigationDrawer from '@/components/NavigationDrawer.vue';
import ScrollToTop from '@/components/ScrollToTop.vue';
import ComponetLoading from '@/components/common/Loading.vue';

export default {
  components: {
    LoginOrRegister: () => {
      return {
        component: import('@/components/LoginOrRegister.vue'),
        loading: ComponetLoading,
        delay: 100,
        timeout: 3000
      };
    },
    ComponetLoading,
    CurrentUser,
    NavigationDrawer: () => import('@/components/NavigationDrawer.vue'),
    ScrollToTop,
    SvgWalle: () => import('@/components/svg/Walle.vue'),
    Keyboard: () => {
      return {
        component: import('@/components/keyboard/Index.vue'),
        loading: ComponetLoading,
        delay: 100,
        timeout: 3000
      };
    },
  },
  data () {
    return {

    };
  },
  computed: {
    ...mapState(['user', 'noticeStatus', 'LoginOrRegisterDialog', 'sideStatus', 'keyboardShow'])
  },
  watch: {
    user () {
      // this.loadUserMessageCount();
    },
  },
  // created() {

  // },
  created () {
    const h = new Date().getHours();
    const theme = this.$cookies.get('theme');
    let isDark = (h >= 19 && h <= 24) || (h >= 0 && h <= 7);
    if (theme) {
      isDark = theme === 'dark';
    }
    this.$vuetify.theme.dark = isDark;
    this.handleLoadNoticeStatus();
  },
  methods: {
    ...mapMutations(['SET_LOGIN_OR_REGISTER_DIALOG']),
    handleChangeTheme () {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      this.$cookies.set('theme', this.$vuetify.theme.dark ? 'dark' : 'white');
    },
    handleShowSide () {
      this.$store.commit('SET_SIDE_STATUS', true);
    },
    // async loadUserMessageCount () {
    //   const user = this.user;
    //   if (!user) return;
    //   const resData = await this.$axios.get('/api/users/notify/count');
    //   this.messageCount = resData;
    // },
    handleGoMessage () {
      this.$router.push('/user/notice')
    },
    async handleLoadNoticeStatus () {
      await this.$store.dispatch('loadNoticeStatus');
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

  @media (max-width: 824px) {
    .toolbar-action,
    .toolbar-nav {
      display: none !important;
    }
    .toolbar-apps {
      display: block !important;
    }
  }
  .toolbar-apps {
    display: none;
  }
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
      margin-right: 12px;
    }
  }
}
.footer {
  text-align: center;
  font-size: 14px;
  /* color: #333; */
  line-height: 2;
  a {
    /* color: #333; */
    text-decoration: none;
    font-weight: bold;
    font-size: 14px;
  }
}
#app .v-card {
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.05);
}
</style>
