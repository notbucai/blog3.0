<template>
  <div class="keyboard" >
    <canvas ref="canvas" />
  </div>
</template>
<script>
import { run } from './core.js';
export default {
  data() {
    return {

    };
  },
  async mounted() {
    const width = window.innerWidth * 0.3;
    const el = this.$refs['canvas'];
    this.splineApp = await run(el, {
      width,
    });
  },
  beforeDestroy() {
    this.splineApp.dispose();
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
  .keyboard {
    position: fixed;
    z-index: 8;
    width: 38vw;
    right: 0;
    bottom: 0;
    pointer-events: none;
    canvas {
      width: 100%!important;
      height: auto!important;
    }
    @media (max-width: 600px) {
      display: none!important;
    }
  }
</style>
