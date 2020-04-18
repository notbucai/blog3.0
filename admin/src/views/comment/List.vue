<template>
  <div class="_page p2 pt1">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item>评论管理</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="table mt2">
      <div>
        <el-select v-model="source" size="small" class="pr1" placeholder="请选择" @change="loadData">
          <el-option
            v-for="item in sources"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input
          placeholder="请输入内容"
          size="small"
          clearable
          v-model="keyword"
          class="search_input mb2"
        >
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
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
          prop="sourceID"
          header-align="center"
          show-overflow-tooltip
          label="sourceID"
          max-width="200"
        ></el-table-column>

        <el-table-column
          prop="parent"
          header-align="center"
          show-overflow-tooltip
          label="parent"
          max-width="200"
        ></el-table-column>

        <el-table-column
          prop="user"
          align="center"
          show-overflow-tooltip
          label="作者"
          max-width="100"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.user">{{scope.row.user.username}}</div>
          </template>
        </el-table-column>

        <el-table-column
          prop="htmlContent"
          header-align="center"
          show-overflow-tooltip
          label="内容"
          max-width="320"
        ></el-table-column>

        <el-table-column prop="createdAt" label="创建时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.createdAt | format}}</template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.updatedAt | format}}</template>
        </el-table-column>

        <el-table-column prop="status" show-overflow-tooltip label="状态" width="120" align="center">
          <template slot-scope="scope">
            <el-tag type="info">{{scope.row.status | articleStatus}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <el-button
              size="mini"
              plain
              @click="handleChangeStatus(scope.row)"
              v-if="$permissions('ChangeCommentStatus')"
            >改变状态</el-button>
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

    <el-dialog title="文章状态设置" :visible.sync="dialogFormVisible" width="30%">
      <div class="tc">
        <div class="pb2 fb" v-if="current">设置“{{current.title}}”的状态</div>
        <el-radio-group v-model="currentRadio" size="small">
          <el-radio-button
            :label="index+1"
            v-for="(item, index) in statusList"
            :key="index"
          >{{item}}</el-radio-button>
        </el-radio-group>
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
    ...mapState(['user']),

    statusList() {
      return ['审核中', '审核通过', '审核未通过'];
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
      const [, data] = await this.$http.commentList(this.source, query);
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
    handleChangeStatus(item) {
      this.dialogFormVisible = true;
      this.currentRadio = item.status || 1;
      this.current = item;
    },
    async handleChangeRoleCofirm() {
      this.changStatusLoading = true;
      // TODO: 发送AJAX
      const id = this.current._id;
      const status = this.currentRadio;
      const [err, data] = await this.$http.changeCommentStatus(
        this.source,
        id,
        { status }
      );
      this.dialogFormVisible = false;
      if (err) return;
      this.changStatusLoading = false;
      this.$notify.success({ title: '修改成功' });
      this.current.status = status;
      this.current = null;
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