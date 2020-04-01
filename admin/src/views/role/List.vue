<template>
  <div class="_page p2 pt1">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="table mt2">
      <div class="pb2">
        <el-button type="primary" @click="handleAdd" size="small">添加</el-button>
      </div>
      <el-table
        :data="tableData"
        v-loading="loading"
        border
        style="width: 100%"
        size="small"
        cell-class-name="p0"
        @expand-change="expandChange"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <div>
              <!-- closable -->
              <el-tag
                type="success"
                class="mr1 mb1"
                v-for="(item, index) in props.row.acls"
                :key="index"
              >{{item.title}}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="_id"
          header-align="center"
          show-overflow-tooltip
          label="ID"
          max-width="200"
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
            <el-button size="mini" plain @click="handleEdit(scope.row)">修改</el-button>
            <el-button size="mini" plain type="danger" @click="handleDelete(scope.row)">删除</el-button>
            <el-button size="mini" type="text" @click="handleBindAcl(scope.row)">绑定权限</el-button>
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

    <el-dialog title="修改" :visible.sync="dialogFormVisible" width="30%">
      <div class="tc" v-if="current">
        <el-form ref="form" :model="current" label-width="80px">
          <el-form-item label="角色名">
            <el-input v-model="current.name" placeholder="请输入角色名称"></el-input>
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

    <el-drawer :visible.sync="drawer" :before-close="handleClose" :show-close="false">
      <h3 slot="title">权限绑定</h3>
      <div class="pl2 pr2">
        <el-tree
          :data="currentAclTree"
          show-checkbox
          default-expand-all
          node-key="_id"
          class="mb3"
          ref="tree"
          highlight-current
          :props="defaultProps"
          check-strictly
          :default-checked-keys="currentAclIds"
        ></el-tree>
        <el-button type="primary" @click="handleBindAclConfirm" size="mini">绑定</el-button>
        <el-button @click="handleClose" size="mini">取消</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      drawer: false,
      current: null,
      dialogFormVisible: false,
      tableData: [],
      constAclTree: [],
      currentAclTree: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      currentRadio: 1,
      changStatusLoading: false,
      total: 0,
      page_size: 10,
      page_index: 1,
      loading: true,
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
    ...mapState(['user']),
    currentAclIds() {
      if (!this.current || !this.current.acls) return [];
      return this.current.acls.map(item => item._id);
    }
  },
  created() {
    this.loadData();
  },
  filters: {},
  methods: {
    async loadData() {
      this.loading = true;
      const { page_size, page_index } = this;
      const query = {
        page_size,
        page_index
      };
      const [, data] = await this.$http.roleList(query);
      this.loading = false;
      this.tableData = data.list;
      // this.tableData = data;
      this.total = data.total;
    },
    handleSearch() {
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
    expandChange(row, expanded) {
      console.log(row, expanded);
      if (expanded.length) {
        // 展开
      }
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
    async handleBindAcl(item) {
      this.drawer = true;
      this.current = item;
      const [err, tree] = await this.$http.roleAcl();
      console.log(tree);
      this.constAclTree = tree;
      this.currentAclTree = tree;
    },
    async handleDelete(item) {
      await this.$confirm('是否删除' + '“' + item.name + '”？');
      const [err, data] = await this.$http.roleDelete(item._id);
      if (data) {
        this.$notify.success({ title: '删除成功' });
        this.loadData();
      }
    },
    async handleChangeRoleCofirm() {
      const { name } = this.current;
      if (!name) {
        return this.$message.error('名称不能为空');
      }
      const reqData = {
        name
      };
      this.changStatusLoading = true;
      const id = this.current._id;
      let err, data;
      if (id) {
        [err, data] = await this.$http.roleUpdate(id, reqData);
      } else {
        [err, data] = await this.$http.roleCreate(reqData);
      }

      this.changStatusLoading = false;
      if (err) return;
      this.dialogFormVisible = false;
      this.$notify.success({ title: (id ? '修改' : '增加') + '成功' });
      // this.tableData = [...this.tableData];
      this.loadData();
    },
    handleClose(done) {
      this.drawer = false;
    },
    async handleBindAclConfirm() {
      const nodes = this.$refs.tree.getCheckedNodes();
      const keys = Array.from(
        new Set(nodes.map(item => [item.parent, item._id]).flat(2))
      ).filter(item => item);
      const id = this.current._id;
      const [err, data] = await this.$http.roleBind(id, {
        acls: keys
      });
      if (!err) {
        this.drawer = false;
        this.current = null;
        this.$notify.success({ title: '绑定成功' });
        this.loadData();
        return;
      }
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