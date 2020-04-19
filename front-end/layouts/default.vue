<template>
  <v-app>
    <v-app-bar app dense flat :height="56" tile>
      <!-- -->
      <div class="toolbar-content">
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
          <v-btn color="info" elevation="0">登陆</v-btn>
        </div>
      </div>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-content>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <nuxt/>
      </v-container>
    </v-content>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
export default {
  methods: {
    handleChangeTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    }
  }
};
</script>

<style lang="scss">
.theme--light.v-application {
  background-color: #f9f9f9;
}
.theme--light.v-app-bar.v-toolbar.v-sheet {
  background-color: #fff;
}
.theme--dark.v-app-bar.v-toolbar.v-sheet {
  background-color: #121212;
}

.toolbar-content {
  max-width: 1440px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
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
  .toolbar-action{
    .v-btn{
      margin-left: 12px;
    }
  }
}
</style>
