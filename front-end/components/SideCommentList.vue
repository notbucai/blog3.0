<template>
  <div class="SideCommentList">
    <v-container fluid class="my-1">
      <v-row justify="space-between" align="center">
        <div class="title">最新评论</div>
      </v-row>
    </v-container>
    <v-card class="mx-auto mb-6 pa-2">
      <div
        class="article-item"
        v-for="(item, index) in cList"
        :key="index"
        @click.prevent="$router.push('/article/' + item.sourceID + '#comment')"
      >
        <nuxt-link
          class="article-item-left rounded-sm"
          :to="item.user ? '/user/' + item.user._id : ''"
          @click.native.stop
        >
          <div class="left-month">User</div>
          <div class="left-day">
            {{ item.user ? item.user.username : '匿名' }}
          </div>
        </nuxt-link>
        <nuxt-link
          :to="'/article/' + item.sourceID + '#comment'"
          v-ripple
          class="article-item-right"
          @click.stop
        >
          <div class="right-name">{{ item.htmlContent | htmlFilter }}</div>
          <div class="right-user">{{ item.updatedAt | format }}</div>
        </nuxt-link>
      </div>
    </v-card>
  </div>
</template>
<script>
export default {

  computed: {
    cList () {
      return this.list.slice(0, 5);
    }
  },
  props: {
    list: Array
  },
  filters: {
    htmlFilter (htmlStr) {

      return htmlStr.replace(/[\r\n]/ig, '').replace(/<[^>]+>/ig, '').substr(0, 30);
    }
  },
  data () {
    return {
    };
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.SideCommentList {
  ::v-deep {
    .nuxt-link-active {
      color: inherit;
      text-decoration: none;
    }
  }
  .theme--dark {
    .article-item {
      &-left {
        background-color: #131313;
        .left-month {
          color: #000000;
          background-color: #3d3d3d;
        }
        .left-day {
          color: #ffffff;
        }
      }
    }
  }
  .article-item {
    display: flex;
    /* margin-bottom: 14px; */
    cursor: pointer;
    transition: all 0.1s;
    padding: 10px;
    border-radius: 2px;
    &:hover {
      box-shadow: 0 0 12px rgba($color: #000, $alpha: 0.04);
    }

    a {
      text-decoration: none;
    }
    &-left {
      min-width: 70px;
      max-width: 70px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      /* padding: 12px; */
      background-color: #ffeeec;
      border-radius: 4px;
      overflow: hidden;
      .left-month {
        width: 100%;
        text-align: center;
        color: #f96150;
        overflow: hidden;
        background-color: #fed0cb;
        border-radius: 4px 4px 0 0;
        font-size: 12px;
        padding: 2px 8px;
      }
      .left-day {
        flex: 1;
        font-size: 12px;
        padding: 6px 0;
        color: #ff351e;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
      }
    }
    &-right {
      padding: 2px 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      box-sizing: border-box;
      .right-name {
        font-size: 14px;
        font-weight: bold;

        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
      }
      .right-user {
        font-size: 12px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        color: #888;
      }
    }
  }
}
</style>