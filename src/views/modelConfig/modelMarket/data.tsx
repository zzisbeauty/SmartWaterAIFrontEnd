export const getSearchSchema: FormSchema[] = [
   {
            field:"result_type",
            label:"结果类型",
            component:"Select",
            componentProps:{
                options:[]
            },
          
        },{
       field:"styleName",
            label:"样式名称",
            component:"Select",
            componentProps:{
                options:[]
            },
          
        },{
       field:"type",
            label:"样式类型",
            component:"Select",
            componentProps:{
                options:[]
            },
           
        },{
       field:"styleName",
            label:"状态",
            component:"Select",
            componentProps:{
               
            },
          
        }
]
export const getEditSchema: FormSchema[] = [
  {
    field: 'applicationName',
    label: '名称',
    colProps: {
      span: 24
    },
    component: 'Input'
  },
  {
    label: '应用图标',
    field: 'fileId',
    component: 'FileUpload',
    colProps: {
      span: 24
    },
    componentProps: {
      dataId: '',
      fileList: '',
      onlyImg: false,
      limit: 1,
      accept: 'image/jpg,image/jpeg,image/png',
      beforeUpload: (file) => {
        const isValidType = ['image/jpg', 'image/png', 'image/jpeg'].includes(file.type)
        if (!isValidType) {
          useMessage('warning', '只能上传 JPG/PNG/GIF 格式的图片!')
          return false
        }
        return true
      }
    }
  },
  {
    field: 'applicationDesc',
    label: '应用描述',
    colProps: {
      span: 24
    },
    component: 'Input',
    componentProps: {
      type: 'textarea',
      placeholder: '请输入',
      rows: 5
    }
  }
]
const { required } = useValidator()
export const getEditSchemaRules = {
  applicationName: [required()],
  fileId: [required()],
  applicationDesc: [required()]
}

