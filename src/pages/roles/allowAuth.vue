<template>
  <div>
    <el-dialog
      title="权限分配"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-tree
        ref="trees"
        :data="authData"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        :default-expanded-keys="defKeysArr"
        :default-checked-keys="defKeysArr"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRightList, updateRole } from "../../api/role-rights";
import { errorMessage, successMessage } from "../../config/constant";
export default {
  props: {
    showdialogVisible: {
      default: false,
    },
    detailObj: {
      default: {},
    },
  },

  data() {
    return {
      dialogVisible: this.showdialogVisible,
      authData: [],
      defaultProps: {
        children: "children",
        label: "authName",
      },
      defKeysArr: [],
    };
  },
  watch: {
    async showdialogVisible(newVal) {
      this.dialogVisible = newVal;
      if (newVal) {
        this.defKeysArr = [];
        const data = await getRightList("tree");
        if (data.meta.status === 200) {
          this.authData = data.data;
          this.walkTree(this.detailObj, this.defKeysArr);
        } else {
          this.$message.error(errorMessage);
        }
      }
    },
  },
  methods: {
    async confirm() {
      const rids = [
        ...this.$refs["trees"].getCheckedKeys(),
        ...this.$refs["trees"].getHalfCheckedKeys(),
      ].join(",");
      let data = await updateRole(this.detailObj.id, {
        rids,
      });
      if (data.meta.status === 200) {
        this.$message.success(successMessage);
        this.$emit("updateRoleList");
        this.$emit("update:showdialogVisible", false);
      } else {
        this.$message.error(errorMessage);
      }
    },
    cancel() {
      this.$emit("update:showdialogVisible", false);
    },
    // 递归
    walkTree(node, arr) {
      // 如果当前节点不包含children属性
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.walkTree(item, arr);
      });
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-dialog__body{
    height: 400px;
    overflow: auto;
}
</style>