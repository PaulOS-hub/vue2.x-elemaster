import Vue from "vue";
import Vuex from "vuex";
import persistedState from "vuex-persistedstate";
import router from "../router/index";
import { constantRoutes, asyncRoutes } from "../router/index";
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.indexOf(role) >= 0);
  } else {
    return true;
  }
}
function GenerateRoutes(data) {
  return new Promise((resolve) => {
    const { roles } = data;
    const accessedRouters = asyncRoutes.filter((v) => {
      if (roles.indexOf("superadmin") >= 0) return true; // 如果你是超级管理员，那么全部通过
      if (hasPermission(roles, v)) {
        if (v.children && v.children.length > 0) {
          v.children = v.children.filter((child) => {
            if (hasPermission(roles, child)) {
              return child;
            }
            return false;
          });
          return v;
        } else {
          return v;
        }
      }
      return false;
    });

    resolve(accessedRouters);
  });
}
Vue.use(Vuex);
const state = {
  token: "",
  roles: [],
  addRoutes: [],
  routes: [],
  //要设置的初始属性值
};
const mutations = {
  SET_TOKEN(state, data) {
    state.token = data;
  },
  async SET_ROLES(state, data) {
    state.roles = data;
    state.addRoutes = await GenerateRoutes({ roles: data });
    // state.routes = [...constantRoutes, ...state.addRoutes];
    console.log(state.addRoutes, "筛选出的");
    state.routes = [...constantRoutes, ...state.addRoutes];
    router.addRoutes(state.addRoutes);
  },
  REMOVE_TOKEN(state, data) {
    state.token = data;
  },
};
const actions = {
  userInfo({ commit }, data) {},
};
const getters = {
  token: (state) => state.token,
};
const store = new Vuex.Store({
  state,
  getters,
  mutations,
  plugins: [persistedState({ storage: window.sessionStorage })], // 持久化
});

export default store;
