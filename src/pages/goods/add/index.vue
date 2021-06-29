<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 20px">
      <el-alert
        title="添加商品信息"
        :closable="false"
        type="info"
        center
        show-icon
      >
      </el-alert>
    </div>
    <div style="margin-top: 20px">
      <el-steps
        align-center
        :space="300"
        :active="activeIndex >>> 0"
        finish-status="success"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        :rules="rules"
        style="padding: 20px 50px"
        ref="addForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="tabClick"
          @tab-click="clickTab"
          style="margin-top: 20px"
        >
          <el-tab-pane name="0" label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input
                style="width: 300px"
                v-model="addForm.goods_name"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                style="width: 300px"
                type="number"
                v-model="addForm.goods_price"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                style="width: 300px"
                type="number"
                v-model="addForm.goods_weight"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                style="width: 300px"
                type="number"
                v-model="addForm.goods_num"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_type">
              <el-cascader
                :props="{
                  label: 'cat_name',
                  value: 'cat_id',
                }"
                clearable
                style="width: 300px"
                v-model="addForm.goods_type"
                :options="options"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="1" label="商品参数">
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  v-for="(item_, index_) in item.attr_vals"
                  :key="index_"
                  :label="item_"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="2" label="商品属性">
            <el-form-item
              v-for="item in onlyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input
                style="width: 300px"
                v-model="item.attr_vals"
              ></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="3" label="商品图片">定时任务补偿</el-tab-pane>
          <el-tab-pane name="4" label="商品内容">定时任务补偿</el-tab-pane>
          <el-tab-pane name="5" label="完成">定时任务补偿</el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getcategories } from "@/api/goods";
import { getAttributesList } from "@/api/params";
import { errorMessage, successMessage, deleteSuccess } from "@/config/constant";
export default {
  data() {
    return {
      activeIndex: 0,
      addForm: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_type: [],
        goods_id: "",
      },
      rules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_type: [
          {
            required: true,
            message: "请选择商品类别，只允许选择第三级类别",
            trigger: "change",
          },
        ],
      },
      options: [],
      manyTableData: [], // 动态参数列表
      onlyTableData: [], // 静态
    };
  },
  mounted() {
    this.getTypeList();
  },
  methods: {
    handleChange() {
      if (this.addForm.goods_type.length !== 3) {
        this.addForm.goods_type = [];
        return;
      }
      this.addForm.goods_id =
        this.addForm.goods_type[this.addForm.goods_type.length - 1];
    },
    async getTypeList() {
      const { data } = await getcategories();
      this.options = data;
    },
    tabClick(activeName, oldActiveName) {
      if (oldActiveName === "0") {
        if (this.addForm.goods_type.length !== 3) {
          this.$message.error("请先选择商品类别");
          return false;
        }
      }
    },
    // 动态
    async currentGetAttributesList() {
      const data = await getAttributesList(this.addForm.goods_id, {
        sel: "many",
      });
      if (data.meta.status === 200) {
        console.log(data.data);
        data.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        });
        this.manyTableData = data.data;
      } else {
        this.$message.error(errorMessage);
      }
    },
    // 静态
    async currentStaticGetAttributesList() {
      const data = await getAttributesList(this.addForm.goods_id, {
        sel: "only",
      });
      if (data.meta.status === 200) {
        console.log(data.data);
        data.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        });
        this.onlyTableData = data.data;
      } else {
        this.$message.error(errorMessage);
      }
    },
    // 切换tab
    clickTab(e) {
      if (this.activeIndex === "1") {
        // 参数面板
        this.currentGetAttributesList();
      } else if (this.activeIndex === "2") {
        this.currentStaticGetAttributesList();
      }
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-checkbox {
  margin: 0 10px 0 0 !important;
}
</style>