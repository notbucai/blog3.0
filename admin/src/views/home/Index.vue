<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card  v-loading="loading" shadow="hover">
          <el-row
            type="flex"
            justify="space-between"
            align="middle"
            :gutter="20"
          >
            <el-col>
              <p>文章</p>
              <h1>{{ d.articleCount || 0 }}</h1>
            </el-col>
            <el-col class="tr">
              <h1 class="bgicon bgicon1 el-icon-s-grid"></h1>
            </el-col>
          </el-row>
        </el-card>
        <!-- <el-card  v-loading="loading" shadow="hover" class="mt2 bgcard1">
          <div class="df aic jcsb">
            <span>昨日新增</span>
            <span>{{ d.articleCount || 0 }}</span>
          </div>
          <div class="df ai jcsb mt2">
            <span>今日新增</span>
            <span>{{ d.articleCount || 0 }}</span>
          </div>
        </el-card> -->
      </el-col>
      <el-col :span="6">
        <el-card  v-loading="loading" shadow="hover">
          <el-row
            type="flex"
            justify="space-between"
            align="middle"
            :gutter="20"
          >
            <el-col>
              <p>评论</p>
              <h1>
                {{
                  d.commentCount
                    ? d.commentCount['article'] + d.commentCount['message']
                    : 0
                }}
              </h1>
            </el-col>
            <el-col class="tr">
              <h1 class="bgicon bgicon2 el-icon-s-comment"></h1>
            </el-col>
          </el-row>
        </el-card>
        <!-- <el-card  v-loading="loading" shadow="hover" class="mt2 bgcard2">
          <div class="df aic jcsb">
            <span>昨日新增</span>
            <span>2</span>
          </div>
          <div class="df ai jcsb mt2">
            <span>今日新增</span>
            <span>2</span>
          </div>
        </el-card> -->
      </el-col>
      <el-col :span="6">
        <el-card  v-loading="loading" shadow="hover">
          <el-row
            type="flex"
            justify="space-between"
            align="middle"
            :gutter="20"
          >
            <el-col>
              <p>用户</p>
              <h1>{{ d.userCount || 0 }}</h1>
            </el-col>
            <el-col class="tr">
              <h1 class="bgicon bgicon3 el-icon-user-solid"></h1>
            </el-col>
          </el-row>
        </el-card>
        <!-- <el-card  v-loading="loading" shadow="hover" class="mt2 bgcard3">
          <div class="df aic jcsb">
            <span>昨日新增</span>
            <span>2</span>
          </div>
          <div class="df ai jcsb mt2">
            <span>今日新增</span>
            <span>2</span>
          </div>
        </el-card> -->
      </el-col>
      <el-col :span="6">
        <el-card  v-loading="loading" shadow="hover">
          <el-row
            type="flex"
            justify="space-between"
            align="middle"
            :gutter="20"
          >
            <el-col>
              <p>浏览</p>
              <h1>{{ d.browseCount || 0 }}</h1>
            </el-col>
            <el-col class="tr">
              <h1 class="bgicon bgicon4 el-icon-s-open"></h1>
            </el-col>
          </el-row>
        </el-card>
        <!-- <el-card  v-loading="loading" shadow="hover" class="mt2 bgcard4">
          <div class="df aic jcsb">
            <span>昨日新增</span>
            <span>2</span>
          </div>
          <div class="df ai jcsb mt2">
            <span>今日新增</span>
            <span>2</span>
          </div>
        </el-card> -->
      </el-col>
    </el-row>
    <el-row :gutter="20" class="mt2">
      <el-col :span="14">
        <el-card  v-loading="loading" shadow="hover" class="bg-chart">
          <h2 class="m0">变化数据</h2>
          <div>
            <VeLine
              :data="growth"
              theme-name="dark"
              :init-options="{ theme: 'dark', backgroundColor: '#000' }"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card  v-loading="loading" shadow="hover" class="bg-chart">
          <h2 class="m0">历史数据</h2>
          <div>
            <VeHistogram
              :data="histoy"
              theme-name="dark"
              :init-options="{ theme: 'dark', backgroundColor: '#000' }"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="mt2">
      <el-col :span="8">
        <el-card  v-loading="loading" shadow="hover" class="bg-chart">
          <h2 class="m0">类别组成</h2>
          <div>
            <VeRing
              :data="tags"
              :settings="{
                radius: [90, 120],
              }"
              theme-name="dark"
              :init-options="{ theme: 'dark', backgroundColor: '#000' }"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card  v-loading="loading" shadow="hover" class="bg-chart">
          <h2 class="m0">会员组成</h2>
          <div>
            <VeRing
              :data="userTypes"
              :settings="{
                radius: [90, 120],
              }"
              theme-name="dark"
              :init-options="{ theme: 'dark', backgroundColor: '#000' }"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card  v-loading="loading" shadow="hover" class="bg-chart">
          <h2 class="m0">作者排行</h2>
          <div>
            <VeBar
              :data="author"
              :settings="{
                metrics: ['数据'],
                dataOrder: {
                  label: '数据',
                  order: 'desc',
                },
              }"
              theme-name="dark"
              :init-options="{ theme: 'dark', backgroundColor: '#000' }"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>

