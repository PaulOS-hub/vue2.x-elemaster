<template>
  <div class="loginBg">
    <el-form
      :model="numberValidateForm"
      ref="numberValidateForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <div class="title-icon">
        <div class="avatar">
          <img src="../../assets/logo.webp" alt="" />
        </div>
      </div>
      <el-form-item
        label="用户名"
        prop="username"
        :rules="[
          { trigger: 'blur', required: true, message: '用户名不能为空' },
        ]"
      >
        <el-input
          prefix-icon="el-icon-user-solid"
          v-model="numberValidateForm.username"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
        :rules="[{ trigger: 'blur', required: true, message: '密码不能为空' }]"
      >
        <el-input
          type="password"
          prefix-icon="el-icon-key"
          v-model="numberValidateForm.password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('numberValidateForm')"
          >登录</el-button
        >
        <el-button @click="resetForm('numberValidateForm')">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from "../../api/login";
import { ROLES } from "../../config/roles";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      numberValidateForm: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    ...mapMutations(["SET_TOKEN", "SET_ROLES"]),
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { data } = await login(this.numberValidateForm);
          if (data) {
            this.SET_TOKEN(data.token);
            // 保存token至Store
            // 若有属性，代表成功
            this.$message.success("登录成功");
            this.SET_ROLES(ROLES);
            this.$router.push({
              path: "/home",
            });
          } else {
            this.$message.error("登录失败，账号或密码不正确");
            this.numberValidateForm.password = "";
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
@bg: #2b4b6b;
.loginBg {
  width: 100%;
  height: 100%;
  background: @bg;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  .title-icon {
    display: flex;
    justify-content: center;
    transform: translate(0%;-50%);
    .avatar {
      border: 1px solid #eee;
      padding: 10px;
      border-radius: 50%;
      box-shadow: 0 0 10px #ddd;
      text-align: center;
      width: 130px;
      height: 130px;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: #eee;
        display: inline-block;
      }
    }
  }
  .demo-ruleForm {
    width: 450px;
    height: 310px;
    background: #f5f5f5;
    border-radius: 10px;
    /deep/ .el-form-item {
      transform: translate(0%;-100%);
      padding: 0 25px 0px 0;
    }
  }
}
</style> 