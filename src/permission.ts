/* import router from './router';
import { useAppStoreWithOut } from '@/store/modules/app';
import type { RouteRecordRaw } from 'vue-router';
import { useTitle } from '@/hooks/web/useTitle';
import { useNProgress } from '@/hooks/web/useNProgress';
import { usePermissionStoreWithOut } from '@/store/modules/permission';
import { usePageLoading } from '@/hooks/web/usePageLoading';
import { NO_REDIRECT_WHITE_LIST } from '@/constants';
import { useUserStoreWithOut } from '@/store/modules/user';
import { useUserStore } from '@/store/modules/user';
import { usePermissionStore } from '@/store/modules/permission';
// 1. 处理父页面发送的路由消息
const messageHandler: (event: MessageEvent) => void = (event) => {
  if (event.origin !== import.meta.env.VITE_ORIGIN_URL) return;

  try {
    const data = JSON.parse(event.data);
    if (data.action === 'setUserInfoAndRouters') {
      const { userInfo, routers } = data.val;
      const userStore = useUserStore();
      userStore.setUserInfo(userInfo);
      handleRouters(routers);
    }
  } catch (error) {
    console.error('接收路由信息失败:', error);
  }
};
window.addEventListener('message', messageHandler);
// 2. 路由转换与动态添加
const transformRoute = (route: any): any => {
    if (route.meta?.isoutlink === 0) {
        return null; // 返回 null 表示过滤掉当前路由
    }
    route.path = route.meta.path ;
    route.name = route.meta.name;
    route.component = route.meta.component;
    delete route.redirect;
    if (route.children) {
        route.children = route.children.map(transformRoute).filter(child => child !== null);
    }
    return route;
};
const handleRouters = async (nav: any[]) => {
  const userStore = useUserStore();
  const permissionStore = usePermissionStore();

  const transformedRouters = (nav || []).map(transformRoute);
  userStore.setRoleRouters(transformedRouters);

  try {
    await permissionStore.generateRoutes('server', transformedRouters);
    permissionStore.getAddRouters.forEach((route) => {
      router.addRoute(route as RouteRecordRaw);
    });
    permissionStore.setIsAddRouters(true);
  } catch (error) {
    console.error('动态路由生成失败:', error);
  }
  
    const currentPath = window.location.pathname.replace(import.meta.env.VITE_BASE_PATH,'');
    const ticket = getQueryObject(window.location.href)?.ticket
    userStore.setTicket(ticket as string)
    console.log('currentPath',currentPath,window.location)
    const currentRouter:any = router.getRoutes().filter(route => route.path == currentPath)
    let permisisionList:any[] = []
    if(currentRouter.length > 0 ){
        permisisionList = currentRouter[0].meta.sysAction
    }
    setPermissionList(permisisionList)
    router.replace(currentPath);
};
// 3. 路由守卫
const { start, done } = useNProgress();
const { loadStart, loadDone } = usePageLoading();
export const beforeRouter = () => {
  router.beforeEach(async (to, from, next) => {
    start()
    loadStart()
    const appStore = useAppStoreWithOut()
    const userStore = useUserStoreWithOut()
    if (to.query.ticket) {
      // 被嵌套在iframe中
      userStore.setTicket(to.query.ticket as string)
      // const message = { type: 'giveChildRouters', content: 'giveChildRouters' };
      // window.parent.postMessage(message, import.meta.env.VITE_ORIGIN_URL);
    }
    let permisisionList:any = []
    if(to?.meta?.actions && to?.meta?.actions?.length  ){
        permisisionList = to.meta.actions
    }
    setPermissionList(permisisionList)
    if (userStore.getUserInfo) {
      if (to.path === '/login') {
        next({ path: '/' })
      } else {
          const permissionStore = usePermissionStore()
        if (permissionStore.getIsAddRouters) {
          next()
          return
        }
        const roleRouters = userStore.getRoleRouters || []
        await permissionStore.generateRoutes('server', roleRouters)
        permissionStore.getAddRouters.forEach((route) => {
          router.addRoute(route as unknown as RouteRecordRaw) // 动态添加可访问路由表
        })
        const redirectPath = from.query.redirect || to.path
        const redirect = decodeURIComponent(redirectPath as string)
        const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
        permissionStore.setIsAddRouters(true)
        next(nextData)
      }
    } else {
      if (NO_REDIRECT_WHITE_LIST.indexOf(to.path) !== -1) {
        next()
      } else {
        next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      }
    }
})
};
if(window.self == window.top){
    beforeRouter()
}
// 4. 路由跳转完成后的处理
router.afterEach((to) => {
  useTitle(to?.meta?.title as string);
  done();
  loadDone();
}) */
 
 import router from './router'
import { useAppStoreWithOut } from '@/store/modules/app'
import type { RouteRecordRaw } from 'vue-router'
import { useTitle } from '@/hooks/web/useTitle'
import { useNProgress } from '@/hooks/web/useNProgress'
import { usePermissionStoreWithOut } from '@/store/modules/permission'
import { usePageLoading } from '@/hooks/web/usePageLoading'
import { NO_REDIRECT_WHITE_LIST } from '@/constants'
import { useUserStoreWithOut } from '@/store/modules/user'
import { commonGetData } from '@/utils/request'
import { setPermissionList } from '@/utils/actPermission'

const { start, done } = useNProgress()

const { loadStart, loadDone } = usePageLoading()

router.beforeEach(async (to, from, next) => {
  start()
  loadStart()
  const permissionStore = usePermissionStoreWithOut()
  const appStore = useAppStoreWithOut()
  const userStore = useUserStoreWithOut()
  if (to.query.ticket) {

    const funcid: any = to.query.funcid
    const ticket: any = to.query.ticket
    userStore.setTicket(ticket)
    // userStore.setFuncId(funcid)

    // const res = (await commonGetData('fc2dd91a4ed49b8c', {
    //   funcode: funcid
    // })) as unknown as { KeyValue: string } // 类型断言
    // const list = JSON.parse(res.KeyValue)?.rows
    // setPermissionList(list)
    next()
  } else {
    if (userStore.getUserInfo) {
      if (to.path === '/login') {
        next({ path: '/' })
      } else {
        if (permissionStore.getIsAddRouters) {
          next()
          return
        }
        // 开发者可根据实际情况进行修改
        const roleRouters = userStore.getRoleRouters || []
        await permissionStore.generateRoutes('static')
        permissionStore.getAddRouters.forEach((route) => {
          router.addRoute(route as unknown as RouteRecordRaw) // 动态添加可访问路由表
        })
        const redirectPath = from.query.redirect || to.path
        const redirect = decodeURIComponent(redirectPath as string)
        const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
        permissionStore.setIsAddRouters(true)
        next(nextData)
      }
    } else {
      if (NO_REDIRECT_WHITE_LIST.indexOf(to.path) !== -1) {
        next()
      } else {
        next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      }
    }
  }
})

router.afterEach((to) => {
  useTitle(to?.meta?.title as string)
  done() // 结束Progress
  loadDone()
})
