<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top:20px">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="expand" width="60">
          <template slot-scope="scope">
            <el-row
              v-for="(item, index) in scope.row.children"
              :key="item.id"
              :class="['alcenter', 'bdbottom', index === 0 ? 'bdtop' : '']"
            >
              <el-col :span="5">
                <el-tag closable @close="removeTag(scope.row, item.id)">
                  {{ item.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(item_, index_) in item.children"
                  :key="item_.id"
                  :class="[index_ === 0 ? '' : 'bdtop', 'alcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="removeTag(scope.row, item_.id)"
                      type="success"
                    >
                      {{ item_.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      @close="removeTag(scope.row, item__.id)"
                      type="warning"
                      v-for="item__ in item_.children"
                      :key="item__.id"
                    >
                      {{ item__.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" width="60"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="">
        </el-table-column>
        <el-table-column prop="level" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small">编辑</el-button>
            <el-button type="text" style="margin-left: 15px" size="small"
              >删除</el-button
            >
            <el-button
              type="text"
              @click="distributeAuth(scope.row)"
              style="margin-left: 15px"
              size="small"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <allowAuth @updateRoleList="getList" :detailObj="detailObj" :showdialogVisible.sync="showdialogVisible"></allowAuth>
  </div>
</template>

<script>
import { errorMessage, deleteSuccess } from "../../config/constant";
import { getRoleList, deleteRole } from "../../api/role-rights";
import allowAuth from "./allowAuth.vue";
export default {
  data() {
    return {
      tableData: [],
      showdialogVisible: false,
      detailObj:{}
    };
  },
  components: {
    allowAuth,
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      const { data } = await getRoleList();
      console.log(data);
      this.tableData = data;
    },
    removeTag(i, e) {
      console.log(i, e);
      this.$confirm("是否确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data } = await deleteRole({
            roleId: i.id,
            rightId: e,
          });
          console.log(data);
          if (data.meta.status === 200) {
            i.children = data.data;
            this.$message.success(deleteSuccess);
          } else {
            this.$message.error(errorMessage);
          }
        })
        .catch(() => {});
    },
    // 分配权限
    distributeAuth(role) {
      this.showdialogVisible = true;
      this.detailObj = role
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.bdtop {
  border-top: 1px solid #eee;
}
.alcenter {
  display: flex;
  align-items: center;
}
</style>