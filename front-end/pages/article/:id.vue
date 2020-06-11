<template>
  <v-container class="article">
    <div class="acticle_pic" v-if="data.coverURL">
      <v-img
        :aspect-ratio="16/9"
        :src="data.coverURL"
        :lazy-src="data.coverURL+'?imageMogr2/thumbnail/100x'"
      ></v-img>
    </div>
    <div class="acticle_content">
      <h1 class="acticle_title display-1">{{data.title}}</h1>
      <div class="acticle_user d-flex justify-space-between align-center">
        <nuxt-link
          v-ripple
          tag="div"
          :to="`/user/${data.user._id}`"
          class="acticle_user-left d-flex align-center"
          v-if="data.user"
        >
          <div class="acticle_user-avatar mr-2" v-if="data.user.avatarURL">
            <v-avatar size="48">
              <v-img :src="data.user.avatarURL+'?imageMogr2/thumbnail/100x100'"></v-img>
            </v-avatar>
          </div>
          <div class="acticle_info">
            <div class="acticle_info-username">{{data.user.username}}</div>
            <div class="acticle_info-date">
              <span>{{data.createdAt | format}}</span>
              <v-btn
                text
                color="primary"
                x-small
                class="overline"
                v-if="user && user._id == data.user._id"
                @click.stop="handleEditArticle"
              >编辑</v-btn>
            </div>
          </div>
        </nuxt-link>
        <div class="acticle_user-right">
          <v-btn text>
            <v-icon left>mdi-eye</v-icon>
            {{data.browseCount}}
          </v-btn>
        </div>
      </div>
      <div
        class="acticle_htmlContent v-note-wrapper markdown-body"
        v-html="$utils.markdown(data.content)"
      ></div>
    </div>
    <div class="acticle_tags">
      <nuxt-link
        :to="`/tag/${item.name}`"
        class="tag-item-link"
        v-for="(item) in data.tags"
        :key="item.name"
      >
        <v-chip class="ma-2" label>
          <v-icon left small>mdi-{{item.iconURL}}</v-icon>
          {{item.name}}
        </v-chip>
      </nuxt-link>
    </div>
    <v-divider></v-divider>
    <Comment-box source="article" :id="id" :comments="comments" />
  </v-container>
</template>
<script>
import 'mavon-editor/dist/markdown/github-markdown.min.css';

import CommentBox from '@/components/CommentBox';
import { mapState } from 'vuex';
// import 'mavon-editor/dist/highlightjs'
// import highlightjs from 'mavon-editor/dist/highlightjs/highlight.min.js';
export default {
  async asyncData({ $axios, env, params }) {
    const id = params.id;
    const promiseList = [];
    promiseList.push($axios.get(`/api/article/${id}`));
    promiseList.push($axios.get(`/api/comment/list/article/${id}`));
    const [resData, comments] = await Promise.all(promiseList);
    return {
      data: resData,
      comments,
      id
    };
  },
  components: { CommentBox },
  props: {},
  computed: {
    ...mapState(['user'])
  },
  data() {
    return {
      data: {},
      comments: [],
      id: null
    };
  },
  mounted() {
    // highlightjs.initHighlightingOnLoad();
    console.log('mounted');
  },
  methods: {
    handleEditArticle() {
      const id = this.id;
      this.$router.push('/edit/article?id=' + id);
    }
  }
};
</script>
<style lang="scss">
.theme--light {
  @import '@/assets/markdown/atom-one-light.scss';
}
.theme--dark {
  @import '@/assets/markdown/atom-one-dark.scss';
}
.article .markdown-body {
  z-index: 4;
  border: none;
}
.article {
  /* .v-note-wrapper .v-note-op .v-left-item,
  .v-note-wrapper .v-note-op .v-right-item {
    flex: none;
  }
  .op-icon-divider {
    display: none;
  } */
}
</style>
<style lang="scss" scoped>
.theme--dark {
  .article {
    background-color: #1d1d1d;
  }
}
.article {
  background-color: #fff;
  border-radius: 4px;
  padding: 0;
  .acticle_pic {
    border-radius: 4px 4px 0 0;
    overflow: hidden;
  }
  .acticle_user-avatar {
    border-radius: 50%;
    overflow: hidden;
  }
  .acticle_title {
    margin: 0 0 30px;
  }
  .acticle_content {
    overflow: hidden;
    padding: 40px;
  }
  .acticle_tags {
    padding: 30px 40px;
  }
  .acticle_comment {
    padding: 30px 40px;
    position: relative;
  }
  .acticle_user {
    &-left {
      cursor: pointer;
      border-radius: 4px;
      padding: 4px;
    }
  }
  .acticle_info {
    &-date {
      font-size: 12px;
      color: #666;
    }
  }
  .acticle_htmlContent {
    margin-top: 24px;
    border: none;
    background-color: inherit;
    color: inherit;
  }
  @media (max-width:600px) {
    .acticle_content{
      padding: 20px;
    }
  }
}
</style>