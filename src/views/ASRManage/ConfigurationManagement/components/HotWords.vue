<script setup lang="tsx">
import { handleSaveHotWord, handleGetHotWord } from '../IndexApi'
import DetailTitle from '@/views/Components/DetailTitle.vue'
const dialogSchemas = reactive<FormSchema[]>([
  {
    label: '',
    field: 'hotWordContent',
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 10,
      placeholder: '请输入内容',
      maxlength: 10000,
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
  //   Content: [required()]
})
const asrExample: any = reactive({})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose, setSchema } = formMethods

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
    console.log(formData)
    formData.hotWordName = asrExample.asrId_dictText
    const res: any = await handleSaveHotWord(formData, { id: asrExample.id })
    if (res.success) {
      useMessage('success', res.message || '操作成功')
      return true
    } else {
      return false
    }
  }
}

const feedBackData = async (row: any = {}) => {
  Object.keys(row).forEach((key: any) => {
    asrExample[key] = row[key]
  })
  let res: any = await handleGetHotWord({ id: asrExample.hotWordId })
  setValues({ hotWordContent: res?.result?.hotWordContent || '' })
}
defineExpose({
  submit,
  feedBackData
})
</script>

<template>
  <div class="bg-#F8F8F8 w-100% h-266px px-20px box-border">
    <div class="title">配置说明:</div>
    <div class="box">
      <div class="content"> 1、最多可添加10000个热词，热词之间用英文半角逗号分隔。 </div>
      <div class="content">
        2、热词表支持英文和中文语言类型。中文语言类型的热词最长支持32字符，英文语言类型的热词最长支持64字符。
      </div>
    </div>
    <div class="title">约束和限制:</div>
    <div class="box">
      <div class="content">
        1、所有含英文的热词均需大写，如：Eiffel铁塔（正确示例为：EIFFEL铁塔）。
      </div>
      <div class="content">
        2、所有数字均用相应的汉字表示，避免使用阿拉伯数字
        ，如：12345服务热线（正确示例为：一二三四五服务热线）。
      </div>
      <div class="content">
        3、热词内容仅包含英文和中文，避免出现标点符号、特殊字符或空格，如：。，？.*等。
      </div>
      <div class="content"> 4、尽量避免配置单音节的英文单词，避免误召回，如：MAY/TEE等。 </div>
      <div class="content">
        5、使用热词表功能时，同一个项目ID，可以共用热词表，不同的项目ID不能共用热词表。
      </div>
    </div>
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
  />
</template>
<style lang="less" scoped>
:deep(.el-col) {
  padding: 0 !important;
}
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
  line-height: 14px;
  text-align: 'left';
  letter-spacing: 0em;
  color: #333333;
  padding-bottom: 20px;
  padding-top: 20px;
}
.content {
  font-family: Microsoft YaHei UI;
  font-size: 14px;
  font-weight: normal;
  line-height: 20px;
  letter-spacing: 0em;
  color: #777777;
  text-indent: 2em;
}
</style>
