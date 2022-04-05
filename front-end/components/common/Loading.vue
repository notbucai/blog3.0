<template>
  <div :style="{height}">
    <v-overlay :value="true">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>
<script>
export default {
  props: {
    height: String
  },
  data () {
    return {

    };
  },
  created () {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.compoent-loading {
}
</style>