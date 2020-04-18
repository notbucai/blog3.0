<template>
  <div class="_page p2 pt1">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="table mt2">
      <div class="pb2">
        <el-button type="primary" @click="handleAdd" size="small" v-if="$permissions('CreateTag')">添加</el-button>
      </div>
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

        <el-table-column
          prop="iconURL"
          header-align="center"
          show-overflow-tooltip
          label="图标"
          max-width="320"
        ></el-table-column>

        <el-table-column
          prop="name"
          header-align="center"
          show-overflow-tooltip
          label="名称"
          max-width="320"
        ></el-table-column>

        <el-table-column prop="createdAt" label="创建时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.createdAt | format}}</template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.updatedAt | format}}</template>
        </el-table-column>

        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <el-button size="mini" plain @click="handleEdit(scope.row)" v-if="$permissions('UpdateTag')">修改</el-button>
            <el-button size="mini" plain type="danger" @click="handleDelete(scope.row)" v-if="$permissions('DeleteTag')">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="文章状态设置" :visible.sync="dialogFormVisible" width="30%">
      <div class="tc" v-if="current">
        <el-form ref="form" :model="current" label-width="80px">
          <el-form-item label="标签名">
            <el-input v-model="current.name" placeholder="请输入tag名称"></el-input>
          </el-form-item>

          <el-form-item label="标签图标">
            <el-input v-model="current.iconURL" placeholder="请输入tag icon"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
        <el-button
          type="primary"
          @click="handleChangeRoleCofirm"
          size="small"
          :loading="changStatusLoading"
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
      currentRadio: 1,
      changStatusLoading: false,
      total: 0,
      page_size: 10,
      page_index: 1,
      loading: true,
      keyword: '',
      source: 'message',
      // TODO: 后期通过接口获取
      sources: [
        {
          label: '留言',
          value: 'message'
        },
        {
          label: '文章',
          value: 'article'
        }
      ]
    };
  },
  computed: {
    ...mapState(['user'])
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
      const [, data] = await this.$http.tagList(query);
      this.loading = false;
      // this.tableData = data;
      this.tableData = data;
      // this.total = data.total;
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
    handleEdit(item) {
      this.dialogFormVisible = true;
      this.current = { ...item };
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.current = {
        iconURL: '',
        name: ''
      };
    },
    async handleDelete(item) {

      await this.$confirm('是否删除标签' + '“' + item.name + '”？');
      const [err, data] = await this.$http.tagDelete(item._id);
      if (data) {
        this.$notify.success({ title: '删除成功' });
        this.loadData();
      }
    },
    async handleChangeRoleCofirm() {
      const { iconURL, name } = this.current;
      if (!name) {
        return this.$message.error('标签名不能为空');
      }
      const reqData = {
        name,
        iconURL
      };
      this.changStatusLoading = true;
      const id = this.current._id;
      let err, data;
      if (id) {
        [err, data] = await this.$http.tagEdit(id, reqData);
      } else {
        [err, data] = await this.$http.tagCreate(reqData);
      }

      this.changStatusLoading = false;
      if (err) return;
      this.dialogFormVisible = false;
      this.$notify.success({ title: (id ? '修改' : '增加') + '成功' });
      // this.tableData = [...this.tableData];
      this.loadData();
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