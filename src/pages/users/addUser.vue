<template>
  <div>
    <el-dialog
      title="收货地址"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
    >
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
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
        <!-- <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { errorMessage } from "../../config/constant";
import { getUserInfo, addUserList, changUserInfo } from "../../api/home";
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
  },
  computed: {
    isEdit() {
      return this.changType === "edit";
    },
  },
  watch: {
    async showAddUser(newVal) {
      this.dialogFormVisible = newVal;
      if (newVal) {
        if (this.changType === "edit") {
          const { data } = await getUserInfo(this.detailObj.id);
          this.form = { ...this.form, ...data };
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
          this.$emit("update:showAddUser", false);
          if (this.changType === "edit") {
            const { data } = await changUserInfo(this.detailObj.id, {
              email: this.form.email,
              mobile: this.form.mobile,
            });
            if (data.meta.status === 200) {
              this.$emit("updateList");
            } else {
              this.$message.error(errorMessage);
            }
          } else {
            const res = await addUserList(this.form);
            if (res.meta.status === 201) {
              this.$emit("updateList");
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
</style>