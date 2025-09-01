<script setup lang="tsx">
import {  handleAddData,handleEditData} from '../IndexApi'
const props = defineProps<{
    ids?: any[]
}>()


const dialogSchemas = reactive<FormSchema[]>([
    {
        label: '字典名称',
        field: 'dictName',
        component: 'Input',
        colProps: {
            span: 24
        },

    },
    {
        label: '字典编码',
        field: 'dictCode',
        component: 'Input',
        colProps: {
            span: 24
        },
    },
    {
        label: '描述',
        field: 'description',
        component: 'Input',
        colProps: {
            span: 24
        },
        componentProps: {
            type: 'textarea',
            rows: 4
        }
    },
   
])

// 配置表单验证，可调用useValidator正则库方便各种情况验证
const { required, isMobileOrNull } = useValidator()
const rules = reactive({
    frequency: [required()],
    algorithmScene: [required()]
})

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
        let res:any;
        if(formData.id){
             res = await handleEditData(formData)
        }else{
            res = await handleAddData(formData)
        }
        if (res.success) {
            return res.message || '操作成功'
        } else {
            return false
        }
    }
}

const feedBackData = async (row = {}) => {
    const parm = {}
    Object.keys(row).forEach((key: any) => {
        parm[key] = row[key]
    })
    setValues(parm)
}
defineExpose({
    submit,
    feedBackData
})
</script>

<template>
    <Form require-asterisk-position="right" :rules="rules" @register="formRegister" :schema="dialogSchemas" />
</template>
<style lang="less" scoped></style>
