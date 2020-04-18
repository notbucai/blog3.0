<template>
  <div id="app">
    <el-container id="layout" v-if="!$route.meta.noLayout">
      <el-header class="layout_header">
        <div class="header_aside">Admin</div>
        <div class="header_main">
          <div class="header_main-left"></div>
          <div class="header_main-right">
            <div class="current_user-info">
              <img
                src="http://bucai-1252379971.cos.ap-guangzhou.myqcloud.com/upload/upload_552efd0bb95889c37c89b35aa9407646.jpeg"
                class="current_user-avatar"
              />
              <div class="current_user-username _text-style">bucai</div>
            </div>
            <div class="current_user-exit _text-style" @click="handleQuit">退了</div>
          </div>
        </div>
      </el-header>
      <el-container class="layout_content">
        <el-aside width="200px" class="layout_aside">
          <el-menu
            :default-active="currentNavIndex"
            router
            class="layout_aside-menu"
            :collapse="isCollapse"
          >
            <template v-for="(item, index) in navList">
              <el-menu-item
                :key="index"
                :index="item.name"
                :route="item.path"
                class="layout_aside-item _text-style"
              >
                <i v-if="item.icon" class="iconfont" :class="item.icon"></i>
                <span slot="title">{{item.title}}</span>
              </el-menu-item>
            </template>
          </el-menu>
        </el-aside>
        <el-container>
          <el-main class="layout_main">
            <keep-alive>
              <router-view />
            </keep-alive>
          </el-main>
          <el-footer class="layout_footer" height="40px">&copy; notbucai.com - 不才</el-footer>
        </el-container>
      </el-container>
    </el-container>
    <router-view v-else />
  </div>
</template>

<script>
import { navRoutes } from './router';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      isCollapse: false
    };
  },
  computed: {
    ...mapState(['user']),
    // 对导航权限控制
    navList() {
      if (!this.user) return [];
      if (!this.user.role) return [];
      const acls = this.user.role.acls;
      return navRoutes
        .filter(item => {
          if (this.user.isAdmin) return true;
          const roleRoute = item.meta.role;
          const status = acls.find(item => {
            return item.name === roleRoute;
          });
          return status;
        })
        .map(item => {
          return {
            title: item.meta.title,
            icon: item.meta.icon,
            name: item.name,
            path: item.path
          };
        });
    },
    currentNavIndex() {
      // const path = this.$route.path;
      return this.$route.name;
    }
  },
  methods: {
    handleQuit() {
      this.$store.dispatch('quit');
      this.$router.replace('/login');
    }
  }
};
</script>

<style lang="scss" scoped>
#layout {
  height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
}
.layout_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1;
  background-color: #fff;
  .header_aside {
    width: 200px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    color: #f00;
    background-image: -webkit-linear-gradient(bottom, #ff537e, #02a898);
    background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: bold;
    font-size: 28px;
    box-shadow: 2px 0px 4px rgba(0, 150, 136, 0.1);
  }
  .header_main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 46px;
    flex: 1;
    &-left {
      display: flex;
      align-items: center;
    }
    &-right {
      display: flex;
      align-items: center;
    }
    .current_user {
      &-info {
        padding-left: 16px;
        display: flex;
        align-items: center;
      }
      &-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
      }
      &-username {
        padding-left: 10px;
      }
      &-exit {
        padding-left: 30px;
        cursor: pointer;
      }
    }
  }
}
.layout_content {
  overflow: hidden;
}
.layout_aside {
  background-color: #fff;
  &-menu {
    border-right: none;
  }
  &-item {
    height: 46px;
    line-height: 46px;
    position: relative;
    &::before {
      display: none;
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 150, 136, 0.14);
    }
    &.is-active {
      &::before {
        display: block;
      }
    }
    .iconfont {
      margin-right: 6px;
    }
  }
}
.layout_main {
  /* padding: 0; */
  overflow-y: auto;
  box-sizing: border-box;
}
.layout_footer {
  background-color: #ccc;
  display: flex;
  align-items: center;
  /* background-image: linear-gradient(120deg, #fff 0%, #c2e9fb 100%); */
  background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
  opacity: 0.9;
  color: #333;
}
</style>
