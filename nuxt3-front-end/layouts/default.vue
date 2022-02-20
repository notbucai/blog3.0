<template>
  <v-app :theme="theme">
    <v-app-bar app dense flat :height="56" tile>
      <!-- -->
      <div class="toolbar-content v-container">
        <div class="toolbar-title">
          <v-btn elevation="0" text href="/" nuxt>不才</v-btn>
        </div>
        <div class="toolbar-nav">
          <v-btn to="/" elevation="0" tile text nuxt>首页</v-btn>
          <v-btn to="/message" elevation="0" tile text nuxt>留言</v-btn>
          <v-btn to="/links" elevation="0" tile text nuxt>友邻</v-btn>
          <v-btn to="/friends" elevation="0" tile text nuxt>圈子</v-btn>
          <v-btn to="/timelines" elevation="0" tile text nuxt>归档</v-btn>
        </div>
        <div class="toolbar-action">
          <v-btn elevation="0" nuxt to="/search/" text size="small">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
          <v-btn elevation="0" @click="handleChangeTheme" text size="small">
            <v-icon v-if="theme === 'dark'">mdi-white-balance-sunny</v-icon>
            <v-icon v-if="theme === 'light'">mdi-weather-night</v-icon>
          </v-btn>

          <v-btn elevation="0" text small v-if="user" @click="handleGoMessage">
            <v-badge
              color="error"
              :content="noticeStatus.unread"
              :value="noticeStatus && noticeStatus.unread"
              small
              overlap
            >
              <v-icon> mdi-bell </v-icon>
            </v-badge>
          </v-btn>
          <v-btn
            color="info"
            elevation="0"
            @click="loginOrRegisterDialog = !loginOrRegisterDialog"
            v-if="!user"
            >登录</v-btn
          >
          <div class="pl-2" v-else>
            <current-user />
          </div>
        </div>
        <div class="toolbar-apps">
          <v-icon @click="handleShowSide"> mdi-menu </v-icon>
        </div>
      </div>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using nuxt-router -->
        <slot />
      </v-container>
    </v-main>

    <v-lazy transition="scale-transition" min-height="100px">
      <v-footer app>
        <v-container>
          <div class="footer">
            <p>
              &copy; 2021
              <a href="/">不才</a> All Rights Reserved.
            </p>
            <a
              href="http://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              >赣ICP备15001741号-3</a
            >
          </div>
        </v-container>
      </v-footer>
    </v-lazy>
    <ClientOnly>
      <LoginOrRegister />
    </ClientOnly>
    <NavigationDrawer />
    <!-- <ScrollToTop /> -->
    <!-- <SvgWalle /> -->
  </v-app>
</template>

<script lang="ts" setup>
// import { useState } from '#app'
import { useLoginOrRegisterDialog, useSideStatus, useTheme } from '~~/composables/core';

const theme = useTheme()
const sideStatus = useSideStatus()

const user = useUser();
const noticeStatus = useNoticeStatus()
const loginOrRegisterDialog = useLoginOrRegisterDialog()

function handleChangeTheme () {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
function handleShowSide () {
  // this.$store.commit('SET_SIDE_STATUS', true);
  sideStatus.value = !sideStatus.value;
}
// async loadUserMessageCount () {
//   const user = this.user;
//   if (!user) return;
//   const resData = await this.$axios.get('/api/users/notify/count');
//   this.messageCount = resData;
// },
function handleGoMessage () {
  // this.$router.push('/user/notice')
}
async function handleLoadNoticeStatus () {
  // await this.$store.dispatch('loadNoticeStatus');

  // setTimeout(() => {
  //   this.handleLoadNoticeStatus();
  // }, 3000);
}

</script>

<style lang="scss">
.v-theme--light.v-application {
  background-color: #f4f4f4;
}
.v-theme--light.v-app-bar.v-toolbar.v-sheet {
  background-color: #fff;
}
.v-theme--dark.v-app-bar.v-toolbar.v-sheet {
  background-color: #151515;
}
.toolbar-content {
  /* max-width: 1440px;
  width: 100%; */
  height: 100%;
  margin: 0 auto;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 600px) {
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
    .v-btn.v-btn--size-default {
      font-size: 20px;
      font-weight: bold;
    }
  }
  .toolbar-nav {
    height: 100%;
    .v-btn.v-btn--size-default {
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
