<script setup lang="tsx">
import { getEditSchema, getEditSchemaRules } from '../data'
import { handleSave, handleEdit } from '../IndexApi'
onMounted(() => {})

const dialogSchemas = reactive<FormSchema[]>(getEditSchema)

// 配置表单验证，可调用useValidator正则库方便各种情况验证
const rules = reactive(getEditSchemaRules)

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose, setSchema } = formMethods
const type = ref('add')
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
    const res = type.value === 'add' ? await handleSave(formData) : await handleEdit(formData)
    if (res.success) {
      useMessage('success', res.message || '操作成功')
      return true
    } else {
      return false
    }
  }
}

const feedBackData = (row = {}) => {
  type.value = !!Object.keys(row).length ? 'edit' : 'add'
  if (type.value === 'edit') {
    const parm = {}
    Object.keys(row).forEach((key: any) => {
      parm[key] = row[key]
    })
    setValues(parm)
  }
}
defineExpose({
  submit,
  feedBackData
})
</script>

<template>
  <Form
    require-asterisk-position="right"
    :rules="rules"
    @register="formRegister"
    :schema="dialogSchemas"
  />
</template>
<style lang="less" scoped>
.custom-label {
  line-height: 20px;
}
</style>
