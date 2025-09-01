<script setup lang="tsx">
import { getAddSchema, getAddSchemaRules } from '../data'
import { handleSave } from '../IndexApi'
const dialogSchemas = reactive<FormSchema[]>(getAddSchema)
// 配置表单验证，可调用useValidator正则库方便各种情况验证d
const rules = reactive(getAddSchemaRules)

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose, setSchema } = formMethods

const type = ref('add')

/**
 * 新增、编辑提交事件
 * 先进行表单验证，验证通过则进行编辑或新增提交
 */
const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate()
  if (valid) {
    const formData = await getFormData(false)
    const res = await handleSave(formData)
    if (res.success) {
      useMessage('success', res.message || '操作成功')
      return true
    } else {
      return false
    }
  }
}

const feedBackData = (row = {}) => {}
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
:deep(.el-textarea__inner) {
  resize: none;
  // 隐藏右下角拖动手柄
  &::-webkit-resizer {
    display: none;
  }
}
:deep(.el-upload) {
  position: relative;
  left: 0px;
  overflow: hidden;
  cursor: pointer;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  transition: var(--el-transition-duration-fast);
  width: 112px;
  height: 112px;
  img {
    height: 112px;
    max-width: 112px;
    object-fit: contain;
  }
  .el-upload:hover {
    border-color: var(--el-color-primary);
  }
  .avatar-uploader {
    line-height: 16px;
    height: 100%;
    color: #8c939d;
    background: #fafafa;
    text-align: center;
    box-sizing: border-box;
    border: 1px solid rgba(0, 0, 0, 0.149);
  }
}
</style>
