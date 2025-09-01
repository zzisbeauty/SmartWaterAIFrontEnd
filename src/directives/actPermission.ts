import { Directive, App } from 'vue'
import { permissionList } from '@/utils/actPermission'

const actPermissionSet = new Set(permissionList); // 使用 Set 提升查找效率
const isDevelopment = import.meta.env.VITE_NODE_ENV === 'development'; // 缓存环境判断

const actPermission: Directive = {
  beforeMount(el, binding) {
    const code = binding.value;
    if (isDevelopment) return; // 开发环境直接返回
    // 统一处理权限判断逻辑
    const hasPermission = Array.isArray(code) 
      ? code.some(item => actPermissionSet.has(item))
      : actPermissionSet.has(code);
    // 无权限时移除元素
    if (!hasPermission) {
        el.parentNode.removeChild(el);
    }
  }
}

export function setupActPermissionDirective(app: App) {
  app.directive('actPermission', actPermission)
}

export default actPermission