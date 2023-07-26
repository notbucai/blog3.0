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
              {{ dvData.readCount || '-' }}
            </div>
          </div>
        </div>

        <div class="info-row">
          <div class="info-card">
            <div class="info-card-title">流量城市</div>
            <div class="info-card-content">
              <div class="info-card-content-text" style="color: #FFF90A;">
                {{ city || '-' }}
              </div>
            </div>
          </div>
          <div class="info-card">
            <div class="info-card-title">今日访问</div>
            <div class="info-card-content">
              <div class="info-card-content-number" style="color: #26EF9B;">
                {{ dvData.readCountToday || '-' }}
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
        <div class="info-time">{{nowDate}}</div>
        <div class="info-card">
          <div class="info-card-title">城市排行</div>
          <div class="info-card-content">
            <div class="info-card-content-chart">

              <div class="info-city-list">
                <div class="info-city-item" v-for="(item, index) in cityList" :key="item.city">
                  <div class="info-city-item-name">
                    <span>{{index + 1}}、{{item.city}}</span>
                    <span>{{item.count}}</span>
                  </div>
                  <div class="info-city-item-count">
                    <div class="p" :style="{width: item.percent + '%'}"></div>
                  </div>
                </div>
              </div>

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

import { format } from 'date-fns';

export default {
  layout: 'empty',
  data () {
    
    return {
      dvData: {},
      nowDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    };
  },
  computed: {
    city () {
      return this.dvData?.groupByCity?.[0]?.city || '-';
    },
    cityList() {
      let list = (this.dvData?.groupByCity || []);
      // 取前10条
      list = list.slice(0, 10);
      // 计算总数
      const total = list.reduce((total, item) => total + item.count, 0);
      list = list.map(item => {
        return {
          ...item,
          // 得到比例
          percent: item.count / total * 100,
        }
      });
      return list;
    },
  },
  mounted () {
    this.init();
    this.renderDate();
  },
  methods: {
    // 当前时间更新
    renderDate() {
      setInterval(() => {
        this.nowDate = format(new Date(), 'yyyy年MM月dd日 HH:mm:ss');
      }, 800);
    },
    async handleLoadData () {
      const dvData = await this.$axios.get('/api/data/dv');
      this.dvData = dvData;
      this.initDataChangeLine(dvData.readCountDays);
      this.earth.renderData({
        lat: 30,
        lon: 120,
      }, dvData.groupByLonLat.filter(item => item.count > 1));
    },
    init () {
      const container = this.$refs.container;
      const earth = new Earth({
        container,
        size: 100,
      });
      this.earth = earth;
      earth.earthGroup.position.x = -40;
      this.handleLoadData();
    },
    initDataChangeLine (data) {
      data = data.sort((a, b) => new Date(a.date) - new Date(b.date));
      const myChart = echarts.init(this.$refs['chart-el']);
      // data
      const option = {
        color: '#0FF6F6',
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '6%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: data.map(item => format(new Date(item.date), 'MM-dd')),
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
            data: data.map(item => item.count),
            type: 'line',
            smooth: true,
            // 点大小
            symbolSize: 4,
          },
          {
            data: data.map(item => item.count),
            type: 'bar',
            barMaxWidth: 16,
            // 圆角
            itemStyle: {
              barBorderRadius: [5, 5, 0, 0],
              // 限制宽度
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
      height: 100%;
      padding: 4vw;

      &::before {
        content: '';
        display: block;
        position: absolute;
        left: -70%;
        top: -60%;
        width: 140%;
        height: 140%;
        // 渐变 圆心渐变
        background-image: radial-gradient(ellipse at center, #0FF6F633 0%, #0FF6F600 70%);

      }

      >div {
        position: relative;
        z-index: 1;
      }
    }

    .info-right {
      position: absolute;
      right: 0;
      top: 0;
      width: 24vw;
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
    margin-bottom: 6vh;

    .info-card-title {
      font-size: 2vw;
      color: #FFFFFF;
    }

    .info-card-content {
      margin-top: 2vh;

      .info-card-content-number,
      .info-card-content-text {
        font-size: 2.6vw;
        color: #0FF6F6;
        letter-spacing: 0.5vw;
      }

      .info-card-content-chart {
        background-color: rgba($color: #000000, $alpha: .1);
        padding: 2vh 1vw;
        border-radius: 0.5vw;
        width: 100%;
        box-shadow: 0 0 4vw 0 rgba($color: #0FF6F6, $alpha: .08);


        &.echarts {
          width: 100%;
          height: 24vh;
        }
      }
    }
  }
  .info-city-list {
    .info-city-item {
      margin-bottom: 1.8vh;
      width: 100%;
      .info-city-item-name {
        margin-bottom: 0.6vh;
        font-size: 1vw;
        width: 100%;
        display: flex;
        justify-content: space-between;
        span {
          &:last-child {
            color: #5cd6bc;
          }
        }
      }
      .info-city-item-count{ 
        width: 100%;
        height: 0.6vh;
        background-color: rgba($color: #fff, $alpha: 0.4);
        border-radius: 3vw;
        .p {
          height: 100%;
          background-color: #5cd6bc;
          border-radius: 3vw;
        }
      }
    }
  }
}
</style>

