<template>
  <div>
    <el-dialog
      :title="changType === 'edit' ? '编辑' : setRole ? '分配角色' : '新增'"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
      width="30%"
    >
      <el-form
        v-if="!setRole"
        ref="form"
        :rules="rules"
        :model="form"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" v-if="isEdit" disabled></el-input>
          <el-input v-model="form.username" v-else></el-input>
        </el-form-item>
        <el-form-item v-if="!isEdit" label="用户密码" prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
      </el-form>
      <el-form ref="form" v-else :model="form" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="当前角色" prop="role">
          <el-select v-model="form.roleId">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { errorMessage, successMessage } from "../../config/constant";
import { getUserInfo, addUserList, changUserInfo } from "../../api/home";
import { getRoleList, updateUserRole } from "../../api/role-rights";
export default {
  props: {
    showAddUser: {
      type: Boolean,
      default: false,
      required: true,
    },
    detailObj: {
      default: {},
    },
    changType: {
      type: String,
      default: "create",
    },
    userId: {
      type: String,
    },
    setRole: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isEdit() {
      return this.changType === "edit";
    },
  },
  watch: {
    async showAddUser(newVal) {
      this.dialogFormVisible = newVal;
      console.log(this.detailObj)
      if (newVal) {
        if (this.changType === "edit") {
          const { data } = await getUserInfo(this.detailObj.id);
          this.form = { ...this.form, ...data };
        } else if (this.setRole) {
          const { data } = await getUserInfo(this.detailObj.id);
          this.form = { ...this.form, ...data };
          const { data: res } = await getRoleList();
          this.roleList = res;
        } else {
          this.form = {
            username: "",
            password: "",
            email: "",
            mobile: "",
          };
        }
      }
    },
  },
  data() {
    return {
      form: {
        username: "",
        password: "",
        email: "",
        mobile: "",
        roleId: "",
      },
      rules: {
        username: [
          { required: true, message: "请设置用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请设置用户密码", trigger: "change" },
          {
            min: 0,
            max: 10,
            message: "长度在 0 到 10 个字符",
            trigger: "change",
          },
        ],
      },
      roleList: [],
      dialogFormVisible: this.showAddUser,
    };
  },
  methods: {
    cancel() {
      this.$emit("update:showAddUser", false);
    },
    submit() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          if (this.changType === "edit") {
            const { data } = await changUserInfo(this.detailObj.id, {
              email: this.form.email,
              mobile: this.form.mobile,
            });
            if (data.meta.status === 200) {
              this.$emit("updateList");
              this.$emit("update:showAddUser", false);
            } else {
              this.$message.error(errorMessage);
            }
          } else if (this.setRole) {
            //
            const { data } = await updateUserRole(this.detailObj.id, {
              rid: this.form.roleId,
            });
            if (data.meta.status === 200) {
              this.$message.success(successMessage);
              this.$emit("updateList");
              this.$emit("update:showAddUser", false);
            } else {
              this.$message.error(errorMessage);
            }
            console.log(data);
          } else {
            const res = await addUserList(this.form);
            if (res.meta.status === 201) {
              this.$emit("updateList");
              this.$emit("update:showAddUser", false);
            } else {
              this.$message.error(errorMessage);
            }
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
/deep/ .el-form-item {
  width: 90%;
}
/deep/ .el-select {
  width: 100%;
}
</style>