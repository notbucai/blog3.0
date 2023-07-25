<template>
  <div class="dv-page">
    <div ref="container"></div>
    <div class="info-warp">
      <div class="info-left">
        <div class="dv-title">
          <span>
            不才博客流量监测
          </span>
          <span class="dv-title-submit">
            Bùcái's Blog Traffic Monitoring
          </span>
        </div>

        <div class="info-card">
          <div class="info-card-title">访问总统计</div>
          <div class="info-card-content">
            <div class="info-card-content-number">
              123,12312
            </div>
          </div>
        </div>

        <div class="info-row">
          <div class="info-card">
            <div class="info-card-title">流量城市</div>
            <div class="info-card-content">
              <div class="info-card-content-number">
                江西
              </div>
            </div>
          </div>
          <div class="info-card">
            <div class="info-card-title">今日访问</div>
            <div class="info-card-content">
              <div class="info-card-content-number">
                123,22
              </div>
            </div>
          </div>
        </div>


        <div class="info-card">
          <div class="info-card-title">数据变化</div>
          <div class="info-card-content">
            <div class="info-card-content-chart">
              123,22
            </div>
          </div>
        </div>
      </div>

      <div class="info-right">
        <div class="info-time">2022年12月22日 22:22:12</div>
        <div class="info-card">
          <div class="info-card-title">城市排行</div>
          <div class="info-card-content">
            <div class="info-card-content-chart">
              123,22
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Earth from '../../dv/earth/main.js';
export default {
  layout: 'empty',
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  methods: {
    async handleLoadData() {
      const dvData = await this.$axios.get('/api/data/dv');
      this.earth.renderData({
        lat: 30,
        lon: 120,
      }, dvData.groupByLonLat.filter(item => item.count > 1));
    },
    init() {
      const container = this.$refs.container;
      const earth = new Earth({
        container,
        size: 100,
      });
      this.earth = earth;
      this.handleLoadData();
    }
  },
}
</script>

<style lang="scss" scoped></style>

