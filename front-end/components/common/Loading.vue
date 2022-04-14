<template>
  <div :style="{ height }">
    <v-overlay :value="!hidden" :absolute="absolute" z-index="9999">
      <v-progress-circular indeterminate size="32" color="red"></v-progress-circular>
    </v-overlay>
  </div>
</template>
<script>
export default {
  props: {
    height: String,
    absolute: Boolean,
    hidden: Boolean,
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