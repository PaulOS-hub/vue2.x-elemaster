<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 20px">
      <el-input
        style="width: 220px"
        clearable
        placeholder="请输入内容"
        v-model="form.searchValue"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button style="margin-left: 15px" type="primary" @click="searchGoods"
        >搜索商品</el-button
      >
      <el-button type="default" style="margin-left: 15px" @click="addGoods"
        >添加商品</el-button
      >
    </div>
    <div style="margin-top: 20px">
      <el-table :data="goodsList" style="width: 100%">
        <el-table-column type="index" width="60"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）" width="130">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.add_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
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
  </div>
</template>
<script>
import { getgoodsList, delgoosdList } from "../../api/params";
import {
  errorMessage,
  successMessage,
  deleteSuccess,
} from "../../config/constant";
export default {
  name: "goodsList",
  data() {
    return {
      goodsList: [],
      pagenum: 1,
      pagesize: 10,
      total: 0,
      form: {
        searchValue: "",
      },
    };
  },
  mounted() {
    this.getList();
  },
  filters: {
    dataFormat(val) {
      const dt = new Date(val);
      const y = dt.getFullYear();
      const m = (dt.getMonth() + 1 + "").padStart(2, "0");
      const d = (dt.getDate() + "").padStart(2, "0");
      const hh = (dt.getHours() + "").padStart(2, "0");
      const mm = (dt.getMinutes() + "").padStart(2, "0");
      const ss = (dt.getSeconds() + "").padStart(2, "0");
      return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    },
  },
  methods: {
    async getList() {
      const data = await getgoodsList({
        query: this.form.searchValue,
        pagenum: this.pagenum,
        pagesize: this.pagesize,
      });
      if (data.meta.status === 200) {
        this.total = data.data.total;
        this.goodsList = data.data.goods;
      } else {
        this.$message.error(errorMessage);
      }
      console.log(data);
    },
    searchGoods() {
      if (this.form.searchValue.trim()) {
        this.getList();
      }
    },
    handleClick(e) {},
    // 删除
    deleteById(e) {
      this.$confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data } = await delgoosdList(e.goods_id);
          if (data.meta.status === 200) {
            this.$message.success(deleteSuccess);
            this.getList();
          } else {
            this.$message.error(errorMessage);
          }
        })
        .catch(() => {});
    },
    // 切换页码
    currentChange(e) {
      this.pagenum = e;
      this.getList();
    },
    // 添加商品
    addGoods() {
      this.$router.push({
        path: "/goods/add",
      });
    },
  },
};
</script>
<style lang="less" scoped>
</style>