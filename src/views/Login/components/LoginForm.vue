<script setup lang="tsx">
import { reactive, ref, watch, onMounted, unref } from 'vue'
import { Form, FormSchema } from '@/components/Form'
import { useI18n } from '@/hooks/web/useI18n'
import { ElCheckbox, ElLink } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { useValidator } from '@/hooks/web/useValidator'
import { useUserStore } from '@/store/modules/user'
import { BaseButton } from '@/components/Button'
import { usePermissionStore } from '@/store/modules/permission'
import { loginApi, commonGetData, apiGetData, apiPostData } from '@/utils/request'
import md5 from 'md5'
import userIcon from '@/assets/imgs/login/user-icon.png'
import type { RouteRecordRaw } from 'vue-router'
import { doSM2Encrypt } from '@/utils/sm2'

const { required } = useValidator()

const userStore = useUserStore()

const { currentRoute, push, addRoute } = useRouter()

const { t } = useI18n()

const rules = {
  usercode: [required()],
  password: [required()]
}
const permissionStore: any = usePermissionStore()
const schema = reactive<FormSchema[]>([
  {
    field: 'title',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return <h2 class="login-title text-2xl font-bold text-center w-[100%]">用户登录</h2>
        }
      }
    }
  },
  {
    field: 'usercode',
    // value: 'admin',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: '账户',
      slots: {
        prefix: () => <img class="input-icon" src={userIcon} />
      }
    }
  },
  {
    field: 'password',
    // value: 'admin',
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%'
      },
      placeholder: '密码'
    }
  },
  {
    field: 'tool',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="mb-36px flex justify-between items-center w-[100%]">
                <ElCheckbox v-model={remember.value} label={t('login.remember')} />
                <ElLink underline={true}>{t('login.forgetPassword')}</ElLink>
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'login',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="w-[100%]">
                <BaseButton
                  loading={loading.value}
                  type="primary"
                  class="w-[100%]"
                  onClick={signIn}
                >
                  {t('login.login')}
                </BaseButton>
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'other',
    component: 'Divider',
    label: 'xxx技术有限公司',
    componentProps: {
      contentPosition: 'center'
    }
  }
])

const remember = ref(userStore.getRememberMe)

const initLoginInfo = () => {
  const loginInfo = userStore.getLoginInfo
  if (loginInfo) {
    const { usercode, password } = loginInfo
    setValues({ usercode, password })
  }
}
const ip = ref('')
const devicetype = ref('')
onMounted(() => {
  getIP((val) => {
    ip.value = val
  })
  devicetype.value = getDeviceType()
  initLoginInfo()
})

const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose, setValues } = formMethods

const loading = ref(false)

const redirect = ref<string>('')

watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)

function buildFunctionTree(functions) {
  const map = {} // 用于快速查找节点
  const tree = [] // 最终的树形结构
  // 初始化 map
  functions.forEach((item) => {
    map[item.functionguid] = { ...item, children: [] }
  })
  // 构建树形结构
  functions.forEach((item) => {
    if (item.pid && map[item.pid]) {
      // 如果有父节点，则添加到父节点的 children 中
      // map[item.pid].children.push(map[item.functionguid]);
      if (map[item.functionguid].isoutlink == 1) {
        map[item.pid].children.push(map[item.functionguid])
      }
    } else {
      // 没有父节点的节点是根节点
      tree.push(map[item.functionguid])
    }
  })
  return tree
}

const generateRouters = (node: any) => ({
  path: node.functionroute || 'Application',
  name: node.functionroute,
  component: node.componenturl,
  meta: {
    title: node.name,
    icon: node.icon,
    actions: node.sysAction || []
  },
  children: (node.children || []).map((child) => generateRouters(child))
})

