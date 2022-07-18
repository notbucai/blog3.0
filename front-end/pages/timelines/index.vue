<template>
  <v-container class="content-container timelines">
    <v-timeline large>
      <template v-for="item in years" transition="scale-transition">
        <div :key="item.id">
          <v-timeline-item large class="white--text mb-12" color="deep-orange darken-1">
            <template v-slot:icon>
              <span class="text-darken-1">{{ item.id }}</span>
            </template>
          </v-timeline-item>

          <v-timeline-item
            :key="item.id"
            v-if="!timelines[item.id] && item.count"
            class="mb-4"
          >
            <template v-slot:icon>
              <v-btn
                icon
                @click="handleLoadCurrentYear(item.id)"
                :loading="loading"
                :disabled="loading"
              >
                <v-icon color="white">{{
                  $icons['mdi-dots-horizontal']
                }}</v-icon>
              </v-btn>
            </template>
          </v-timeline-item>

          <v-lazy
            :value="$isServer"
            transition="scale-transition"
            min-height="120"
            v-for="(article, index) in timelines[item.id]"
            :key="article.id"
          >
            <v-timeline-item color="green lighten-1" small :left="!(index % 2)">
              <template v-slot:opposite>
                <span>{{ article.time }}</span>
              </template>
              <v-card elevation="0" :href="`/article/${article.id}`">
                <v-card-title>
                  <h4>{{ article.title }}</h4>
                </v-card-title>
                <v-card-subtitle
                  v-if="article.user"
                  class="d-flex align-center"
                >
                  <v-avatar size="16" color="white">
                    <img
                      :src="article.user.avatarUrl | imageMogr2(16)"
                      :alt="article.user.username"
                    />
                  </v-avatar>
                  <span class="ml-2">{{ article.user.username }}</span>
                </v-card-subtitle>
                <v-card-text>
                  {{ article.summary }}
                </v-card-text>
              </v-card>
            </v-timeline-item>
          </v-lazy>
        </div>
      </template>
    </v-timeline>
  </v-container>
</template>
<script>
export default {
  head () {
    return {
      title: '时间轴'
    }
  },
  async asyncData ({ $axios }) {

    const years = await $axios.get('/api/article/years');
    const year = years.find(item => item.count);
    const list = await $axios.get(`/api/article/year/list/${year.id}`);

    return {
      years,
      timelines: {
        [year.id]: list
      }
    };
  },
  data () {
    return {
      years: [],
      timelines: {},
      loading: false,
    };
  },
  created () {
  },
  methods: {
    async handleLoadCurrentYear (year) {
      try {
        this.loading = true;
        const list = await this.$axios.get(`/api/article/year/list/${year}`);
        this.$set(this.timelines, year, list);
      } catch (e) {
        console.log(e);
      }
      this.loading = false;
    }
  }
}
</script>
<style lang="scss" scoped>
.timelines {
}
</style>