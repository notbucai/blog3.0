<!--
 * @Author: bucai
 * @Date: 2020-05-04 20:54:03
 * @LastEditors: bucai
 * @LastEditTime: 2021-03-21 21:33:44
 * @Description: 
 -->

<template>
  <v-menu :nudge-left="46" :nudge-bottom="10" offset-y>
    <template v-slot:activator="{ on }">
      <v-avatar size="36" color="primary" v-on="on" style="cursor: pointer">
        <img :src="user.avatarURL" :alt="user.username" />
      </v-avatar>
    </template>
    <v-list>
      <v-list-item dense v-for="item in userNavs" :key="item.key">
        <v-btn
          text
          block
          class="justify-start"
          @click="handleSelectAction(item.key)"
        >
          <v-icon left>{{ $icons['mdi-' + item.icon] }}</v-icon>
          {{ item.title }}
        </v-btn>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
const urlMap = {
  publish: '/edit/new'
};
export default {
  components: {},
  props: {},
  computed: {
    ...mapState(['user'])
  },
  data () {
    this.userNavs = [
      {
        icon: 'pencil',
        title: '写文章',
        key: 'publish'
      },
      {
        icon: 'account',
        title: '我的账号',
        key: 'account'
      },
      // {
      //   icon: 'cog',
      //   title: '设置',
      //   key: 'setup'
      // },
      {
        icon: 'exit-to-app',
        title: '退出',
        key: 'exit'
      }
    ];
    return {};
  },
  created () {
  },
  mounted () {
  },
  methods: {
    handleSelectAction (key) {
      let url = urlMap[key];
      if (!url) {
        if (key == 'account') {
          url = `/user/${this.user._id}`;
        } else if (key == 'exit') {
          this.$cookies.removeAll('Authorization')
          location.reload();
          return;
        }
      }
      this.$router.push(url);
    }
  }
};
</script>
<style lang="scss" scoped>
.CurrentUser {
  padding: 10px;
}
</style>