<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 20px">
      <div>
        <el-button @click="showAdd" type="primary">添加分类</el-button>
      </div>
      <div style="margin-top: 10px" class="conlist">
        <tree-table
          :selection-type="false"
          :expand-type="false"
          show-index
          :data="tableData"
          :columns="columns"
        >
          <template slot="like" slot-scope="scope">
            <i v-if="!scope.row.cat_deleted" class="el-icon-success"></i>
            <i v-else class="el-icon-error"></i>
          </template>
          <template slot="sort" slot-scope="scope">
            <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag v-else-if="scope.row.cat_level === 1" type="success"
              >二级</el-tag
            >
            <el-tag v-else type="warning">三级</el-tag>
          </template>
          <template slot="edit" slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small"
              >编辑</el-button
            >
            <el-button
              type="text"
              @click="deleteById(scope.row)"
              style="margin-left: 15px"
              size="small"
              >删除</el-button
            >
          </template>
        </tree-table>
        <div style="margin-top: 20px; display: flex; justify-content: flex-end">
          <el-pagination
            @current-change="currentChange"
            background
            layout="total,prev, pager, next"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </div>

    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="添加分类"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="form.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" prop="cat_pid">
          <el-cascader
            :props="{
              label: 'cat_name',
              value: 'cat_id',
            }"
            clearable
            v-model="form.cat_pid"
            :options="options"
            change-on-select
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  errorMessage,
  successMessage,
  deleteSuccess,
} from "../../config/constant";
import { getcategories, addcategories, delteCat } from "../../api/goods";
export default {
  data() {
    return {
      total: 0,
      tableData: [],
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          prop: "cat_deleted",
          type: "template", //自定义
          template: "like",
        },
        {
          label: "排序",
          prop: "cat_level",
          type: "template", //自定义
          template: "sort",
        },
        {
          label: "操作",
          prop: "",
          type: "template",
          template: "edit",
        },
      ],
      pagenum: 1,
      pagesize: 10,
      //
      dialogVisible: false,
      form: {
        cat_name: "",
        cat_pid: "",
        id: 0,
        level: 0,
      },
      options: [],
      rules: {
        cat_name: [
          { required: true, message: "请输入分类名", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      const data = await getcategories({
        pagenum: this.pagenum,
        pagesize: this.pagesize,
      });
      if (data.meta.status === 200) {
        this.tableData = data.data.result;
        this.total = data.data.total;
      } else {
        this.$message.error(errorMessage);
      }
    },
    currentChange(e) {
      this.pagenum = e;
      this.getList();
    },
    handleClick(e) {
      this.$message.success("不给你编辑！")
    },
    deleteById(e) {
     
      this.$confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const {data} = await delteCat(e.cat_id);
          if (data.meta.status === 200) {
            this.$message.success(deleteSuccess);
            this.getList();
          } else {
            this.$message.error(errorMessage);
          }
        })
        .catch(() => {});
    },
    async showAdd() {
      const { data } = await getcategories();
      this.options = data;
      this.dialogVisible = true;
      this.form = {
        cat_name: "",
        cat_pid: "",
        id: 0,
        level: 0,
      };
    },
    handleChange(value) {
      if (this.form.cat_pid.length > 0) {
        this.form.id = this.form.cat_pid[this.form.cat_pid.length - 1];
        this.form.level = this.form.cat_pid.length - 1;
      } else {
        //没选中
        this.form.id = 0;
        this.form.level = 0;
      }
    },
    confirm() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          const data = await addcategories({
            cat_name: this.form.cat_name, // 名字
            cat_pid: this.form.id,
            cat_level: this.form.level,
          });
          if (data.meta.status === 201) {
            this.$message.success(successMessage);
            this.dialogVisible = false;
            this.getList();
          } else {
            this.$message.error(errorMessage);
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-cascader {
  width: 100%;
}
</style>