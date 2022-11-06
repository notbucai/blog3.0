<template>
  <v-container class="article">
    <v-row>
      <v-col :md="8" :sm="12" :cols="12">
        <v-card>
          <div class="acticle_pic" v-if="data.coverUrl">
            <v-img
              :aspect-ratio="16 / 9"
              :src="data.coverUrl | imageMogr2(800)"
              :lazy-src="data.coverUrl | imageMogr2(10)"
            ></v-img>
          </div>
          <div class="acticle_content">
            <v-alert
              :icon="$icons['mdi-alert-circle-outline']"
              type="warning"
              dense
              v-if="data.status === 1"
              >审核中</v-alert
            >
            <v-alert
              :icon="$icons['mdi-alert-circle-outline']"
              type="warning"
              dense
              v-if="data.status === 3"
              >审核未通过</v-alert
            >

            <h1 class="acticle_title display-1">{{ data.title }}</h1>
            <div class="acticle_user d-flex justify-space-between align-center">
              <!-- user info -->
              <user-card :userId="data.user.id">
                <nuxt-link
                  v-ripple
                  tag="div"
                  :to="`/user/${data.user.id}`"
                  class="acticle_user-left d-flex align-center"
                  v-if="data.user"
                >
                  <div
                    class="acticle_user-avatar mr-3"
                    v-if="data.user.avatarUrl"
                  >
                    <v-avatar size="42">
                      <v-img
                        :src="data.user.avatarUrl | imageMogr2(68, 68)"
                      ></v-img>
                    </v-avatar>
                  </div>
                  <div class="acticle_info">
                    <div class="acticle_info-username">
                      {{ data.user.username }}
                    </div>
                    <div class="acticle_info-date">
                      <span>{{ data.createAt | format }}</span>
                      <v-btn
                        text
                        color="primary"
                        x-small
                        class="overline"
                        v-if="user && user.id == data.user.id"
                        @click.stop="handleEditArticle"
                        >编辑</v-btn
                      >
                    </div>
                  </div>
                </nuxt-link>
              </user-card>
              <div class="acticle_user-right">
                <v-btn text>
                  <v-icon left>{{ $icons['mdi-eye'] }}</v-icon>
                  {{ data.browseCount }}
                </v-btn>
                <!-- <v-btn color="success">123123123</v-btn> -->
                <v-btn
                  text
                  :color="hasLike(data.likes) ? 'error' : ''"
                  @click="handleClickLike"
                >
                  <v-icon left :color="hasLike(data.likes) ? 'error' : ''">{{
                    $icons['mdi-cards-heart']
                  }}</v-icon>
                  {{ data.likes ? data.likes.length : 0 }}
                </v-btn>
                <!-- :color="hasLike(article.likes)?'error':''" -->
              </div>
            </div>
            <div
              class="acticle_htmlContent v-note-wrapper markdown-body"
              v-html="content"
            ></div>
          </div>
          <div class="acticle_tags">
            <nuxt-link
              v-for="item in data.tags"
              :key="item.id"
              class="tag-item-link"
              :to="`/tag/${item.tag ? item.tag.name : item.name}`"
            >
              <v-chip class="ma-2" label>
                <v-icon left small v-if="item.tag && item.tag.icicononUrl">{{ $icons['mdi-' + item.tag.icon] }}</v-icon>
                {{ item.tag ? item.tag.name : '-' }}
              </v-chip>
            </nuxt-link>
          </div>
          <v-divider></v-divider>
          <comment-box
            :source-data="data"
            source="article"
            id="comment"
            :cid="id"
            :comments="comments"
          />
        </v-card>
      </v-col>
      <v-col :md="4" :sm="12" :cols="12">
        <v-card class="menus_box">
          <v-card-title>导航</v-card-title>

          <ul class="menus overflow-y-auto">
            <li class="menu menu-h1">{{ data.title }}</li>
            <li
              v-for="(item, index) in menus"
              :key="index"
              :class="
                'menu menu-' +
                item.type +
                ' ' +
                (currentTitleHash == item.target ? 'active' : '')
              "
              @click="handleGoToScroll(item.target)"
            >
              {{ item.title }}
            </li>
          </ul>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import CommentBox from '@/components/comment/CommentBox';
import UserCard from '@/components/user/UserCard.vue';
import { mapState } from 'vuex';
import mixin from '@/utils/mixin';

