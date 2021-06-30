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
        type="warning"
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
                v-model="addForm.goods_number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                :props="{
                  label: 'cat_name',
                  value: 'cat_id',
                }"
                clearable
                style="width: 300px"
                v-model="addForm.goods_cat"
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
          <el-tab-pane name="3" label="商品图片">
            <!-- el-upload设置请求头，上传地址 -->
            <el-upload
              :headers="{
                Authorization: $store.state.token,
              }"
              class="upload-demo"
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              list-type="picture"
              :on-success="uploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="" />
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品内容">
            <quill-editor
              ref="myQuillEditor"
              :options="editorOption"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @ready="onEditorReady($event)"
              @change="onEditorChange($event)"
            />

            <el-button
              type="primary"
              @click="addGoods"
              style="width: 120px; margin-top: 20px; float: right"
            >
              添加商品
            </el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getcategories } from "@/api/goods";
import { getAttributesList, addFormGoods } from "@/api/params";
import { errorMessage, successMessage, deleteSuccess } from "@/config/constant";
import { baseUrl } from "@/config/constant";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
import _ from "lodash";
export default {
  data() {
    return {
      activeIndex: 0,
      addForm: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_cat: [],
        goods_id: "",
        pics: [], // 图片
        introduce: "",
        attrs: [],
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
        goods_cat: [
          {
            required: true,
            message: "请选择商品类别，只允许选择第三级类别",
            trigger: "change",
          },
        ],
      },
      baseUrl: baseUrl,
      options: [],
      manyTableData: [], // 动态参数列表
      onlyTableData: [], // 静态
      dialogVisible: false,
      dialogImageUrl: "",
      fileList: [],

      //富文本

      //富文本编辑器配置
      editorOption: {
        // Some Quill options...
      },
    };
  },
  components: {
    quillEditor,
  },
  computed: {
    uploadUrl() {
      return this.baseUrl + "upload";
    },
  },
  mounted() {
    this.getTypeList();
  },
  methods: {
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
        return;
      }
      this.addForm.goods_id =
        this.addForm.goods_cat[this.addForm.goods_cat.length - 1];
    },
    async getTypeList() {
      const { data } = await getcategories();
      this.options = data;
    },
    tabClick(activeName, oldActiveName) {
      if (oldActiveName === "0") {
        if (this.addForm.goods_cat.length !== 3) {
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
    handleRemove(file) {
      // 查找索引位置
      const curIndex = this.addForm.pics.findIndex((item) => {
        item.pic === file.response.data.tmp_path;
      });
      this.addForm.pics.splice(curIndex, 1);
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 上传成功
    uploadSuccess({ data }) {
      // console.log()
      this.addForm.pics.push({
        pic: data.tmp_path,
      });
    },

    // 富文本
    //失去焦点事件
    onEditorBlur(quill) {},
    //获得焦点事件
    onEditorFocus(quill) {},
    // 准备富文本编辑器
    onEditorReady(quill) {},
    //内容改变事件
    onEditorChange({ quill, html, text }) {
      this.addForm.introduce = text;
    },

    //添加商品
    addGoods() {
      this.$refs["addForm"].validate(async (valid) => {
        if (valid) {
          //
          [...this.manyTableData, ...this.onlyTableData].forEach((item) => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals ? item.attr_vals.join(" ") : "",
            };
            this.addForm.attrs.push(newInfo);
          });

          let addFormCopy = _.cloneDeep(this.addForm);
          addFormCopy.goods_cat = this.addForm.goods_cat.join(",");
          console.log(addFormCopy);
          const data  = await addFormGoods({
            goods_name: addFormCopy.goods_name,
            goods_cat: addFormCopy.goods_cat,
            goods_number:addFormCopy.goods_number,
            goods_price: addFormCopy.goods_price,
            goods_weight: addFormCopy.goods_weight,
            goods_introduce: addFormCopy.goods_introduce,
            pics: JSON.stringify(addFormCopy.pics),
          });
          if (data.meta.status === 201) {
            this.$message.success(successMessage);
            this.$router.push("/goods")
          } else {
            this.$message.error(data.meta.msg);
          }
          
        } else {
          this.$message.error("请填写必要的表单项");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-checkbox {
  margin: 0 10px 0 0 !important;
}
/deep/ .ql-container {
  min-height: 400px !important;
  max-height: 400px !important;
  overflow: auto;
}
</style>