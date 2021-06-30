import Vue from 'vue';
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router'
import './style/common.less'
import store from './store'
import axios from 'axios'
import { message } from './util/resetMessage'
import ZKTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', ZKTable)
// Vue.use(ElementUI);
Vue.prototype.$axios = axios
Vue.prototype.$message = message
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  mounted(){
    // 预渲染
    document.dispatchEvent(new Event('custom-render-trigger'))
  }
});