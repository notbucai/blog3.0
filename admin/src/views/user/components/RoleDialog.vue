<template>
  <el-dialog title="权限设置" :visible.sync="dialogFormVisible" width="30%">
    <div class="tc">
      <div class="pb2 fb" v-if="current">
        设置“{{ current.username }}”的角色
      </div>
      <el-select
        v-model="roleId"
        value-key=""
        placeholder="输入关键词进行搜索"
        clearable
        filterable
        remote
        reserve-keyword
        :remote-method="loadRoleData"
        :loading="loadRoleing"
      >
        <el-option
          v-for="item in roles"
          :key="item._id"
          :label="item.name"
          :value="item._id"
        >
        </el-option>
      </el-select>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false" size="small"
        >取 消</el-button
      >
      <el-button
        type="primary"
        @click="handleChangeRoleCofirm"
        size="small"
        :loading="roleLoading"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
  },
  data () {
    return {
      roleId: '',
      current: {},
      roleLoading: false,
      loadRoleing: false,
      roles: [],
      dialogFormVisible: false,
    };
  },
  created () {
    this.loadRoleData();
  },
  methods: {

    open (current) {
      this.loadRoleing = false;
      this.roleLoading = false;
      this.dialogFormVisible = true;
      this.current = current;
      this.roleId = current.role && current.role._id ? current.role._id : ''
    },
    async loadRoleData (keyword) {
      this.loadRoleing = true;
      const query = {
        page_size: 10,
        page_index: 1,
        keyword: keyword
      };
      const [, data] = await this.$http.roleList(query);
      this.loadRoleing = false;
      this.roles = data.list;
      // this.tableData = data;
    },
    async handleChangeRoleCofirm () {
      const id = this.current._id;
      const role = this.roleId;
      this.roleLoading = true;
      const [err, data] = await this.$http.changeRole({ id, role });
      this.roleLoading = false;
      this.dialogFormVisible = false;
      if (err) {
        return;
      }
      this.$notify.success({ title: '修改成功' });
      this.$emit('success');
    }
  }
}
</script>
<style lang="scss" scoped>
.RoleDialog {
}
</style>