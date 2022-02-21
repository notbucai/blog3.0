<template>
  <NuxtLink :to="'/article/' + id" class="search-article-item mb-4">
    <header class="text-h6 mb-2">
      <template v-for="(item, index) in title_show" :key="index">
        <mark v-if="item.status">{{ item.value }}</mark>
        <span v-else>
          {{ item.value }}
        </span>
      </template>
    </header>
    <main class="body-2">
      <template v-for="(item, index) in content_show" :key="index" >
        <mark v-if="item.status">{{ item.value }}</mark>
        <span v-else>
          {{ item.value }}
        </span>
      </template>
    </main>
    <v-divider class="search-article-item-divider mt-4"></v-divider>
  </NuxtLink>
</template>
<script>
export default {
  props: {
    id: String,
    title: String,
    content: String,
    keywords: Array
  },
  computed: {
    title_show () {
      return this._split(this.title)
    },
    content_show () {
      return this._split(this.content)
    }
  },
  data () {
    return {

    };
  },
  created () {
  },
  methods: {
    _split (str) {
      let keywords = this.keywords;
      const rex = new RegExp(`(${keywords.join('|')})`, 'g');
      const list = str.replace(rex, '~~~$1~~~').split('~~~').filter(item => item);
      return list.map(item => {
        return {
          value: item,
          status: keywords.includes(item) ? 1 : 0
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.search-article-item {
  text-decoration: none;
  display: block;
  transition: all 0.2s;

  &:last-child {
    .search-article-item-divider {
      display: none;
    }
  }
  &:hover,
  &:active {
    opacity: 0.8;
  }
  header {
    font-weight: bold;
  }
  main {
    display: -webkit-box;
    text-overflow: ellipsis;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3; //当属性值为3，表示超出3行隐藏
    color: #888888;
  }
  mark {
    padding: 0 2px;
    font-weight: bold;
    border-radius: 1px;
  }
  span,
  mark {
    display: inline-block;
  }
}
</style>