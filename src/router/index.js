import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import NProgress from "nprogress";
// import 'nprogress/nprogress.css'
Vue.use(VueRouter);
// push
const whiteList = ["/login"]; // no redirect whitelist

export const constantRoutes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: () => import("../views/login"),
  },
];
export const asyncRoutes = [
  {
    path: "/home",
    component: () => import("../views/home"),
    redirect: "/home/users",
    children: [
      {
        name: "用户管理",
        path: "/home/users",
        component: () => import("../pages/users"),
        meta: {
          roles: ["admin", "document"],
        },
      },
      {
        name: "权限管理",
        path: "/home/roles",
        component: () => import("../pages/roles"),
        meta: {
          roles: ["super", "write"],
        },
      },
      {
        name: "权限管理",
        path: "/home/rights",
        component: () => import("../pages/rights"),
        meta: {
          roles: ["admin"],
        },
      },
      {
        name: "商品管理",
        path: "/home/categories",
        component: () => import("../pages/cate/index.vue"),
        meta: {
          roles: ["admin"],
        },
      },
      {
        name: "商品管理",
        path: "/home/params",
        component: () => import("../pages/params/index.vue"),
        meta: {
          roles: ["admin"],
        },
      },
      {
        name: "商品管理",
        path: "/home/goods",
        component: () => import("../pages/goods/index.vue"),
        meta: {
          roles: ["admin"],
        },
      },
      {
        name: "订单管理",
        path: "/home/goods/add",
        component: () => import("../pages/goods/add/index.vue"),
        meta: {
          roles: ["admin"],
        },
      },
      {
        name: "订单管理",
        path: "/home/orders",
        component: () => import("../pages/order/index.vue"),
        meta: {
          roles: ["super"],
        },
      },
      {
        name: "数据统计",
        path: "/home/reports",
        component: () => import("../pages/report/index.vue"),
        meta: {
          roles: ["super"],
        },
      },
    ],
  },
  {
    path: "*",
    component: () => import("../views/404"),
  },
];
const router = new VueRouter({
  routes: constantRoutes,
});
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
router.beforeEach(async (to, from, next) => {
  NProgress.start();
  // 此时需要权限
  if (store.state.token) {
    if (to.path === "/login") {
      next({ path: "/" });
    } else {
      if (
        store.state.roles && //
        store.state.addRoutes.length > 0 &&
        store.state.roles.length > 0
      ) {
        next();
      } else {
        try {
          store.commit("SET_ROLES", ["document", "write"]);
          const asyncroutes = await GenerateRoutes({
            roles: store.state.roles,
          });
          // router.addRoute(asyncroutes);
          next({ ...to, replace: true });
        } catch (error) {
          console.log(error);
          next("/login");
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login`);
    }
  }
});
router.afterEach(() => {});

export default router;
