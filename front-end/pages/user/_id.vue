<template>
  <div class="user">
    <v-container>
      <v-row>
        <v-col :md="8" :sm="12" :cols="12">
          <v-card class="pa-2 mb-6">
            <v-list subheader two-line>
              <v-list-item class="_user-header">
                <v-list-item-avatar size="80" class="_user-avatar">
                  <v-img
                    v-if="userInfo.avatarURL"
                    :src="userInfo.avatarURL"
                    aspect-ratio="1"
                    :width="120"
                  ></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>
                    <span class="headline">{{userInfo.username}}</span>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <div class="d-flex align-center mt-1">
                      <v-icon size="18" class="grey--text text--darken-2">mdi-briefcase-account</v-icon>
                      <span
                        class="grey--text text--darken-2 pl-2"
                      >{{userInfo.job}} | {{userInfo.company}}</span>
                    </div>
                    <div class="d-flex align-center mt-1">
                      <v-icon size="16" class="grey--text text--darken-2">mdi-card-account-details</v-icon>
                      <span class="grey--text text--darken-2 pl-2">{{userInfo.numberroduce}}</span>
                    </div>
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <div class="d-flex align-center _user-pages">
                    <v-btn icon :disabled="!userInfo.weiboID" target="_blank">
                      <v-icon size="18">mdi-sina-weibo</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      :disabled="!userInfo.githubID"
                      :href="'https://github.com/'+userInfo.githubLogin"
                      target="_blank"
                    >
                      <v-icon size="18">mdi-github</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      :disabled="!userInfo.personalHomePage"
                      :href="userInfo.personalHomePage"
                      target="_blank"
                    >
                      <v-icon size="18">mdi-earth</v-icon>
                    </v-btn>
                  </div>
                  <v-btn
                    color="primary"
                    outlined
                    elevation="0"
                    v-if="user && user._id == userInfo._id"
                    nuxt
                    to="settings"
                    class="_user-setting"
                  >编辑个人资料</v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card>

          <v-tabs fixed-tabs v-model="tab">
            <v-tab>文章</v-tab>
            <v-tab>评论</v-tab>
            <v-tab>点赞</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab" color="transparent">
            <v-tab-item>
              <div class="pt-4">
                <article-item v-for="item in articleList" :key="item._id" :article="item" />
              </div>
            </v-tab-item>
            <v-tab-item>
              <div class="pt-4">
                <v-card v-for="item in commentList" :key="item._id" class="mb-2">
                  <comment-item :comment="item" type="user" />
                </v-card>
              </div>
            </v-tab-item>
            <v-tab-item>
              <div class="pt-4">
                <!-- <article-item v-for="item in " :key="item._id" :article="item" /> -->
              </div>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
        <v-col :md="4" :sm="12" :cols="12">
          <v-card>
            <v-card-title>个人成就</v-card-title>
            <v-list dense subheader>
              <v-list-item dense>
                <v-list-item-avatar>
                  <v-icon small>mdi-cards-heart</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>获得点赞 {{achievement.likeConunt||0}}</v-list-item-content>
              </v-list-item>
              <v-list-item dense>
                <v-list-item-avatar>
                  <v-icon small>mdi-cards-heart</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>评论数量 {{achievement.commentCount}}</v-list-item-content>
              </v-list-item>
              <v-list-item dense>
                <v-list-item-avatar>
                  <v-icon small>mdi-cards-heart</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>总字数 {{achievement.wordCount}}</v-list-item-content>
              </v-list-item>
              <v-list-item dense>
                <v-list-item-avatar>
                  <v-icon small>mdi-eye</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>文章被阅读 {{achievement.browseCount}}</v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import ArticleItem from '@/components/article/ArticleItem.vue';
import CommentItem from '@/components/CommentItem.vue';
import { mapState } from 'vuex';
export default {
  head () {
    const { username, numberroduce } = this.userInfo;
    return {
      title: username + '的个人资料',
      meta: [
        { hid: 'description', name: 'description', content: numberroduce || (username + '的个人资料') },
        { hid: 'keywords', name: 'keywords', content: [username, '个人资料', '博客资料', numberroduce].join() }
      ]
    }
  },
  async asyncData ({ $axios, params }) {
    const id = params.id;

    const promiseList = [];
    promiseList.push($axios.get(`/api/users/${id}`));
    promiseList.push($axios.get(`/api/users/${id}/achievement`));
    promiseList.push($axios.get(`/api/users/${id}/article`));
    promiseList.push($axios.get(`/api/users/${id}/article/comment`));
    const [userInfo, achievement, articleList, commentList] = await Promise.all(
      promiseList
    );
    return {
      userInfo,
      achievement,
      articleList,
      commentList
    };
  },
  components: { ArticleItem, CommentItem },
  props: {},
  computed: {
    ...mapState(['user'])
  },
  data () {
    return {
      tab: null,
      userInfo: {},
      achievement: {},
      articleList: [],
      commentList: []
    };
  },
  mounted () { },
  methods: {}
};
</script>
<style lang="scss">
@media (max-width: 600px) {
  .user {
    ._user-header {
      padding-top: 24px !important;
    }
    ._user-setting {
      height: 26px !important;
      font-size: 12px !important;
      padding: 8px !important;
    }
    ._user-pages {
      margin-top: -36px;
    }
    ._user-avatar {
      $w: 54px;
      width: $w !important;
      min-width: $w !important;
      height: $w !important;
      margin: 0 !important;
      position: absolute;
      background-color: #fff;
      top: -($w/2);
    }
  }
}
</style>
<style lang="scss" scoped>
.user {
  .v-tabs-items {
    background-color: transparent !important;
  }
  .user-comment-item {
    background-color: #fff;
    margin-bottom: 12px;
  }
}
</style>