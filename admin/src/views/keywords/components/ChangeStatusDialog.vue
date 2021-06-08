<template>
  <el-dialog title="状态设置" :visible.sync="dialogFormVisible" width="30%">
    <div class="tc">
      <div class="pb2 fb" v-if="current">设置“{{ current.value }}”的状态</div>
      <el-radio-group v-model="currentRadio" size="small">
        <el-radio-button
          :label="item.value"
          v-for="item in statusList"
          :key="item.value"
          >{{ item.label }}</el-radio-button
        >
      </el-radio-group>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false" size="small"
        >取 消</el-button
      >
      <el-button
        type="primary"
        @click="handleChangeRoleCofirm"
        size="small"
        :loading="changStatusLoading"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import { mapActions, mapState } from 'vuex';

export default {
  data () {
    return {
      dialogFormVisible: false,
      current: null,
      currentRadio: null,
      changStatusLoading: false,
    };
  },
  computed: {
    ...mapState({
      statusList: state => state.keywords.statusList,
    })
  },
  created () {
  },
  methods: {
    ...mapActions('keywords', ['handleChangeItemStatus', 'handleLoadTableData']),
    open (data) {
      console.log('data',data);
      this.current = data;
      this.currentRadio = data.status;
      this.dialogFormVisible = true;
    },
    async handleChangeRoleCofirm () {
      // handleChangeItemStatus
      await this.handleChangeItemStatus({
        id: this.current._id,
        status: this.currentRadio
      });
      this.$notify.success({ title: '改变状态成功' });
      this.dialogFormVisible = false;
      this.handleLoadTableData();
    }
  }
}
</script>
<style lang="scss" scoped>
.ChangeStatusDialog {
}
</style>