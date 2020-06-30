<template>
  <div class="SideCommentList"></div>
</template>
<script>
export default {
  components: {},
  props: {},
  computed: {},
  data () {
    return {
      list: []
    };
  },
  methods: {
    test () {
      console.log(this.msg)
    }
  }
}
</script>
<style lang="scss" scoped>
.SideCommentList {
  padding: 10px;
}
</style>