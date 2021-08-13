import Vue from "vue";
import Vuex from "vuex";
import persistedState from "vuex-persistedstate";
import router from "../router/index";
import { constantRoutes, asyncRoutes } from "../router/index";
import { GenerateRoutes } from "../util/resetMessage";
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
