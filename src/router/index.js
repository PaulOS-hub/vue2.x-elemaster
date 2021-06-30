import Vue from 'vue'
import VueRouter from "vue-router";
import store from '../store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
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
        redirect: "/users",
        children: [
            {
                path: "/users",
                component: () => import('../pages/users'),
                meta: {
                    Auth: true
                }
            },
            {
                path: "/roles",
                component: () => import('../pages/roles'),
                meta: {
                    Auth: true
                }
            },
            {
                path: "/rights",
                component: () => import('../pages/rights'),
                meta: {
                    Auth: true
                }
            },
            {
                path: "/categories",
                component: () => import('../pages/cate/index.vue'),
                meta: {
                    Auth: true
                }
            },
            {
                path: "/params",
                component: () => import('../pages/params/index.vue'),
                meta: {
                    Auth: true
                }
            },
            {
                path: "/goods",
                component: () => import('../pages/goods/index.vue'),
                meta: {
                    Auth: true
                }
            },
            {
                path: "/goods/add",
                component: () => import('../pages/goods/add/index.vue'),
                meta: {
                    Auth: true
                }
            },
            {
                path: "/orders",
                component: () => import('../pages/order/index.vue'),
                meta: {
                    Auth: true
                }
            },
            {
                path: "/reports",
                component: () => import('../pages/report/index.vue'),
                meta: {
                    Auth: true
                }
            }

        ],
        meta: {
            Auth: true
        }
    },

    {
        path: "*",
        component: () => import('../views/404')
    }
]
const router = new VueRouter({
    routes: commonRoutes
})
router.beforeEach((to, from, next) => {
    NProgress.start()
    if (to.meta.Auth) {
        if (store.state.token) {
            if (to.path === '/login') next("/home")
            else next()
        } else {
            next("/login")
        }
    } else if (to.path === '/login') {
        if (store.state.token) {
            next("/home")
        } else {
            next()
        }
    } else {
        next()
    }
})
router.afterEach(() => {
    NProgress.done()
})
export default router
