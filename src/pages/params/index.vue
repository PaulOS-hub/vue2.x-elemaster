<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 20px">
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
      >
      </el-alert>
    </div>
    <div style="margin-top: 20px">
      <span>请选择商品分类：</span>
      <el-cascader
        :props="{
          label: 'cat_name',
          value: 'cat_id',
        }"
        ref="casecade"
        clearable
        v-model="form.cat_pid"
        :options="options"
        @change="handleChange"
      ></el-cascader>
    </div>
    <div style="margin-top: 20px">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            @click="dialogVisible = true"
            :disabled="!isDisabled"
            type="primary"
            >添加参数</el-button
          >
          <el-table :data="tableData" style="width: 100%">
            <el-table-column type="expand" width="60">
              <template slot-scope="scope">
                <el-tag
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  @close="closeTag(index, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  style="width: 120px"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" width="60"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="">
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button
                  @click="handleEdit(scope.row)"
                  type="text"
                  size="small"
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
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            @click="dialogVisible = true"
            :disabled="!isDisabled"
            type="primary"
            >静态属性</el-button
          >
          <el-table :data="tableData2" style="width: 100%">
            <el-table-column type="expand" width="60">
              <template slot-scope="scope">
                <el-tag
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  @close="closeTag(index, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  style="width: 120px"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" width="60"> </el-table-column>
            <el-table-column prop="attr_name" label="属性名称" width="">
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button
                  @click="handleEdit(scope.row)"
                  type="text"
                  size="small"
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
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-form
        :model="modelForm"
        ref="modelForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          :label="title"
          prop="attr_name"
          :rules="[
            { required: true, message: '年龄不能为空', trigger: 'blur' },
          ]"
        >
          <el-input v-model="modelForm.attr_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('modelForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getcategories } from "../../api/goods";
import {
  getParamsList,
  editParam,
  addParams,
  deleteParam,
} from "../../api/params";
import {
  errorMessage,
  successMessage,
  deleteSuccess,
} from "../../config/constant";
export default {
  data() {
    return {
      form: {
        cat_pid: "",
        id: "",
      },
      options: [],
      activeName: "many",
      tableData: [],
      tableData2: [],
      firstMany: true,
      firstOnly: true,
      dialogVisible: false,
      modelForm: {
        attr_name: "",
      },
    };
  },
  computed: {
    isDisabled() {
      return this.form.cat_pid.length === 3;
    },
    title() {
      return this.activeName === "many" ? "动态参数" : "静态属性";
    },
  },
  mounted() {
    this.getOptions();
  },
  methods: {
    async getOptions() {
      const { data } = await getcategories({
        type: 3,
      });
      this.options = data;
    },
    // 选择商品分类
    handleChange(value) {
      if (this.form.cat_pid.length !== 3) {
        this.form.cat_pid = [];
        this.tableData = [];
        this.tableData2 = [];
        return;
      }
      this.form.id = value[value.length - 1];
      if (this.activeName === "many") this.firstMany = true;
      if (this.activeName === "only") this.firstOnly = true;
      this.getList(this.form.id);
    },
    handleEdit() {
      this.$message.success("不给编辑！");
    },
    // 切换tab
    handleClick() {
      if (this.form.id) {
        this.getList(this.form.id);
      }
    },
    // 获取表格
    async getList(e) {
      if (this.activeName === "many" && this.firstMany) {
        const data = await getParamsList(e, {
          sel: this.activeName,
        });
        if (data.meta.status === 200) {
          data.data.forEach((item) => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
            item.inputVisible = false;
            item.inputValue = "";
          });
          this.tableData = data.data;
          this.firstMany = false;
        } else {
          this.$message.error(errorMessage);
        }
      } else if (this.activeName === "only" && this.firstOnly) {
        const data = await getParamsList(e, {
          sel: this.activeName,
        });
        if (data.meta.status === 200) {
          data.data.forEach((item) => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
            item.inputVisible = false;
            item.inputValue = "";
          });
          this.tableData2 = data.data;
          this.firstOnly = false;
        } else {
          this.$message.error(errorMessage);
        }
      }
    },
    //删除
    deleteById(e) {
      if (this.activeName === "many") {
        this.$confirm("确定删除吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            const { data } = await deleteParam(this.form.id, e.attr_id);
            if (data.meta.status === 200) {
              this.$message.success(deleteSuccess);
              this.firstMany = true;
              this.getList(this.form.id);
            } else {
              this.$message.error(errorMessage);
            }
          })
          .catch(() => {});
      } else {
        this.$confirm("确定删除吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            const { data } = await deleteParam(this.form.id, e.attr_id);
            if (data.meta.status === 200) {
              this.$message.success(deleteSuccess);
              this.firstOnly = true;
              this.getList(this.form.id);
            } else {
              this.$message.error(errorMessage);
            }
          })
          .catch(() => {});
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.dialogVisible = false;
          const data = await addParams(this.form.id, {
            attr_name: this.modelForm.attr_name,
            attr_sel: this.activeName,
          });
          if (data.meta.status === 201) {
            this.$message.success(successMessage);
            if (this.activeName === "many") {
              this.firstMany = true;
              this.getList(this.form.id);
            } else {
              this.firstOnly = true;
              this.getList(this.form.id);
            }
          } else {
            this.$message.error(errorMessage);
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput(e) {
      e.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      this.saveAttrVals(row);
    },

    async saveAttrVals(row) {
      const { data } = await editParam(this.form.id, row.attr_id, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(" "),
      });
      if (data.meta.status === 200) {
        this.$message.success(successMessage);
      } else {
        this.$message.error(errorMessage);
      }
    },

    closeTag(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrVals(row);
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 5px;
}
</style>