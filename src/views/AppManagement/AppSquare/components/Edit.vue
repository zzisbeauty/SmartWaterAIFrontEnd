<script setup lang="tsx">
import { getEditSchema, getEditSchemaRules, uploadedFile } from '../data'
import { handleSave, handleEdit } from '../IndexApi'
const allConfig: any = inject('allConfig')
const type = ref('add')
const dialogSchemas = reactive<FormSchema[]>(getEditSchema)

// 配置表单验证，可调用useValidator正则库方便各种情况验证
// const rules = reactive(getEditSchemaRules)
const rules = {}

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose, setSchema } = formMethods

/**
 * 新增、编辑提交事件
 * 先进行表单验证，验证通过则进行编辑或新增提交
 */
const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log('验证失败', err)
  })
  if (valid) {
    const formData = await getFormData(false)
    allConfig.id = formData.id
    allConfig.applicationName = formData.applicationName
    allConfig.applicationCode = formData.applicationCode
    allConfig.applicationDesc = formData.applicationDesc
    allConfig.helpLink = formData.helpLink
    allConfig.fileId = uploadedFile.fileId
    allConfig.iconUrl = uploadedFile.fileUrl
    return true
  } else {
    return false
  }
}
/* const submit = async () => {
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
} */
onMounted(() => {
  setValues({ ...allConfig })
  uploadedFile.fileUrl = allConfig.iconUrl
  uploadedFile.fileId = allConfig.fileId
})
const feedBackData = async (row: any = {}) => {
  type.value = !!Object.keys(row).length ? 'edit' : 'add'
  if (type.value === 'edit') {
    setValues({ ...row })
  }
}
onBeforeUnmount(async () => {
  if (!(await submit())) {
    useMessage('warning', '请填写完整信息')
  }
})
defineExpose({
  submit,
  feedBackData
})
</script>

<template>
  <div class="w-100% h-100% p50px box-border">
    <Form
      require-asterisk-position="right"
      :rules="rules"
      @register="formRegister"
      :schema="dialogSchemas"
    />
  </div>
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
