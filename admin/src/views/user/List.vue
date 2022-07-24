<template>
  <div class="_page p2 pt1">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="table mt2">
      <el-input placeholder="请输入内容" size="small" clearable v-model="keyword" class="search_input mb2">
        <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
      </el-input>

      <el-table :data="tableData" v-loading="loading" border style="width: 100%" size="small" cell-class-name="p0">
        <el-table-column prop="id" header-align="center" show-overflow-tooltip label="ID" max-width="200">
        </el-table-column>
        <el-table-column prop="avatarUrl" label="头像" width="80" align="center">
          <template slot-scope="scope">
            <el-image class="avatarUrl" v-if="scope.row.avatarUrl" :src="filter_imageMogr2(scope.row.avatarUrl, 60)">
            </el-image>
          </template>
        </el-table-column>
        <!-- avatarUrl -->
        <el-table-column prop="username" label="用户名" max-width="240" show-overflow-tooltip header-align="center">
        </el-table-column>
        <el-table-column prop="phone" show-overflow-tooltip label="手机号" width="100" align="center"></el-table-column>
        <el-table-column prop="email" show-overflow-tooltip label="邮箱" max-width="260" align="center"></el-table-column>
        <el-table-column prop="sex" show-overflow-tooltip label="性别" width="60" align="center">
          <template slot-scope="scope">{{
              filter_sex(scope.row.sex)
          }}</template>
        </el-table-column>
        <el-table-column prop="loginAt" label="登陆时间" width="160" align="center">
          <template slot-scope="scope">{{
              filter_format(scope.row.loginAt)
          }}</template>
        </el-table-column>
        <el-table-column prop="activatedAt" label="激活时间" width="160" align="center">
          <template slot-scope="scope">{{
              filter_format(scope.row.createAt)
          }}</template>
        </el-table-column>
        <el-table-column prop="createAt" label="创建时间" width="160" align="center">
          <template slot-scope="scope">{{
              filter_format(scope.row.createAt)
          }}</template>
        </el-table-column>
        <el-table-column prop="status" show-overflow-tooltip label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 'InActive'" type="info" size="mini">未激活</el-tag>
            <el-tag v-if="scope.row.status == 'Actived'" type="success" size="mini">已激活</el-tag>
            <el-tag v-if="scope.row.status == 'Frozen'" type="danger" size="mini">已冻结</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="role" show-overflow-tooltip label="角色" width="120" align="center">
          <template slot-scope="scope">
            <el-tag type="info" size="mini" v-for="item in scope.row.userRoles" :key="item.id">{{
                item.role.name
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <div v-if="!(scope.row.role === 4)">
              <el-button size="mini" @click="handleChangeRole(scope.row)" v-if="$permissions('BindRole')">角色</el-button>
              <!-- :disabled="scope.row.role === 4" -->
              <template v-if="$permissions('ChangeStatus')">
                <el-button size="mini" type="danger" v-if="scope.row.status == 'Actived'"
                  @click="handleChangeStatus(scope.row)">冻结</el-button>
                <el-button size="mini" type="success" v-else @click="handleChangeStatus(scope.row)">激活</el-button>
              </template>
            </div>
            <div v-else>禁止操作</div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background
        layout="total, sizes, prev, pager, next" :page-size="page_size" :total="total" class="mt2"></el-pagination>
    </div>
    <RoleDialog v-if="$permissions('BindRole')" @success="handleChangeRoleSuccess" ref="RoleDialog" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import RoleDialog from './components/RoleDialog.vue';

export default {
  components: { RoleDialog },
  data() {
    return {
      current: null,
      dialogFormVisible: false,
      tableData: [],
      // roleList: ['普通用户', '网站编辑', '管理员'],
      total: 0,
      page_size: 10,
      page_index: 1,
      loading: true,
      keyword: ''
    };
  },
  computed: {
    ...mapState(['user'])
    // roleList() {
    //   const role = this.user.isAdmin;
    //   return
    // }
  },
  created() {
    this.loadData();
  },
  filters: {},
  methods: {
    async loadData() {
      this.loading = true;
      const { page_size, page_index, keyword } = this;
      const query = {
        page_size,
        page_index
      };
      if (keyword) {
        query.keyword = keyword;
      }
      const [, data] = await this.$http.userlist(query);
      this.loading = false;
      // this.tableData = data;
      this.tableData = data.list;
      this.total = data.total;
    },
    handleSearch() {
      // const keyword;
      this.page_index = 1;
      this.loadData();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.page_size = val;
      this.loadData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page_index = val;
      this.loadData();
    },
    async handleChangeStatus(item) {
      console.log(item);
      // TODO: 激活解冻
      let msg = '激活';
      let status = 2;
      let id = item.id;
      if (item.status === 2) {
        // 冻结
        msg = '冻结';
        status = 3;
      }
      await this.$confirm('是否' + msg + '“' + item.username + '”？');
      const [err, data] = await this.$http.changeUserStatus(item.id, {
        status
      });
      if (err) {
        return;
      }
      this.$notify.success({ title: '操作成功' });
      item.status = status;
      // TODO: 以后有空再改
      this.tableData = [...this.tableData];
    },
    handleChangeRole(item) {
      console.log(item);
      this.current = item;
      this.roleRadio = item.role || 1;
      this.dialogFormVisible = true;
      this.$refs['RoleDialog'].open(item);
    },
    handleChangeRoleSuccess() {
      this.loadData();
    }
  }
};
</script>

<style lang="scss" scoped>
.table {
  .avatarUrl {
    width: 32px;
    height: 32px;
  }

  .search_input {
    width: 400px;
  }
}
</style>