import Vue from 'vue'
import VueRouter from "vue-router";
Vue.use(VueRouter)
const commonRoutes = [
    {
        path: "/",
        redirect: "/login"
    },
    {
        path: "/login",
        component: () => import('../views/login')
    },
    {
        path: "/home",
        component: () => import('../views/home'),
        meta: {
            Auth: true
        }
    },
    {
        path: "*",
        component: () => import('../views/404')
    }
]
export default new VueRouter({
    routes: commonRoutes
})
