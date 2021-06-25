<template>
  <div class="main-container">
    <el-container>
      <el-header>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          background-color="#545c64"
          @select="handleSelect"
          text-color="#fff"
        >
          <div class="header-flex">
            <el-menu-item> ICON </el-menu-item>
            <el-menu-item @click="logout"> 退出登录 </el-menu-item>
          </div>
        </el-menu>
      </el-header>
      <el-container style="flex: 1; display: flex">
        <el-aside width="200px">
          <el-menu
            default-active="1-1"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航一</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="1-1">选项1</el-menu-item>
                <el-menu-item index="1-2">选项2</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="2">
              <i class="el-icon-menu"></i>
              <span slot="title">导航二</span>
            </el-menu-item>
            <el-menu-item index="4">
              <i class="el-icon-setting"></i>
              <span slot="title">导航四</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main style="flex: 1">Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  name: "home",
  data() {
    return {
      activeIndex: "",
    };
  },
  methods: {
    ...mapMutations(["REMOVE_TOKEN"]),
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    logout() {
      this.$confirm("是否确定退出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.REMOVE_TOKEN("");
          this.$router.push("/login");
        })
        .catch(() => {});
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>

<style lang="less" scoped>
.main-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .el-header {
    background-color: #545c64;
    color: #fff;
    text-align: center;
    line-height: 60px;
    padding: 0;
    display: flex;
    justify-content: space-between;
  }

  .el-aside {
    background-color: #545c64;
    color: #fff;
    text-align: center;
  }

  .el-main {
    color: #fff;
    text-align: center;
    line-height: 160px;
  }
  .el-menu-demo {
    width: 100%;
  }
  .header-flex {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
  }
  .el-dropdown {
    color: #fff;
  }
  /deep/ .el-submenu__title {
    color: #fff;
  }
  /deep/ .el-menu {
    border: none;
  }
  /deep/ .el-submenu {
    text-align: left;
  }
  /deep/ .el-menu-item {
    text-align: left;
  }
}
</style>