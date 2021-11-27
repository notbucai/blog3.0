<template>
  <div @click="v++">
    {{ v }}
  </div>
</template>

<script setup lang="ts">
  import { ref } from '@vue/reactivity'

  const v = ref(1)
</script>

<style lang="scss">
  #app {
    p {
      color: #ccc;
    }
  }
</style>
