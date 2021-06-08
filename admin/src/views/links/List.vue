<template>
  <div class="_page p2 pt1">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item>友邻管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="table mt2">
      <div class="pb2">
        <el-button
          type="primary"
          @click="handleAdd"
          size="small"
          v-if="$permissions('CreateTag')"
        >添加</el-button>
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
          prop="logo"
          header-align="center"
          align="center"
          show-overflow-tooltip
          label="Logo"
          max-width="320"
        >
          <template slot-scope="prop">
            <img :src="prop.row.logo" style="max-width:40px;max-height:40px" />
          </template>
        </el-table-column>

        <el-table-column
          prop="title"
          header-align="center"
          show-overflow-tooltip
          label="标题"
          max-width="320"
        ></el-table-column>
        <el-table-column
          prop="intro"
          header-align="center"
          show-overflow-tooltip
          label="简介"
          max-width="320"
        ></el-table-column>

        <el-table-column
          prop="url"
          header-align="center"
          show-overflow-tooltip
          label="url"
          max-width="320"
        ></el-table-column>

        <el-table-column prop="createdAt" label="创建时间" width="160" align="center">
          <template slot-scope="scope">{{filter_format(scope.row.createdAt)}}</template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="160" align="center">
          <template slot-scope="scope">{{filter_format(scope.row.updatedAt)}}</template>
        </el-table-column>

        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <el-button
              size="mini"
              plain
              @click="handleEdit(scope.row)"
              v-if="$permissions('UpdateLink')"
            >修改</el-button>
            <el-button
              size="mini"
              plain
              type="danger"
              @click="handleDelete(scope.row)"
              v-if="$permissions('DeleteLink')"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="友邻操作" :visible.sync="dialogFormVisible" width="30%">
      <div class="tc" v-if="current">
        <el-form ref="form" :model="current" label-width="100px">
          <el-form-item label="友邻标题">
            <el-input v-model="current.title" placeholder="请输入友邻标题"></el-input>
          </el-form-item>

          <el-form-item label="友邻简介">
            <el-input v-model="current.intro" placeholder="请输入友邻简介"></el-input>
          </el-form-item>

          <el-form-item label="友邻链接">
            <el-input v-model="current.url" placeholder="请输入友邻链接"></el-input>
          </el-form-item>
          <el-form-item label="友邻LOGO">
            <el-upload
              action="#"
              accept="image/*"
              :limit="1"
              list-type="picture-card"
              :on-remove="handleRemoveImg"
              :file-list="itemImgList"
              :before-upload="handleUpload"
              :http-request="handleUploadRequest"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
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
  data () {
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
    itemImgList () {
      const item = this.current;
      const list = [];

      if (item && item.logo) {
        list.push({
          name: item.logo,
          url: item.logo
        });
      }
      return list;
    }
  },
  created () {
    this.loadData();
  },
  filters: {},
  methods: {
    async loadData () {
      this.loading = true;
      const [, data] = await this.$http.linksList();
      this.loading = false;
      // this.tableData = data;
      this.tableData = data;
      // this.total = data.total;
    },
    handleSearch () {
      // const keyword;
      this.page_index = 1;
      this.loadData();
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`);
      this.page_size = val;
      this.loadData();
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`);
      this.page_index = val;
      this.loadData();
    },
    handleRemoveImg (e) {
      console.log('e', e);
    },
    async handleUpload (file) {
      if (!file) return;
      const fd = new FormData();
      fd.append('file', file);
      const [, data] = await this.$http.uploadImage(fd);
      console.log('resData', data);
      this.current.logo = 'https:' + data;
      return this.current.logo;
    },
    handleUploadRequest () {
    },
    handleEdit (item) {
      this.dialogFormVisible = true;
      this.current = { ...item };
    },
    handleAdd () {
      this.dialogFormVisible = true;
      this.current = {
        title: "",
        logo: '',
        intro: "",
        url: "",
      };
    },
    async handleDelete (item) {

      await this.$confirm('是否删除标签' + '“' + item.title + '”？');
      const [err, data] = await this.$http.linkDelete(item._id);
      if (data) {
        this.$notify.success({ title: '删除成功' });
        this.loadData();
      }
    },
    async handleChangeRoleCofirm () {
      const item = { ...this.current };
      item.type = 0;
      const reqData = item;
      this.changStatusLoading = true;
      const id = this.current._id;
      let err, data;
      if (id) {
        [err, data] = await this.$http.linkUpdate(id, reqData);
      } else {
        [err, data] = await this.$http.linkCreate(reqData);
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