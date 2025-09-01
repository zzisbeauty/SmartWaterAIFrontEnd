import { ElMessage } from 'element-plus'

export const useMessage = (type, content) => {
  ElMessage({
    type: type,
    message: content,
    showClose: type === 'error' || false,
    offset: window.innerHeight / 2 - 24
  })
}
