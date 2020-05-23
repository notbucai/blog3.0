<template>
  <div class="user">
    <v-container>
      <v-row>
        <v-col cols="8">
          <v-card class="pa-2 mb-6">
            <v-list subheader two-line>
              <v-list-item>
                <v-list-item-avatar size="80">
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
                  <div class="d-flex align-center">
                    <v-btn icon :disabled="!userInfo.weiboID">
                      <v-icon color="grey lighten-1" size="18">mdi-sina-weibo</v-icon>
                    </v-btn>
                    <v-btn icon :disabled="!userInfo.githubID">
                      <v-icon color="grey lighten-1" size="18">mdi-github</v-icon>
                    </v-btn>
                    <v-btn icon :disabled="!userInfo.personalHomePage">
                      <v-icon color="grey lighten-1" size="18">mdi-earth</v-icon>
                    </v-btn>
                  </div>
                  <v-btn
                    color="primary"
                    outlined
                    elevation="0"
                    v-if="user && user._id == userInfo._id"
                    nuxt
                    to="edit"
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
        <v-col cols="4">
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
  async asyncData({ $axios, params }) {
    const id = params.id;
    console.log('id', id);

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
  data() {
    return {
      tab: null,
      userInfo: {},
      achievement: {},
      articleList: [],
      commentList: []
    };
  },
  mounted() {},
  methods: {}
};
</script>
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