import VeLine from 'v-charts/lib/line.common'
import VeBar from 'v-charts/lib/bar.common'
import VeHistogram from 'v-charts/lib/histogram.common'
import VePie from 'v-charts/lib/pie.common'
import VeRing from 'v-charts/lib/ring.common'

export default {
  components: {
    VeLine, VeHistogram, VePie, VeRing,
    VeBar
  },
  data () {
    return {
      loading:false,
      d: {},
      growth: { columns: [], rows: [] },
      histoy: { columns: [], rows: [] },
      tags: { columns: [], rows: [] },
      userTypes: { columns: [], rows: [] },
      author: { columns: [], rows: [] },
    }
  },
  async created () {
    this.loading = true;
    const [, d] = await this.$http.websiteData();
    this.loading = false;

    this.d = d;

    const growth = {
      columns: ['日期', '评论', '留言', '浏览', '用户'],
      rows: []
    }

    const histoy = {
      columns: ['日期', '评论', '留言', '浏览', '用户'],
      rows: []
    }

    d.growthComment.forEach((g, index) => {
      const type = ['评论', '留言'][index];
      return g.forEach((item, index) => {
        growth.rows[index] = growth.rows[index] || {};
        growth.rows[index][type] = item.count;
        growth.rows[index]['日期'] = item.date;
      });
    });

    d.growthBrowse.forEach((item, index) => {
      growth.rows[index]['浏览'] = item.count;
    });

    d.growthUser.forEach((item, index) => {
      growth.rows[index]['用户'] = item.count;
    });

    growth.rows.reverse();

    this.growth = growth;



    d.historyComment.forEach((g, index) => {
      const type = ['评论', '留言'][index];
      return g.forEach((item, index) => {
        histoy.rows[index] = histoy.rows[index] || {};
        histoy.rows[index][type] = item.count;
        histoy.rows[index]['日期'] = item.date;
      });
    });

    d.historyBrowse.forEach((item, index) => {
      histoy.rows[index]['浏览'] = item.count;
    });

    d.historyUser.forEach((item, index) => {
      histoy.rows[index]['用户'] = item.count;
    });

    histoy.rows.reverse();

    this.histoy = histoy;


    const tags = {
      columns: ['类别', '数据'],
      rows: [],
    };

    d.tags.forEach((item, index) => {
      tags.rows[index] = tags.rows[index] || {};
      tags.rows[index]['类别'] = item.name;
      tags.rows[index]['数据'] = item.count;
    });

    tags.rows.reverse()

    this.tags = tags;


    const userTypes = {
      columns: ['标签', '数据'],
      rows: [],
    };

    d.userType.forEach((item, index) => {
      userTypes.rows[index] = userTypes.rows[index] || {};
      userTypes.rows[index]['标签'] = item.type;
      userTypes.rows[index]['数据'] = item.count;
    });

    userTypes.rows.reverse()

    this.userTypes = userTypes;

    const author = {
      columns: ['作者', '数据'],
      rows: [],
    };
    d.author.forEach((item, index) => {
      author.rows[index] = author.rows[index] || {};
      author.rows[index]['作者'] = item.username;
      author.rows[index]['数据'] = item.count;
    });

    author.rows.sort((a, b) => a.count < b.count ? -1 : 1)
    this.author = author;
  }

}
</script>
<style lang="scss" scoped>
.home {
  p {
    color: #555;
  }
  .bgicon {
    padding: 12px;
    border-radius: 50%;
    &.bgicon1 {
      color: #17ace4;
      background-color: rgba($color: #17ace4, $alpha: 0.2);
    }
    &.bgicon2 {
      color: #ffce15;
      background-color: rgba($color: #ffce15, $alpha: 0.2);
    }
    &.bgicon3 {
      color: #88147f;
      background-color: rgba($color: #88147f, $alpha: 0.2);
    }
    &.bgicon4 {
      color: #2aa515;
      background-color: rgba($color: #2aa515, $alpha: 0.2);
    }
  }
  .bgcard1 {
    background-color: #17ace4;
    color: #fff;
    border-color: #17ace4;
  }
  .bgcard2 {
    background-color: #ffce15;
    color: #fff;
    border-color: #ffce15;
  }
  .bgcard3 {
    background-color: #88147f;
    color: #fff;
    border-color: #88147f;
  }
  .bgcard4 {
    background-color: #2aa515;
    color: #fff;
    border-color: #2aa515;
  }
  .bg-chart {
    background-color: #333333;
    color: #fff;
  }
}
</style>