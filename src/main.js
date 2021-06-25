import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router'
import './style/common.less'
import store from './store'
Vue.use(ElementUI);

router.beforeEach((to, from, next) => {
  if (to.meta.Auth) {
    if (store.state.token) {
      next()
    } else {
      next("/login")
    }
  } else {
    next()
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});