<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-input
            clearable
            v-model="formInline.query"
            placeholder="请输入关键字查询"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 80px" @click="onSubmit"
            >搜索</el-button
          >
          <el-button style="width: 80px" @click="add">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="conlist">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" width="60"> </el-table-column>
        <el-table-column prop="username" label="用户名" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" width="">
        </el-table-column>
        <el-table-column prop="email" label="邮箱地址"> </el-table-column>
        <el-table-column prop="" label="状态" width="120">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color=""
              @change="changState(scope.row, $event)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
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
        </el-table-column>
      </el-table>
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
    <addUser
      @updateList="getList"
      :changType="changType"
      :detailObj="detailObj"
      :showAddUser.sync="showAddUser"
    />
  </div>
</template>

<script>
import { getUserList, changeState, deleteUser } from "../../api/home";
import { errorMessage, successMessage } from "../../config/constant";
import addUser from "./addUser.vue";
export default {
  data() {
    return {
      formInline: {
        query: "",
      },
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      changType: "",
      detailObj: {},
      showAddUser: false,
    };
  },
  components: {
    addUser,
  },
  mounted() {
    this.getList();
  },
  methods: {
    onSubmit() {
      this.getList();
    },
    async getList() {
      const { data } = await getUserList({
        query: this.formInline.query,
        pagenum: this.pageNum,
        pagesize: this.pageSize,
      });
      this.total = data.total;
      this.tableData = data.users;
    },
    handleClick(e) {
      this.changType = "edit";
      this.detailObj = e;
      this.showAddUser = true;
    },
    add() {
      this.changType = "create";
      this.detailObj = {};
      this.showAddUser = true;
    },
    deleteById(e) {
      this.$confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data } = await deleteUser(e.id);
          if (data.meta.status === 200) this.getList();
          else this.$message.error(errorMessage);
        })
        .catch(() => {});
    },
    currentChange(e) {
      this.pageNum = e;
      this.getList();
    },
    async changState(i, e) {
      const { data } = await changeState({
        id: i.id,
        type: e,
      });
      if (data.meta.status === 200) {
        // 成功
        this.$message.success(successMessage);
        this.getList();
      } else {
        this.$message.error(errorMessage);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.demo-form-inline {
  margin-top: 20px;
}
</style>