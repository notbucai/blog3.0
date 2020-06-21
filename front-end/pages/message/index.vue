<template>
  <div class="index">
    <v-container>
      <Comment-box source="message" :id="id" :comments="comments" />
    </v-container>
  </div>
</template>
<script>
import CommentBox from '@/components/CommentBox.vue';
export default {
  scrollToTop:true,
  async asyncData({ $axios, env, params }) {
    const id = '000000000000000000000000';
    const promiseList = [];
    promiseList.push($axios.get(`/api/comment/list/message/${id}`));
    const [comments] = await Promise.all(promiseList);
    console.log('comments',comments);
    
    return {
      comments,
      id
    };
  },
  components: { CommentBox },
  props: {},
  computed: {},
  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>
<style lang="scss" scoped>
.index {
  padding: 10px;
}
</style>