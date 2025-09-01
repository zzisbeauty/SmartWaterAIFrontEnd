<script setup lang="tsx">
import { clear } from 'console'

// import { Form } from '@/components/Form'
// import { useForm } from '@/hooks/web/useForm'
// import { onMounted, reactive, ref } from 'vue'
// import { FormSchema } from '@/components/Form'
const { required, isMobileOrNull } = useValidator()

onMounted(() => {})

const dialogSchemas = reactive<FormSchema[]>([
  {
    field: 'apiCode',
    label: '接口编号',
    colProps: {
      span: 12
    },
    component: 'Input',
    componentProps: {}
  },
  {
    field: 'apiName',
    label: '接口名称',
    colProps: {
      span: 12
    },
    component: 'Input',
    componentProps: {}
  },
  {
    field: 'categoryId',
    label: '所属分类',
    colProps: {
      span: 12
    },
    component: 'Select',
    componentProps: { clearable: false },
    optionApi: async () => {
      const res = await getDictById({ code: 'api_categray' })
      return res || []
    }
  },
  {
    field: 'businessSystemCode',
    label: '所属业务系统',
    colProps: {
      span: 12
    },
    component: 'Select',
    componentProps: { clearable: false },
    optionApi: async () => {
      const res = await getDictById({ code: 'business_code' })
      return res || []
    }
  },
  {
    field: 'apiDesc',
    label: '接口描述',
    colProps: {
      span: 24
    },
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 4
    }
  },
  {
    field: 'type',
    label: '类型',
    colProps: {
      span: 24
    },
    component: 'RadioGroup',
    componentProps: {
      on: {
        change: async (value) => {
          dialogSchemas.forEach((schema) => {
            switch (value) {
              case '1': // 网关接口
                schema.hidden = !(
                  schema.field === 'apiCode' ||
                  schema.field === 'apiName' ||
                  schema.field === 'categoryId' ||
                  schema.field === 'businessSystemCode' ||
                  schema.field === 'apiDesc' ||
                  schema.field === 'type' ||
                  schema.field === 'requestType' ||
                  schema.field === 'apiSecret'
                )
                break
              case '2': // 一般接口
                schema.hidden = !(
                  schema.field === 'apiCode' ||
                  schema.field === 'apiName' ||
                  schema.field === 'categoryId' ||
                  schema.field === 'businessSystemCode' ||
                  schema.field === 'apiDesc' ||
                  schema.field === 'type' ||
                  schema.field === 'requestType' ||
                  schema.field === 'url'
                )
                break
              case '3': // 链接
                schema.hidden = !(
                  schema.field === 'apiCode' ||
                  schema.field === 'apiName' ||
                  schema.field === 'categoryId' ||
                  schema.field === 'businessSystemCode' ||
                  schema.field === 'apiDesc' ||
                  schema.field === 'type' ||
                  schema.field === 'linkUrl'
                )
                break
              default:
                schema.hidden = true // 默认隐藏所有特殊表单项
            }
          })
        }
      }
    },
    optionApi: async () => {
      const res = await getDictById({ code: 'api_type' })
      return res || []
    }
  },
  {
    field: 'requestType',
    label: '请求类型',
    colProps: {
      span: 24
    },
    component: 'Select',
    value: 'GET',
    componentProps: { clearable: false },
    optionApi: async () => {
      const res = await getDictById({ code: 'request_type' })
      return res || []
    },
    hidden: true
  },
  {
    field: 'apiSecret',
    label: '接口密钥',
    colProps: {
      span: 24
    },
    component: 'Input',
    componentProps: {},
    hidden: true
  },
  {
    field: 'url',
    label: '请求地址',
    colProps: {
      span: 24
    },
    component: 'Input',
    componentProps: {},
    hidden: true
  },
  {
    field: 'linkUrl',
    label: '链接地址',
    colProps: {
      span: 24
    },
    component: 'Input',
    componentProps: {},
    hidden: true
  }
])
const formData = reactive({
  type: null // 初始化 type 为 null
})

// 监听 type 的变化
watch(
  () => formData.type,
  (newVal) => {
    dialogSchemas.forEach((schema) => {
      switch (newVal) {
        case '1': // 网关接口
          schema.hidden = !(
            schema.field === 'apiCode' ||
            schema.field === 'apiName' ||
            schema.field === 'categoryId' ||
            schema.field === 'businessSystemCode' ||
            schema.field === 'apiDesc' ||
            schema.field === 'type' ||
            schema.field === 'requestType' ||
            schema.field === 'apiSecret'
          )
          break
        case '2': // 一般接口
          schema.hidden = !(
            schema.field === 'apiCode' ||
            schema.field === 'apiName' ||
            schema.field === 'categoryId' ||
            schema.field === 'businessSystemCode' ||
            schema.field === 'apiDesc' ||
            schema.field === 'type' ||
            schema.field === 'requestType' ||
            schema.field === 'url'
          )
          break
        case '3': // 链接
          schema.hidden = !(
            schema.field === 'apiCode' ||
            schema.field === 'apiName' ||
            schema.field === 'categoryId' ||
            schema.field === 'businessSystemCode' ||
            schema.field === 'apiDesc' ||
            schema.field === 'type' ||
            schema.field === 'linkUrl'
          )
          break
        default:
          schema.hidden = true // 默认隐藏所有特殊表单项
      }
    })
  }
)
// 配置表单验证，可调用useValidator正则库方便各种情况验证
const rules = reactive({
  apiCode: [required()],
  apiName: [required()],
  categoryId: [required()], //
  businessSystemCode: [required()],
  apiDesc: [required()], //接口描述
  type: [required()],
  requestType: [required()],
  apiSecret: [required()],
  url: [required()],
  linkUrl: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose, setSchema } = formMethods

/**
 * 新增、编辑提交事件
 * 先进行表单验证，验证通过则进行编辑或新增提交
 */
const submit = async (boolean) => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log('验证失败', err)
  })
  if (valid || !boolean) {
    const formData = await getFormData(false)
    return {
      ...apiFromData.value,
      baseInfo: {
        ...apiFromData.value.baseInfo,
        ...formData
      }
    }
  }
}

const apiFromData: any = ref({})
const feedBackData = async (data) => {
  debugger
  apiFromData.value = data
  console.log('baseinfo-----feedBackData', data)
  if (data.baseInfo) {
    setValues({
      apiCode: data.baseInfo.apiCode,
      apiName: data.baseInfo.apiName,
      categoryId: data.baseInfo.categoryId,
      businessSystemCode: data.baseInfo.businessSystemCode,
      apiDesc: data.baseInfo.apiDesc,
      type: data.baseInfo.type,

      requestType: data.baseInfo.requestType,
      apiSecret: data.baseInfo.apiSecret,
      url: data.baseInfo.url,
      linkUrl: data.baseInfo.linkUrl,
      resultType: data.baseInfo.resultType
    })
    formData.type = data.baseInfo.type
  }
}

defineExpose({
  submit,
  feedBackData
})
</script>

<template>
  <div class="w-100% pt-40px pl-12% pr-18% box-border">
    <Form
      require-asterisk-position="right"
      :rules="rules"
      @register="formRegister"
      :schema="dialogSchemas"
    />
  </div>
</template>
