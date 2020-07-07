<template>
  <v-navigation-drawer v-model="sideStatusComputed" app temporary id="navigation-drawer">
    <div class="nd_header">
      <div class="d-flex align-center justify-space-between pa-3">
        <v-btn elevation="0" @click="handleChangeTheme" text small>
          <v-icon v-if="$vuetify.theme.dark">mdi-white-balance-sunny</v-icon>
          <v-icon v-if="!$vuetify.theme.dark">mdi-weather-night</v-icon>
        </v-btn>
        <v-btn elevation="0" text small v-if="user" @click="handleGoMessage">
          <v-badge
            color="error"
            :content="noticeStatus.unread"
            :value="noticeStatus&&noticeStatus.unread"
            small
            overlap
          >
            <v-icon>mdi-bell</v-icon>
          </v-badge>
        </v-btn>
      </div>
      <div class="d-flex flex-column align-center justify-center pa-6">
        <v-avatar size="82">
          <v-img :src="user&&user.avatarURL || 'https://image.notbucai.com/logo.png'"></v-img>
        </v-avatar>
        <p class="subtitle-1 pt-5 username">{{user&&user.username || '不才'}}</p>
      </div>
    </div>

    <div class="nd_main">
      <v-list dense rounded class="nav-list">
        <v-list-item
          v-for="item in userNavs"
          :key="item.key"
          class="nav-item pl-10"
          :to="item.path"
          link
        >
          <v-list-item-icon>
            <v-icon>mdi-{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn block color="primary" @click="handleLogin" v-if="!user">Login</v-btn>
        <v-btn block color="primary" :to="`/user/${user._id}`" v-else>我的账号</v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
  computed: {
    ...mapState(['sideStatus', 'user', 'noticeStatus']),
    sideStatusComputed: {
      get () {
        return this.sideStatus;
      },
      set (val) {
        this.$store.commit('SET_SIDE_STATUS', val);
      }
    }
  },
  data () {
    this.userNavs = [
      {
        icon: 'apps',
        title: '首页',
        key: 'home',
        path: '/',
      },
      {
        icon: 'message-text',
        title: '留言',
        key: 'message',
        path: '/message',
      },
      // {
      //   icon: 'cog',
      //   title: '设置',
      //   key: 'setup'
      // },
      {
        icon: 'link',
        title: '友邻',
        key: 'link-variant',
        path: '/links',
      }
    ];
    return {
      drawer: true,
    }
  },
  methods: {
    handleGoMessage () {
      this.$router.push('/user/notice')
    },
    handleLogin () {
      this.$store.commit('SET_LOGIN_OR_REGISTER_DIALOG');
      this.$store.commit('SET_SIDE_STATUS', false);
    },
    handleChangeTheme () {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    }
  },
}
</script>

<style lang="scss">
#navigation-drawer {
  .nav-list {
    border-radius: 20px 20px 0 0;
    padding-top: 30px;
    margin-top: -10px;
  }
  .nav-item {
    .v-list-item__title {
      font-size: 14px;
    }
  }
}
.theme--dark {
  #navigation-drawer {
    background: #0b0b0b;
    .nd_header {
      background-color: #121314;
    }
    .nd_main {
      background-color: #121314;
    }
    .nav-list {
      background-color: #0b0b0b;
    }
  }
}
.theme--light {
  #navigation-drawer {
    background: #242663;
    .nd_header {
      background-color: #1a1d53;
    }
    .nd_main {
      background-color: #1a1d53;
    }
    .nav-list {
      background-color: #242663;
    }
    color: #b9b8cc;

    .v-btn,
    .v-icon {
      color: #b9b8cc;
    }
    .username {
      color: #fff;
      font-weight: bold;
    }
    .nav-item {
      color: #fff !important;
      /* font-size: 20px; */

      .notranslate.v-icon {
        /* font-size: 24px; */
      }
    }
  }
}
</style>