<template>
  <div class="main-container">
    <el-container>
      <el-header>
        <el-menu
          class="el-menu-demo"
          mode="horizontal"
          background-color="#333"
          text-color="#fff"
        >
          <div class="header-flex">
            <div class="logoBG"></div>
            <el-submenu style="width:110px" :popper-append-to-body="false" index="x">
              <template slot="title">
                <div class="el-icon-user avatar"></div>
              </template>
              <el-menu-item>
                <div style="textalign: center;width:110px" @click="logout">退出登录</div>
              </el-menu-item>
            </el-submenu>
          </div>
        </el-menu>
      </el-header>
      <el-container style="flex: 1; display: flex; height: 100%">
        <div class="showSide" style="height: 100%; background: #333">
          <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
            <el-radio-button @click="isCollapse = !isCollapse" >展开</el-radio-button>
          </el-radio-group> -->
          <div
            @click="isCollapse = !isCollapse"
            :class="{
              'el-icon-s-fold': !isCollapse,
              'el-icon-s-unfold': isCollapse,
              showSideBar: true,
            }"
          >
          </div>
          <el-aside :width="isCollapse ? '70px' : '200px'">
            <el-menu
              :collapse-transition="false"
              :collapse="isCollapse"
              :default-active="activeIndex"
              class="el-menu-vertical-demo"
              background-color="#333"
              text-color="#fff"
              unique-opened
              router
              active-text-color="#409eff"
            >
              <el-submenu
                v-for="item in sidebarList"
                :key="item.id"
                :index="item.id + ''"
              >
                <template slot="title">
                  <i :class="iconList[item.id]"></i>
                  <span>{{ item.authName }}</span>
                </template>
                <el-menu-item-group v-if="item.children">
                  <el-menu-item
                    v-for="item_ in item.children"
                    :key="item_.id"
                    :index="'/' + item_.path"
                    >{{ item_.authName }}</el-menu-item
                  >
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-aside>
        </div>
        <el-main style="flex: 1">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { getSideBar } from "../../api/home";
export default {
  name: "home",
  data() {
    return {
      activeIndex: "",
      sidebarList: [],
      iconList: {
        125: "el-icon-user-solid",
        103: "el-icon-coordinate",
        101: "el-icon-shopping-cart-full",
        102: "el-icon-link",
        145: "el-icon-goblet-square-full",
      },
      isCollapse: true,
    };
  },
  watch: {
    $route: {
      handler(newVal) {
        this.activeIndex = newVal.path;
      },
      immediate: true,
    },
  },
  mounted() {
    this.getSideBarData();
  },
  methods: {
    ...mapMutations(["REMOVE_TOKEN"]),
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
    async getSideBarData() {
      const { data } = await getSideBar();
      this.sidebarList = data;
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
  overflow: hidden;
  .el-header {
    background-color: #333;
    color: #fff;
    text-align: center;
    line-height: 60px;
    padding: 0;
    display: flex;
    justify-content: space-between;
  }

  .el-aside {
    background-color: #333;
    color: #fff;
    text-align: center;
  }

  .el-main {
    overflow: auto;
    height: 100%;
  }
  .el-menu-demo {
    width: 100%;
  }
  .header-flex {
    display: flex;
    justify-content: space-between;
    padding: 0px;
    box-sizing: border-box;
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
  /deep/ .el-menu--horizontal {
    //   width:100px;
  }
  .avatar {
    margin-right: 20px;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    color: #545c64;
    background: #fff;
    line-height: 40px;
  }
  .showSide {
    display: flex;
    flex-direction: column;
  }
  .el-aside {
    flex: 1;
  }
}
/deep/ .el-menu--horizontal {
  //   width:100px;
  text-align: center;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
/deep/ .el-container.is-vertical {
  height: 100%;
}
.showSideBar {
  font-size: 28px;
  line-height: 40px;
  text-align: center;
  height: 40px;
  color: #999;
  cursor: pointer;
  background: #333;
}
.showSideBar:hover {
  background: rgb(67, 74, 80);
}
.logoBG {
  width: 200px;
  height: 60px;
  background: url("../../assets/audi.webp") no-repeat center center / 100% 100%;
}
</style>