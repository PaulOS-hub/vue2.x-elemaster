<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top:20px">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" width="60"> </el-table-column>
        <el-table-column prop="authName" label="权限名称" width="">
        </el-table-column>
        <el-table-column prop="path" label="路径" width=""> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0">标签一</el-tag>
            <el-tag v-else-if="scope.row.level == 1" type="success"
              >标签二</el-tag
            >
            <el-tag v-else type="warning">标签二</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getRightList } from "../../api/role-rights";
export default {
  data() {
    return {
      tableData: [],
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      const { data } = await getRightList("list");
      this.tableData = data;
    },
  },
};
</script>

<style lang="less" scoped>
</style>