// 登录
const signIn = async () => {
  const formRef = await getElFormExpose()
  await formRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const formData = await getFormData()

      try {
        const param = {
          //   usercode: formData.usercode,
          //   password: md5(formData.password)
          usercode: formData.usercode,
          password: doSM2Encrypt(formData.password),
          ip: ip.value,
          devicetype: devicetype.value
        }
        // const res: any = await loginApi(param)
        const res: any = await apiPostData('403549338db2f283dc8e9065de815ec2', param)
        if (res) {
          // 是否记住我
          if (unref(remember)) {
            userStore.setLoginInfo({
              usercode: formData.usercode,
              password: formData.password
            })
          } else {
            userStore.setLoginInfo(undefined)
          }
          userStore.setTicket(res.result.ticket)
          userStore.setRememberMe(unref(remember))
          await Promise.all([
            getRole()
            // getMenu()
          ])

          push({ path: '/' })
        }
      } finally {
        loading.value = false
      }
    }
  })
}

// 获取角色信息
const getRole = async () => {
  const res: any = await apiGetData('ef86dba206036c22e69c9574dead99a2', {})
  userStore.setUserInfo(res.result)
}
// 获取导航
const getMenu = async () => {
  const res: any = await apiGetData('2b0409399bf66f1be0064cd3bf64f3bd', {})
  const user = res.result.user
  userStore.setUserInfo(user)
  const nav = res.result.nav
  const processedData = nav
    .map((app) => {
      if (app.applicationServerName === import.meta.env.VITE_BASE_PATH.replace('/', '')) {
        return {
          ...app,
          children: buildFunctionTree(app.function)
        }
      }
    })
    .filter(Boolean) // 过滤掉 falsy 值（如 undefined、null、空数组/对象等）
  const routers = (processedData[0]?.children || []).map((e) => generateRouters(e))
  userStore.setRoleRouters(routers)
  await permissionStore.generateRoutes('server', routers).catch(() => {})
  permissionStore.getAddRouters.forEach((route) => {
    addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
  })
  permissionStore.setIsAddRouters(true)
}
</script>

<template>
  <div class="login-form-container">
    <Form
      :schema="schema"
      :rules="rules"
      label-position="top"
      hide-required-asterisk
      size="large"
      class="dark:(border-1 border-[var(--el-border-color)] border-solid)"
      @register="formRegister"
  /></div>
</template>
<style lang="less" scoped>
.login-form-container {
  width: 330px; // 增大表单容器宽度
  position: fixed;
  right: 20%;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  background: #fff;
  padding: 32px; // 增加内边距
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  // 新增响应式样式
  @media screen and (max-width: 768px) {
    width: 85%; // 适配移动端
    right: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

:deep(.el-form) {
  .el-form-item {
    margin-bottom: 12px;
  }

  .login-title {
    // font-size: 22px;
    color: #1a76f0;
    margin-bottom: 32px;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 3px;
      // background: linear-gradient(90deg, #1a76f0, #4f46e5);
      background: #1a76f0;
    }
  }

  .el-input {
    height: 48px;
    margin-bottom: 12px;
    border-radius: 12px;

    .el-input__wrapper {
      background: #f8fafc;
      border-radius: 12px;
      box-shadow: inset 0 0 0 1px #e2e8f0;

      &:hover {
        box-shadow: inset 0 0 0 2px #1a76f0;
      }
    }

    .input-icon {
      width: 16px;
      height: 16px;
      margin-right: 8px;
    }
  }

  .el-button {
    height: 48px;
    border-radius: 12px;
    // background: linear-gradient(135deg, #1a76f0, #4f46e5);
    background: #1a76f0;
    font-weight: 600;
    letter-spacing: 0.5px;

    &:hover {
      opacity: 0.9;
    }
  }
}
// 新增全局样式
:deep(.el-input__wrapper) {
  width: 100%; // 输入框宽度撑满
}

:deep(.el-button) {
  width: 100%; // 按钮宽度撑满
}
:deep(.el-form-item__error)  {
  color: var(--el-color-danger);
  font-size: 12px;
  left: 0;
  line-height: 1;
  padding-top: 2px;
  position: absolute;
  top: 80%;
}
</style>
