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
              <div class="info-card-content-text">
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
            <div class="info-card-content-chart echarts" ref="chart-el">
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
import * as echarts from 'echarts';

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
      this.initDataChangeLine(dvData.readCountDays);
    },
    init() {
      const container = this.$refs.container;
      const earth = new Earth({
        container,
        size: 100,
      });
      this.earth = earth;
      earth.earthGroup.position.x = -60;
      this.handleLoadData();
    },
    initDataChangeLine(data) {
      const myChart = echarts.init(this.$refs['chart-el']);
      // data
      const option = {
        color: '#0FF6F6',
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          // boundaryGap: false,
          axisLabel: {
            color: '#fff',
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#fff',
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          }
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            smooth: true,
            // 点大小
            symbolSize: 10,
          },
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'bar',
            // 圆角
            itemStyle: {
              barBorderRadius: [5, 5, 0, 0],
              // 限制宽度
              barMaxWidth: 8,
            },
          }
        ]
      };
      myChart.setOption(option);
    },
  },
}
</script>

<style lang="scss" scoped>
.dv-page {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  font-family: DingTalk-JinBuTi, DingTalk;
  line-height: 1;

  .info-warp {
    position: absolute;
    z-index: 10;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    pointer-events: none;
    color: #fff;

    .info-left {
      position: absolute;
      left: 0;
      top: 0;
      width: 30vw;
      padding: 4vw;
    }

    .info-right {
      position: absolute;
      right: 0;
      top: 0;
      width: 30vw;
      text-align: right;
      padding: 4vw;
    }
  }

  .info-row {
    display: flex;
    align-items: center;
    gap: 3.5vw;
  }

  .dv-title {
    display: flex;
    flex-direction: column;
    font-size: 2.6vw;
    color: #FFFFFF;
    margin-bottom: 6vh;

    .dv-title-submit {
      font-size: 1.3vw;
      color: rgba(255, 255, 255, 0.6);
      margin-top: 0.6vh;
    }
  }

  .info-time {
    margin-bottom: 4vh;
    font-size: 1vw;
    font-weight: normal;
    color: #74AA9E;
  }

  .info-card {
    margin-bottom: 4vh;

    .info-card-title {
      font-size: 2vw;
      color: #FFFFFF;
    }

    .info-card-content {
      margin-top: 1.6vh;

      .info-card-content-number,
      .info-card-content-text {
        font-size: 2.6vw;
        color: #0FF6F6;
        letter-spacing: 0.5vw;
      }

      .info-card-content-chart {
        background-color: rgba($color: #000000, $alpha: .1);
        padding: 10px;
        border-radius: 0.5vw;
        width: 100%;
        box-shadow: 0 0 1vw 0 rgba($color: #ffffff, $alpha: .1);
        &.echarts {
          width: 100%;
          height: 20vh;
        }
      }
    }
  }
}
</style>

