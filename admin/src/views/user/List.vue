<template>
  <div class="_page p2 pt1">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="table mt2">
      <el-input
        placeholder="请输入内容"
        size="small"
        clearable
        v-model="keyword"
        class="search_input mb2"
      >
        <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
      </el-input>

      <el-table
        :data="tableData"
        v-loading="loading"
        border
        style="width: 100%"
        size="small"
        cell-class-name="p0"
      >
        <el-table-column
          prop="_id"
          header-align="center"
          show-overflow-tooltip
          label="ID"
          max-width="200"
        ></el-table-column>
        <el-table-column prop="avatarURL" label="头像" width="80" align="center">
          <template slot-scope="scope">
            <el-image
              class="avatarURL"
              v-if="scope.row.avatarURL"
              :src="scope.row.avatarURL+'?imageMogr2/thumbnail/60x'"
            ></el-image>
          </template>
        </el-table-column>
        <!-- avatarURL -->
        <el-table-column
          prop="username"
          label="用户名"
          max-width="240"
          show-overflow-tooltip
          header-align="center"
        ></el-table-column>
        <el-table-column prop="phone" show-overflow-tooltip label="手机号" width="100" align="center"></el-table-column>
        <el-table-column
          prop="email"
          show-overflow-tooltip
          label="邮箱"
          max-width="260"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="githubLogin"
          show-overflow-tooltip
          label="GitHub"
          max-width="260"
          align="center"
        ></el-table-column>
        <el-table-column prop="sex" show-overflow-tooltip label="性别" width="60" align="center">
          <template slot-scope="scope">{{scope.row.sex | sex}}</template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.createdAt | format}}</template>
        </el-table-column>
        <el-table-column prop="activatedAt" label="激活时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.createdAt | format}}</template>
        </el-table-column>
        <el-table-column prop="status" show-overflow-tooltip label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 1" type="info">未激活</el-tag>
            <el-tag v-if="scope.row.status == 2" type="success">已激活</el-tag>
            <el-tag v-if="scope.row.status == 3" type="danger">已冻结</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="role" show-overflow-tooltip label="状态" width="120" align="center">
          <template slot-scope="scope">
            <el-tag type="info">{{scope.row.role | role}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <el-button
              size="mini"
              :disabled="scope.row.role === 4"
              @click="handleChangeRole(scope.row)"
            >权限</el-button>
            <el-button
              size="mini"
              type="danger"
              v-if="scope.row.status == 2"
              @click="handleChangeStatus(scope.row)"
            >冻结</el-button>
            <el-button size="mini" type="danger" v-else @click="handleChangeStatus(scope.row)">激活</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        layout="total, sizes, prev, pager, next"
        :page-size="page_size"
        :total="total"
        class="mt2"
      ></el-pagination>
    </div>

    <el-dialog title="权限设置" :visible.sync="dialogFormVisible" width="30%">
      <div class="tc">
        <div class="pb2 fb" v-if="current">设置“{{current.username}}”的权限</div>
        <el-radio-group v-model="roleRadio" size="small">
          <el-radio-button :label="index+1" v-for="(item, index) in roleList" :key="index">{{item}}</el-radio-button>
        </el-radio-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
        <el-button
          type="primary"
          @click="handleChangeRoleCofirm"
          size="small"
          :loading="roleLoading"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      current: null,
      dialogFormVisible: false,
      tableData: [],
      // roleList: ['普通用户', '网站编辑', '管理员'],
      roleRadio: 1,
      roleLoading: false,
      total: 0,
      page_size: 10,
      page_index: 1,
      loading: true,
      keyword: ''
    };
  },
  computed: {
    ...mapState(['user']),
    roleList() {
      const role = this.user.role;
      return ['普通用户', '网站编辑', '管理员'].filter(
        (item, index) => index < role
      );
    }
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
      let id = item._id;
      if (item.status === 2) {
        // 冻结
        msg = '冻结';
        status = 3;
      }
      await this.$confirm('是否' + msg + '“' + item.username + '”？');
    },
    handleChangeRole(item) {
      console.log(item);
      this.current = item;
      this.roleRadio = item.role || 1;
      this.dialogFormVisible = true;
    },
    async handleChangeRoleCofirm() {
      const id = this.current._id;
      const role = this.roleRadio;
      this.roleLoading = true;
      const [err, data] = await this.$http.changeRole({ id, role });
      this.roleLoading = false;
      this.dialogFormVisible = false;
      if (err) {
        return;
      }
      this.$notify.success({ title: '修改成功' });
      this.current.role = this.roleRadio;
      this.current = null;
      // TODO: 以后有空再改
      this.tableData = [...this.tableData];
    }
  }
};
</script>

<style lang="scss" scoped>
.table {
  .avatarURL {
    width: 32px;
    height: 32px;
  }
  .search_input {
    width: 400px;
  }
}
</style>