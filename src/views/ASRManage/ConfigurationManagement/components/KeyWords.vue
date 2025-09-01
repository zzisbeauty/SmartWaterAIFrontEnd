<script setup lang="tsx">
import { handleSaveKeyword, handleGetKeyword } from '../IndexApi'
import DetailTitle from '@/views/Components/DetailTitle.vue'
const dialogSchemas = reactive<FormSchema[]>([
  {
    label: '唤醒词',
    field: 'wakeUpWord',
    component: 'Input',
    componentProps: {},
    colProps: {
      span: 12
    }
  },
  {
    label: '休眠词',
    field: 'sleepWord',
    component: 'Input',
    componentProps: {},
    colProps: {
      span: 12
    }
  },
  {
    label: '欢迎词',
    field: 'entryWord',
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 6,
      placeholder: '请输入',
      maxlength: 1000,
      showWordLimit: true
    },
    colProps: {
      span: 24
    }
  },
  {
    label: '退场词',
    field: 'exitWord',
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 6,
      placeholder: '请输入',
      maxlength: 1000,
      showWordLimit: true
    },
    colProps: {
      span: 24
    }
  }
])

// 配置表单验证，可调用useValidator正则库方便各种情况验证
const { required } = useValidator()
const rules = reactive({
  wakeUpWord: [required()],
  sleepWord: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose, setSchema } = formMethods
const asrExample: any = ref({})
/**
 * 新增、编辑提交事件
 * 先进行表单验证，验证通过则进行编辑或新增提交
 */
const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData(false)
    formData.id = asrExample.value.id
    console.log(formData)
    const res: any = await handleSaveKeyword(formData)
    if (res.success) {
      useMessage('success', res.message || '操作成功')
      return true
    } else {
      return false
    }
  }
}

const feedBackData = async (row: any = {}) => {
  asrExample.value = row
  // const parm = {}
  // Object.keys(row).forEach((key: any) => {
  //   parm[key] = row[key]
  // })
  // setValues(parm)
  let res = await handleGetKeyword({ id: row.keyWordId })
  const params = {}
  if (res?.result) {
    Object.keys(res?.result).forEach((key: any) => {
      params[key] = row[key]
    })
    setValues(params)
  }
}
defineExpose({
  submit,
  feedBackData
})
</script>

<template>
  <div class="bg-#F8F8F8 w-100% h-48px px-20px box-border">
    <div class="title">配置说明: <span class="content">关键词之间用英文半角逗号分隔。</span></div>
  </div>
  <DetailTitle
    class="my-20px"
    :show-expand="false"
    :item="{
      titleZn: '配置内容: ',
      titleEn: '',
      name: '',
      activeNames: []
    }"
  />
  <Form
    class="w-100%"
    require-asterisk-position="right"
    :rules="rules"
    @register="formRegister"
    :schema="dialogSchemas"
    :gutter="20"
  />
</template>
<style lang="less" scoped>
:deep(.el-textarea__inner) {
  resize: none;
  // 隐藏右下角拖动手柄
  &::-webkit-resizer {
    display: none;
  }
}

.title {
  font-family: Microsoft YaHei UI;
  font-size: 14px;
  font-weight: bold;
  line-height: 48px;
  text-align: 'left';
  letter-spacing: 0em;
  color: #333333;
}
.content {
  font-family: Microsoft YaHei UI;
  font-size: 14px;
  font-weight: normal;
  line-height: 20px;
  letter-spacing: 0em;
  color: #777777;
  padding-left: 5px;
}
</style>
