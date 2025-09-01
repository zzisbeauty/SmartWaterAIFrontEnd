import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { Layout, getParentLayout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'
import { NO_RESET_WHITE_LIST } from '@/constants'
import { useUserStore } from '@/store/modules/user'
const { t } = useI18n()

export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/DigitalHuman/APIManage',
    name: 'Root',

    meta: {
      hidden: true
    }
  },
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'RedirectTo',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFind',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  }
]

export const asyncRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/DigitalHuman',
    name: 'Root',
    meta: {
      hidden: true
    }
  },
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'RedirectTo',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFind',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  },
  {
    path: '/DigitalHuman',
    component: Layout,
    redirect: '/DigitalHuman/BasicInfo',
    name: 'DigitalHuman',
    meta: {
      title: '数字人管理',
      icon: 'ep:avatar'
    },
    children: [
      {
        path: 'BasicInfo',
        component: () => import('@/views/DigitalHuman/BasicInfo/Index.vue'),
        name: 'BasicInfo',
        meta: {
          title: '基础信息',
          icon: 'ep:document'
        }
      },
      {
        path: 'ConfigManage',
        component: () => import('@/views/DigitalHuman/ConfigurationManagement/Index.vue'),
        name: 'ConfigManage',
        meta: {
          title: '配置管理',
          icon: 'ep:user'
        }
      },
      {
        path: 'RealTimeData',
        component: () => import('@/views/DigitalHuman/RealTimeData/Index.vue'),
        name: 'RealTimeData',
        meta: {
          title: '实时数据',
          icon: 'ep:coin'
        }
      },
      {
        path: 'DataBoard',
        component: () => import('@/views/DigitalHuman/DataBoard/Index.vue'),
        name: 'DataBoard',
        meta: {
          title: '数据看板',
          icon: 'ep:help-filled'
        }
      }
    ]
  },
  {
    path: '/ASRManage',
    component: Layout,
    redirect: '/ASRManage/ASRBasicInfo',
    name: 'ASRManage',
    meta: {
      title: 'ASR管理',
      icon: 'ep:headset'
    },
    children: [
      {
        path: 'ASRBasicInfo',
        component: () => import('@/views/ASRManage/BasicInfo/Index.vue'),
        name: 'ASRBasicInfo',
        meta: {
          title: '基础信息',
          icon: 'ep:document'
        }
      },
      {
        path: 'ASRConfigManage',
        component: () => import('@/views/ASRManage/ConfigurationManagement/Index.vue'),
        name: 'ASRConfigManage',
        meta: {
          title: '配置管理',
          icon: 'ep:phone-filled'
        }
      },
      {
        path: 'ASRDataBoard',
        component: () => import('@/views/ASRManage/DataBoard/Index.vue'),
        name: 'ASRDataBoard',
        meta: {
          title: '数据看板',
          icon: 'ep:help-filled'
        }
      }
    ]
  },
  {
    path: '/APIManage',
    component: Layout,
    redirect: '/APIManage/BasicInfo ',
    name: 'APIManage',
    meta: {
      title: 'API管理',
      icon: 'ep:share'
    },
    children: [
      {
        path: 'BasicInfo',
        component: () => import('@/views/APIManage/APIConfig/Index.vue'),
        name: 'apiConfig',
        meta: {
          title: 'API配置管理',
          icon: 'ep:setting'
        }
      }
    ]
  },
  {
    path: '/StyleManage',
    component: Layout,
    redirect: '/styleManage/StyleTemplate ',
    name: 'StyleManage',
    meta: {
      title: '展示样式管理',
      icon: 'ep:operation'
    },
    children: [
      {
        path: 'StyleTemplate',
        component: () => import('@/views/StyleManage/StyleTemplate/Index.vue'),
        name: 'StyleTemplate',
        meta: {
          title: '样式模版管理',
          icon: 'ep:histogram'
        }
      }
    ]
  },
  {
    path: '/modelConfig',
    component: Layout,
    redirect: '/modelConfig/modelMarket ',
    name: 'modelConfig',
    meta: {
      title: '模型配置',
      icon: 'ep:cpu'
    },
    children: [
      {
        path: 'modelMarket',
        component: () => import('@/views/modelConfig/modelMarket/Index.vue'),
        name: 'modelMarket',
        meta: {
          title: '模型广场',
          icon: 'ep:postcard'
        }
      }
    ]
  },
  {
    path: '/AppManagement',
    component: Layout,
    redirect: '/AppManagement/AppSquare',
    name: 'AppManagement',
    meta: {
      title: '应用管理',
      icon: 'ep:monitor'
    },
    children: [
      {
        path: 'AppSquare',
        component: () => import('@/views/AppManagement/AppSquare/Index.vue'),
        name: 'AppSquare',
        meta: {
          title: '应用广场',
          icon: 'ep:menu'
        }
      }
    ]
  },
  {
    path: '/Knowledge',
    component: Layout,
    redirect: '/Knowledge/KnowledgeMange ',
    name: 'Knowledge',
    meta: {
      title: '知识库',
      icon: 'ep:management'
    },
    children: [
      {
        path: 'KnowledgeMange',
        component: () => import('@/views/Knowledge/KnowledgeMange/Index.vue'),
        name: 'KnowledgeMange',
        meta: {
          title: '知识库管理',
          icon: 'ep:reading'
        }
      }
    ]
  },
  {
    path: '/SystemLog',
    component: Layout,
    redirect: '/SystemLog/OperationLog',
    name: 'SystemLog',
    meta: {
      title: '系统日志',
      icon: 'ep:refrigerator'
    },
    children: [
      {
        path: 'OperationLog',
        component: () => import('@/views/SystemLog/OperationLog/Index.vue'),
        name: 'OperationLog',
        meta: {
          title: '操作日志',
          icon: 'ep:memo'
        }
      },
      {
        path: 'QuestionLog',
        component: () => import('@/views/SystemLog/QuestionLog/Index.vue'),
        name: 'QuestionLog',
        meta: {
          title: '问答日志',
          icon: 'ep:chat-line-round'
        }
      }
    ]
  },
  {
    path: '/systemConfig',
    component: Layout,
    redirect: '/systemConfig/ ',
    name: 'systemConfig',
    meta: {
      title: '系统管理',
      icon: 'ep:platform'
    },
    children: [
      {
        path: 'Dict',
        component: () => import('@/views/Dict/Index.vue'),
        name: 'Dict',
        meta: {
          title: '数据字典',
          icon: 'ep:notebook'
        }
      }
    ]
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_PATH),
  strict: true,
  routes: asyncRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})
// 路由跳转前的监听操作
router.beforeEach((to, from) => {})
export const resetRouter = (): void => {
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !NO_RESET_WHITE_LIST.includes(name as string)) {
      // router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
