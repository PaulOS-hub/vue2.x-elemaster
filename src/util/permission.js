import { asyncRoutes } from "../router/index";
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.indexOf(role) >= 0);
  } else {
    return true;
  }
}
export const GenerateRoutes = (data) => {
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
};
