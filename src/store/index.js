import Vue from 'vue'
import Vuex from 'vuex'
import persistedState from 'vuex-persistedstate'
Vue.use(Vuex)
const state = {
    token: ""
    //要设置的初始属性值
};
const mutations = {
    SET_TOKEN(state, data) {
        state.token = data
    },
    REMOVE_TOKEN(state, data) {
        state.token = data
    },
}
const getters = {
    token: state => state.token
}
const store = new Vuex.Store({
    state,
    getters,
    mutations,
    plugins: [persistedState({ storage: window.sessionStorage })] // 持久化
});

export default store;