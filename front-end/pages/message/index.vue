<template>
  <div class="index">
    <v-container class="content-container">
      <Comment-box source="message" :id="id" :comments="comments" />
    </v-container>
  </div>
</template>
<script>
import CommentBox from '~/components/comment/CommentBox.vue';
export default {
  scrollToTop: true,
  // head () {
  //   return {
  //     title: '留言',
  //     meta: []
  //   }
  // },
  head: {
    title: '留言',
  },
  async asyncData ({ $axios, env, params }) {
    const id = '000000000000000000000000';
    const promiseList = [];
    promiseList.push($axios.get(`/api/comment/list/message/${id}`));
    const [comments] = await Promise.all(promiseList);

    return {
      comments,
      id
    };
  },
  components: { CommentBox },
  props: {},
  computed: {},
  data () {
    return {};
  },
  mounted () { },
  methods: {}
};
</script>
<style lang="scss" scoped>
.index {
  padding: 10px;
}
</style>