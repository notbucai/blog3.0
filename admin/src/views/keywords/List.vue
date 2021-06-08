<template>
  <div class="_page p2 pt1">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item>词云管理</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="table mt2">
      <el-table
        :data="tableData.list"
        v-loading="tableLoading"
         v-if="$permissions('KeywordPageList')"
        border
        style="width: 100%"
        size="small"
        cell-class-name="p0"
        @sort-change="onSortChange"
      >
        <el-table-column
          prop="_id"
          header-align="center"
          show-overflow-tooltip
          label="ID"
          max-width="200"
        ></el-table-column>
        <el-table-column
          prop="value"
          header-align="center"
          show-overflow-tooltip
          label="词名"
          align="center"
          max-width="200"
        ></el-table-column>

        <el-table-column
          prop="count"
          header-align="center"
          show-overflow-tooltip
          label="数量"
          align="center"
          max-width="100"
          sortable="custom"
        ></el-table-column>

        <el-table-column
          prop="createdAt"
          label="创建时间"
          width="160"
          align="center"
          sortable="custom"
        >
          <template slot-scope="scope">{{
            filter_format(scope.row.createdAt)
          }}</template>
        </el-table-column>
        <el-table-column
          prop="updatedAt"
          label="更新时间"
          width="160"
          align="center"
          sortable="custom"
        >
          <template slot-scope="scope">{{
            filter_format(scope.row.updatedAt)
          }}</template>
        </el-table-column>

        <el-table-column
          prop="status"
          show-overflow-tooltip
          label="状态"
          width="120"
          align="center"
          sortable="custom"
        >
          <template slot-scope="scope">
            <el-tag
              :type="['danger', '', 'success'][(scope.row.status || 0) + 1]"
              >{{ filter_KeywordsStatus(scope.row.status) }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <el-button
              size="mini"
              plain
              class="mr2"
              @click="handleChangeStatus(scope.row)"
              v-if="$permissions('KeywordChangeItemStatusById')"
              >改变状态</el-button
            >
            <el-popconfirm
              title="确定删除吗？"
              @onConfirm="onChangeItemRemove(scope.row)"
              v-if="$permissions('KeywordRemoveItemById')"
            >
              <el-button size="mini" type="danger" slot="reference"
                >删除</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        layout="total, sizes, prev, pager, next"
        :page-size="tableReqData.page_size"
        :current-page="tableReqData.page_index"
        :total="tableData.total"
        class="mt2"
      ></el-pagination>
    </div>
    <ChangeStatusDialog ref="ChangeStatusDialog" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import ChangeStatusDialog from './components/ChangeStatusDialog';

export default {
  components: {
    ChangeStatusDialog
  },
  data () {
    return {
    };
  },
  computed: {
    ...mapState({
      tableData: state => state.keywords.tableData,
      tableReqData: state => state.keywords.tableReqData,
      tableLoading: state => state.keywords.tableLoading,
    }),

    statusList () {
      return ['审核中', '审核通过', '审核未通过'];
    }
  },
  created () {
    this.loadData();
  },
  filters: {},
  methods: {
    ...mapActions('keywords', ['handleLoadTableData', 'handleChangeTablePage', 'handleChangeItemStatus', 'handleItemRemove', 'handleInitTask']),
    async loadData () {
      this.handleLoadTableData();
    },
    handleSearch () {
      // const keyword;
      this.page_index = 1;
      this.loadData();
    },
    onSortChange ({ prop, order }) {
      console.log('prop', prop);
      this.handleChangeTablePage({
        page_index: 1,
        ['sort_' + prop]: {
          descending: -1,
          ascending: 1
        }[order] || 0
      });
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`);
      this.handleChangeTablePage({
        page_index: this.tableReqData.page_index,
        page_size: val,
      });
    },
    handleCurrentChange (val) {
      this.handleChangeTablePage({
        page_index: val,
        page_size: this.tableReqData.page_size,
      });
    },
    handleChangeStatus (item) {
      this.$refs['ChangeStatusDialog'].open(item);
    },
    async onChangeItemRemove (item) {
      await this.handleItemRemove(item._id);
      this.$notify.success({ title: '删除成功' });
      this.loadData();
    },
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