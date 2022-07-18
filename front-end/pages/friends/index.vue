<!--
 * @Author: bucai
 * @Date: 2021-03-30 19:47:48
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2022-07-17 11:58:45
 * @Description:
-->
<template>
  <v-container class="friends">
    <v-card elevation="0" class="rounded">
      <v-row class="pl-4 pr-4">
        <v-col :md="2" :sm="3" :cols="4" v-for="item in list" :key="item.id">
          <v-lazy transition="scale-transition" :value="$isServer">
            <v-card
              class="rounded-lg"
              nuxt
              link
              :href="'/user/' + item.id"
              elevation="0"
            >
              <div class="friend-item">
                <v-avatar color="primary" size="48">
                  <img :src="item.avatarUrl | imageMogr2(60)" />
                </v-avatar>
                <v-card-title primary-title class="friend-name">{{
                  item.username
                }}</v-card-title>
                <v-card-subtitle class="friend-logintime">{{
                  item.loginAt | fromNowDate
                }}</v-card-subtitle>
              </div>
            </v-card>
          </v-lazy>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
export default {
  head () {
    return {
      title: '圈子'
    }
  },
  async asyncData ({ $axios }) {
    const data = await $axios.get('/api/users/list/show')
    return { list: data };
  },
  data () {
    return {
      list: []
    };
  },
  created () {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.friends {
  max-width: 860px;
  .firend-box {
    display: grid;
  }
  .friend-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 24px;
    padding-top: 8px;
    .friend-name {
      font-size: 14px;
      padding: 6px;
    }
    .friend-logintime {
      font-size: 12px;
      margin-top: 6px;
    }
  }
}
</style>