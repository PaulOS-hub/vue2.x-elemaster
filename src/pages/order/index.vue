<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 20px">
      <el-input
        style="width: 320px"
        clearable
        placeholder="请输入内容"
        v-model="form.searchValue"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button style="margin-left: 15px" type="primary" @click="searchGoods"
        >搜索商品</el-button
      >
    </div>
    <div style="margin-top: 20px">
      <el-table :data="goodsList" style="width: 100%">
        <el-table-column type="index" width="60"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格（元）" width="130">
        </el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status !== '0'" type="success"
              >已付款</el-tag
            >
            <el-tag v-else type="info">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_send !== '否'" type="success"
              >已发货</el-tag
            >
            <el-tag v-else type="info">未发货</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="update_time" label="下单时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.update_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small"
              >编辑地址</el-button
            >
            <el-button
              type="text"
              @click="deleteById(scope.row)"
              style="margin-left: 15px"
              size="small"
              >查询进度</el-button
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

    <el-dialog
      title="修改地址"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
    >
      <el-form ref="form" :model="modelform" label-width="80px">
        <el-form-item label="省市区">
          <el-cascader style="width: 100%" :options="cityOptions" :value="city">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="物流信息"
      :visible.sync="dialogVisible2"
      width="35%"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
    >
      <el-form ref="form" :model="modelform" label-width="80px">
        <el-timeline >
          <el-timeline-item
            v-for="(activity, index) in wuliuOptions.data"
            :key="index"
            :timestamp="activity.time"
          >
            {{ activity.context }}
          </el-timeline-item>
        </el-timeline>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="confirm2()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderList, getwuliuMessage } from "../../api/order";
import cityOptions from "@/config/province.js";
import wuliuOptions from "@/config/wuliu.js";
import {
  errorMessage,
  successMessage,
  deleteSuccess,
} from "../../config/constant";
export default {
  name: "order",
  data() {
    return {
      form: {
        searchValue: "",
      },
      cityOptions: cityOptions,
      wuliuOptions: wuliuOptions,
      city: [],
      goodsList: [],
      pagenum: 1,
      pagesize: 10,
      total: 0,
      modelform: {
        region: [],
        address: "",
      },
      dialogVisible: false,
      dialogVisible2: false,
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
    confirm() {
      this.dialogVisible = false;
      this.$message.success(successMessage);
    },
    confirm2() {
      this.dialogVisible2 = false;
      this.$message.success(successMessage);
    },
    searchGoods() {
      this.getList();
    },
    async getList() {
      const data = await getOrderList({
        query: this.form.searchValue.trim(),
        pagenum: this.pagenum,
        pagesize: this.pagesize,
      });
      if (data.meta.status === 200) {
        this.total = data.data.total;
        this.goodsList = data.data.goods;
      } else {
        this.$$message.error(errorMessage);
      }
      console.log(data);
    },
    handleClick() {
      this.dialogVisible = true;
    },
    async deleteById() {
      console.log(this.wuliuOptions.data);
      this.dialogVisible2 = true;
    },
    currentChange(e) {
      this.pagenum = e;
      this.getList();
    },
  },
};
</script>

<style lang="less" scoped>
</style>