<template>
  <div class="SideRandomArticle">
    <v-container fluid class="my-1">
      <v-row justify="space-between" align="center">
        <div class="title">随机文章</div>
      </v-row>
    </v-container>
    <v-card class="mx-auto mb-6 pa-2">
      <nuxt-link
        :to="'/article/'+item._id"
        v-for="(item, index) in list"
        :key="index"
        v-ripple
        class="article-item"
      >
        <div class="article-item-left rounded-sm">
          <div class="left-month">View</div>
          <div class="left-day">{{item.browseCount}}</div>
        </div>
        <div class="article-item-right">
          <div class="right-name">{{item.title}}</div>
          <div class="right-user">{{item.summary}}</div>
        </div>
      </nuxt-link>
    </v-card>
  </div>
</template>
<script>
export default {

  computed: {},
  props: {
    list: Array
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
.SideRandomArticle {
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
    text-decoration: none;
    transition: all 0.1s;
    padding: 10px;
    border-radius: 2px;
    &:hover {
      box-shadow: 0 0 12px rgba($color: #000, $alpha: 0.04);
    }
    &-left {

      min-width: 70px;
      max-width: 70px;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      /* padding: 12px; */
      background-color: #eef8ff;
      border-radius: 4px;
      overflow: hidden;
      .left-month {
        width: 100%;
        text-align: center;
        color: #2096f3;
        overflow: hidden;
        background-color: #bde3ff;
        border-radius: 4px 4px 0 0;
        font-size: 12px;
        padding: 2px 8px;
      }
      .left-day {
        flex: 1;
        color: #008fff;
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
      }
    }
  }
}
</style>