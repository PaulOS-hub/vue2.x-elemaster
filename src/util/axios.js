/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 * 
 */
import axios from 'axios';
import QS from 'qs'; // 序列化
import { message as Message } from './resetMessage' // 替换message
import store from '../store/index' // 引入vuex token模块
import { baseUrl } from '../config/constant' // 常量
import { Loading } from "element-ui";
import _ from 'lodash'
// 环境的切换
// if (process.env.NODE_ENV == 'development') {
// } else if (process.env.NODE_ENV == 'debug') {
//     axios.defaults.baseURL = '';
// } else if (process.env.NODE_ENV == 'production') {
//     // axios.defaults.baseURL = 'http://api.123dailu.com/';
// }

//loading对象
let loading;

//当前正在请求的数量
let needLoadingRequestCount = 0;

//显示loading
function showLoading(target) {
    // 后面这个判断很重要，因为关闭时加了抖动，此时loading对象可能还存在，
    // 但needLoadingRequestCount已经变成0.避免这种情况下会重新创建个loading
    if (needLoadingRequestCount === 0 && !loading) {
        loading = Loading.service({
            lock: true,
            text: "加载中...",
            background: 'rgba(255, 255, 255, 0.8)',
            target: target || "body"
        });
    }
    needLoadingRequestCount++;
}

//隐藏loading
function hideLoading() {
    needLoadingRequestCount--;
    needLoadingRequestCount = Math.max(needLoadingRequestCount, 0); //做个保护
    if (needLoadingRequestCount === 0) {
        //关闭loading
        toHideLoading();
    }
}

//防抖：将 300ms 间隔内的关闭 loading 便合并为一次。防止连续请求时， loading闪烁的问题。
let toHideLoading = _.debounce(() => {
    loading.close();
    loading = null;
}, 300);


axios.defaults.baseURL = baseUrl;
// 请求超时时间
axios.defaults.timeout = 10000;
// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// 请求拦截器
axios.interceptors.request.use(

    config => {
        // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
        // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
        const token = store.state.token;
        token && (config.headers.Authorization = token);
        showLoading()
        return config;
    },
    error => {
        hideLoading();
        Message({
            message: '网络请求不存在',
            duration: 1500
        });
        return Promise.error(error);
    })

// 响应拦截器
axios.interceptors.response.use(
    response => {
        if (response.status === 200) {
            hideLoading();
            return Promise.resolve(response);
        } else {
            hideLoading();
            return Promise.reject(response);
        }

    },
    // 服务器状态码不是200的情况    
    error => {
        // if (error.response.status) {
        //     switch (error.response.status) {
        //         // 401: 未登录                
        //         // 未登录则跳转登录页面，并携带当前页面的路径                
        //         // 在登录成功后返回当前页面，这一步需要在登录页操作。                
        //         case 401:
        //             // router.replace({
        //             //     path: '/login',
        //             //     query: { redirect: router.currentRoute.fullPath }
        //             // });
        //             break;
        //         // 403 token过期                
        //         // 登录过期对用户进行提示                
        //         // 清除本地token和清空vuex中token对象                
        //         // 跳转登录页面                
        //         case 403:
        //             Message({
        //                 message: '登录过期，请重新登录',
        //                 duration: 1000
        //                 // forbidClick: true
        //             });
        //             // 清除token                    
        //             // localStorage.removeItem('token');
        //             // store.commit('loginSuccess', null);
        //             // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
        //             setTimeout(() => {
        //                 // router.replace({
        //                 //     path: '/login',
        //                 //     query: {
        //                 //         redirect: router.currentRoute.fullPath
        //                 //     }
        //                 // });
        //             }, 1000);
        //             break;
        //         // 404请求不存在                
        //         case 404:
        //             Message({
        //                 message: '网络请求不存在',
        //                 duration: 1500
        //                 // forbidClick: true
        //             });
        //             break;
        //         // 其他错误，直接抛出错误提示                
        //         default:
        //             Message({
        //                 message: '网络请求不存在',
        //                 duration: 1500
        //                 // forbidClick: true
        //             });
        //     }
        //     hideLoading();
        //     return Promise.reject(error.response);
        // }
        Message({
            message: '网络错误，请稍后再试',
            type: "error"
        });
        hideLoading();
        return Promise.reject(error);

    }
);
/** 
 * get方法，对应get请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}
/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, QS.stringify(params))
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}
export default axios