export default {
  head () {
    const { title, summary } = this.data;
    return {
      title,
      meta: [
        { hid: 'description', name: 'description', content: summary },
        { hid: 'keywords', name: 'keywords', content: [title, summary].join() }
      ]
    }
  },
  async asyncData ({ $axios, env, params, app }) {
    const id = params.id;
    const promiseList = [];
    promiseList.push($axios.get(`/api/article/${id}`));
    promiseList.push($axios.get(`/api/comment/list/article/${id}`));
    const [resData, comments] = await Promise.all(promiseList);

    return {
      data: resData,
      menus: resData.menus,
      comments,
      id
    };
  },
  mixins: [mixin],
  components: {
    CommentBox,
    UserCard
  },
  props: {},
  computed: {
    ...mapState(['user']),
    content () {
      return this.data.htmlContent;
    },
  },
  data () {
    return {
      data: {},
      comments: [],
      menus: [],
      id: null,
      currentTitleHash: ''
    };
  },
  mounted () {
    // console.log(this.menus);
    const hash = this.$route.hash;
    this.currentTitleHash = '#' + (hash || '');
    if (hash) {
      this.$nextTick(() => {
        this.handleGoToScroll(hash)
      });
    }
    this.$scrollListenCallback = this.$scrollListen.bind(this);
    this.initMenuScrollListen();
  },
  beforeDestroy () {
    this.removeMenuScrollListen();
  },
  methods: {
    $scrollListen (e) {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      scrollTop += this.$vuetify.application.top + 40;

      const titleList = [...document.querySelectorAll('h2,h3,h4,h5,h6')];
      const scrollTopList = titleList.map(el => {
        const elEmentOffsetTop = this.getElementToPageTop(el);
        return {
          scrollTop: elEmentOffsetTop,
          el
        }
      });

      scrollTopList.reverse();
      for (const item of scrollTopList) {
        const _scrollTop = scrollTop - item.scrollTop;
        // console.log('_scrollTop', item.el.id, _scrollTop);

        if (_scrollTop >= 0) {
          this.currentTitleHash = '#' + item.el.id;
          break;
        }
      }

    },
    initMenuScrollListen () {
      window.addEventListener('scroll', this.$scrollListenCallback);
    },
    removeMenuScrollListen () {
      window.removeEventListener('scroll', this.$scrollListenCallback);
    },
    getElementToPageTop (el) {
      const box = el.getBoundingClientRect();
      const winElem = el.ownerDocument.defaultView;
      const top = box.top + winElem.pageYOffset;
      return top;
    },
    handleEditArticle () {
      const id = this.id;
      this.$router.push('/edit/article?id=' + id);
    },
    handleGoToScroll (target) {
      const el = document.querySelector(target);
      if (!el) return;
      location.href = target;

      const topSize = this.getElementToPageTop(el);

      this.$vuetify.goTo(topSize - 20);
    },
    async handleClickLike () {
      const aid = this.data.id;
      try {
        const likes = this.changeLike(this.data.likes);
        await this.$axios.put('/api/article/' + aid + '/like');
        this.$set(this.data, 'likes', likes);
      } catch (error) {
        console.log('error', error);
      }
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
  z-index: 4 !important;
  border: none;
}
/* .v-note-wrapper .v-note-op .v-left-item,
  .v-note-wrapper .v-note-op .v-right-item {
    flex: none;
  }
  .op-icon-divider {
    display: none;
  } */
.theme--dark {
  .article {
    &.v-divider {
      border-top-color: #000 !important;
    }
  }
}
#comment {
  @media (max-width: 1260px) {
    .xs-hide {
      display: none !important;
    }
  }
}
</style>
<style lang="scss" scoped>
.theme--dark {
  .article {
    /* background-color: #1d1d1d; */
  }
}
.article {
  /* background-color: #fff; */
  /* border-radius: 4px; */
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
      min-width: 200px;
    }
    &-right {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
  }
  .acticle_info {
    &-username {
    }
    &-date {
      font-size: 12px;
      color: #666;
      display: flex;
      align-items: center;
    }
  }
  .acticle_htmlContent {
    margin-top: 24px;
    border: none;
    background-color: inherit;
    color: inherit;
    ::v-deep {
      .bug-text {
        position: relative;
        cursor: pointer;
        &:hover {
          i {
            display: block;
          }
        }
        i {
          position: absolute;
          z-index: 5;
          bottom: -30px;
          left: 0;
          font-size: 12px;
          white-space: nowrap;
          display: none;
          background-color: #fff;
          padding: 4px 8px;
          border-radius: 4px;
          box-shadow: 0 0 4px rgba($color: #000000, $alpha: 0.2);
        }
      }
    }
  }
  @media (max-width: 600px) {
    .acticle_content {
      padding: 20px;
    }
  }
  .menus_box {
    position: sticky;
    top: 80px;
    &.theme--dark {
      .menus {
        &::before {
          background-color: #000 !important;
        }
        .menu {
          $color: #666;
          color: $color !important;

          &:hover,
          &.active {
            $color1: rgb(66, 154, 255);
            color: $color1 !important;
            &::before {
              background-color: $color1;
            }
          }
          &:hover {
            background-color: rgba($color: #000, $alpha: 0.6);
          }
        }
      }
    }
  }
  .menus {
    padding: 0 12px 12px;
    margin: 0;
    position: relative;
    max-height: 480px;
    &::before {
      // content: '';
      position: absolute;
      z-index: 0;
      left: 24px;
      top: 0;
      width: 2px;
      height: 100%;
      border-radius: 2px;
      background-color: #fafafa;
    }
    .menu {
      position: relative;
      z-index: 1;
      padding: 6px 12px;
      border-radius: 4px;
      list-style: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      $color: #444;
      color: $color;
      transition: all 0.2s;

      &:hover,
      &.active {
        $color1: rgb(66, 154, 255);
        color: $color1;
        &::before {
          background-color: $color1;
        }
      }
      &:hover {
        background-color: rgba($color: #f0f0f0, $alpha: 0.6);
      }

      &::before {
        content: '';
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: $color;
        margin-right: 10px;
        margin-left: 10px;
        transition: all 0.2s;
      }
      &.menu-h1 {
        &::before {
          width: 6px;
          height: 6px;
        }
      }
      @for $i from 1 to 10 {
        &.menu-h#{$i} {
          padding-left: ($i - 1) * 14px;
          /* background-color: #000; */
        }
      }
      a {
        display: block;
        color: inherit;
        text-decoration: none;
      }
    }
  }
}
</style>