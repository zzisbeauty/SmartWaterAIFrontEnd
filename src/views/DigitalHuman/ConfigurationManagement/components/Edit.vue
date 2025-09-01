<script setup lang="tsx">
import DetailTitle from '@/views/Components/DetailTitle.vue'
import { digitalHumanOptions, getEditSchema, getEditSchemaRules, uploadedFile, voiceOptions } from '../data'
import { handleSave, handleEdit, getDigitalHumanExample } from '../IndexApi'
const type = ref('add')


const rules = reactive(getEditSchemaRules)
const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose, setSchema, getComponentExpose } = formMethods
const dialogSchemas = reactive<FormSchema[]>(getEditSchema(setValues))

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
    formData.supportLoseEfficacy = Number(formData.supportLoseEfficacy)
    formData.imageId = uploadedFile.fileId
    formData.imageUrl = uploadedFile.fileUrl
    const res = type.value === 'add' ? await handleSave(formData) : await handleEdit(formData)
    if (res.success) {
      useMessage('success', res.message || '操作成功')
      return true
    } else {
      return false
    }
  }
}
const feedBackData = async (row: any = {}) => {
  type.value = !!Object.keys(row).length ? 'edit' : 'add'
  row.supportLoseEfficacy = String(row.supportLoseEfficacy)
  if (type.value === 'edit') {
    const example = await getDigitalHumanExample({ serviceId: row.serviceId })
    const list: any = example?.result || []
    digitalHumanOptions.value = list
      .find((item) => item.targetName === '形象')
      ?.itemList.map((item) => {
        return {
          label: item.text,
          value: item.key,
          imageUrl: item.remark
        }
      })
    voiceOptions.value = list
      .find((item) => item.targetName === '音色')
      ?.itemList.map((item) => {
        return {
          label: item.text,
          value: item.key
        }
      })
    setValues({ ...row })
    uploadedFile.fileUrl = row.imageUrl
    uploadedFile.fileId = row.id
  }

  // 8a808fa8976209910197cdea07ea0048
  // const parm = {}
  // Object.entries(row).forEach(([key, value]) => {
  //   parm[key] = isRef(value) ? value : ref(value)
  // })
  // delete parm['image']
  // setValues(parm)
}
onMounted(() => {})
defineExpose({
  submit,
  feedBackData
})
</script>

<template>
  <div class="w-100% h-100% flex justify-center">
    <div class="w-55% py-15px px-30px">
      <DetailTitle
        class="mb-9px"
        :show-expand="false"
        :item="{
          titleZn: '基础信息',
          titleEn: '',
          name: '',
          activeNames: []
        }"
      />
      <Form
        require-asterisk-position="right"
        :rules="rules"
        @register="formRegister"
        :schema="dialogSchemas"
      />
    </div>
    <el-divider direction="vertical" style="height: 100%" />
    <div class="h-100% box-border w-45% p-15px pl6px flex flex-col">
      <DetailTitle
        class="mb-9px"
        :show-expand="false"
        :item="{
          titleZn: '预览',
          titleEn: '',
          name: '',
          activeNames: []
        }"
      />
      <div class="bg-#FAFAFA box-border flex-1 h-96%">
        <El-Image
          :src="uploadedFile.fileUrl"
          fit="contain"
          style="
            width: 100%;
            height: 100%;
            padding: 20px;
            box-sizing: border-box;
            object-position: center;
          "
        >
          <template #error>
            <div class="image-slot"> </div>
          </template>
        </El-Image>
      </div>
    </div>
  </div>
</template>
