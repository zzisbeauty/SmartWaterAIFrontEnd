export const getSearchSchema: FormSchema[] = [
  {
    field: 'applicationName',
    label: '名称',
    component: 'Input',
    ConditionalType: '*'
  }
]
export const uploadedFile = reactive<{ fileUrl; fileId }>({ fileUrl: '', fileId: '' })
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
    field: 'iconUrl',
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
      onChangeUrl: (file) => {
        uploadedFile.fileUrl = file.file
        uploadedFile.fileId = file.fileId
      },
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
