<script setup lang="tsx">
import { Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { reactive, ref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/components/Form'
import { commonGetData, commonPostData } from '@/utils/request'
import { GetLocation } from '@/components/GetLocation'
import { LocateBtn } from '@/components/LocateBtn'
import {handleLeftAdd,handleLeftEdit } from './leftTreeApi'
const { required, isMobileOrNull } = useValidator()
const props = defineProps({
  treeData: {
    type: Array,
    default: () => []
  },
  mode:{
        type:String
    }
})

const isEdit = ref(false)
const dialogSchemas = reactive<FormSchema[]>([
    {
    label: '父级',
    field: 'parentId',
    component: 'TreeSelect',
    componentProps: {
        disabled:true,
        nodeKey: 'id',
        props: {
          label: 'name',
          children: 'childTree',
        },
        data:props.treeData
      },
   
    colProps: {
      span: 24
    }
  },
  {
    label: '名称',
    field: 'name',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
])

// 配置表单验证，可调用useValidator正则库方便各种情况验证
const rules = reactive({
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods


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
    const formData = await getFormData()
    console.log(formData)
    formData.mode = props.mode
    // const res:any = await handleLeftAdd(formData)
    // if (res.success) {
    //     return res.message
    //   } else {
    //     return false
    //   }
    if (isEdit.value) {
      // 编辑数据
      const res: any = await handleLeftEdit(formData)
      console.log(res)
      if (res.success) {
        return res.message
      } else {
        return false
      }
    } else {
      // 新增数据
      const res: any = await handleLeftAdd(formData)
      if (res.success) {
        return res.message
      } else {
        return false
      }
    }
  }
}

const isDisable = ref(false)
const feedBackDataAdd = (row)=>{
    isEdit.value = false
    const parm = {}
    Object.keys(row).forEach((key: any) => {
        parm[key] = row[key]
    })
    setValues(parm)
}

const feedBackData = (row) => {
  isEdit.value = true
  const parm = {}
  Object.keys(row).forEach((key: any) => {
    parm[key] = row[key]
  })
  setValues(parm)
}
defineExpose({
  submit,
  feedBackData,feedBackDataAdd
})
</script>

<template>
  <div>
    <Form
      require-asterisk-position="right"
      :disabled="isDisable"
      :rules="rules"
      @register="formRegister"
      :schema="dialogSchemas"
    />
  </div>
</template>
