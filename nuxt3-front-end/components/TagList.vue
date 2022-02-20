<template>
  <div class="TagList">
    <v-container fluid class="my-1">
      <v-row justify="space-between" align="center">
        <div class="title">标签</div>
      </v-row>
    </v-container>
    <v-card class="mx-auto mb-6 pa-2">
      <NuxtLink
        :to="`/tag/${item.name}`"
        class="tag-item-link"
        v-for="(item, index) in taglist"
        :key="index"
      >
        <v-chip class="ma-2" label>
          <v-icon left small>{{ 'mdi-' + item.iconURL }}</v-icon>
          {{ item.name }}
        </v-chip>
      </NuxtLink>
    </v-card>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    taglist: {
      type: Array,
      required: true
    }
  },
  computed: {},
  data () {
    return {};
  },
  created () { },
  mounted () { },
  methods: {}
};
</script>
<style lang="scss" scoped>
.TagList {
}
</style>