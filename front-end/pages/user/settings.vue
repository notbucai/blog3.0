<template>
  <v-container>
    <!-- tab -->
    <v-tabs :value="tabIndex" color="primary" optional slider-color="primary">
      <v-tab v-for="item in tabRoutes" :key="item.route" nuxt :to="item.path">{{item.name}}</v-tab>
    </v-tabs>
    <!-- router -->
    <v-row>
      <v-col :md="9" :sm="12">
        <nuxt-child />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  middleware: 'auth',
  components: {},
  computed: {
    tabIndex () {
      return 1;
    }
  },
  data () {
    return {
      tabRoutes: [
        {
          path: '/user/settings/profile',
          name: "个人资料"
        },
        {
          path: '/user/settings/account',
          name: "账号关联"
        }
      ]
    };
  },

  mounted () { },
  methods: {
  }
};
</script>
<style lang="scss" scoped>
.edit {
}
</style>