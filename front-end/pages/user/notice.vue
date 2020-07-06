<template>
  <v-container>
    <!-- tab -->
    <v-tabs :value="tabIndex" color="primary" optional slider-color="primary">
      <v-tab v-for="item in tabRoutes" :key="item.path">{{item.name}}</v-tab>
    </v-tabs>
    <!-- router -->
    <v-row>
      <v-col :md="9" :sm="12" :cols="12" v-show="tabIndex == '1'">
        <v-card>123</v-card>
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
      return 0;
    }
  },
  data () {
    return {
      tabRoutes: [
        {
          path: '1',
          name: "用户消息"
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