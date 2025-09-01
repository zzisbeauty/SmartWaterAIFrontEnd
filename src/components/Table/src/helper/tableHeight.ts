import { ref, reactive, computed, watch, onMounted, unref, toRef, PropType, onUpdated } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { getCssVar } from '@/utils'
const getTableHeight = () => {
    const throttle = (fn, wait = 50) => {
        // 上一次执行 fn 的时间
        let previous = 0
        // 将 throttle 处理结果当作函数返回
        return function (...args) {
          // 获取当前时间，转换成时间戳，单位毫秒
          const now = +new Date()
          // 将当前时间和上一次执行函数的时间进行对比
          // 大于等待时间就把 previous 设置为当前时间并执行函数 fn
          if (now - previous > wait) {
            previous = now
            fn.apply(this, args)
          }
        }
      }
      const filterPx = (cssVal: String) => {
        return Number(cssVal.replace('px', ''))
      }
      const appStore = useAppStore()
      const fixedHeader = ref(appStore.getFixedHeader)
      const tableHeight = ref<number>(0)
      const tableWrapRef = ref<ElRef>(null)
      let resizeListener: EventListener | null = null;
      const resize = throttle(() => {
        const topDistance: any = tableWrapRef.value?.getBoundingClientRect().top
        tableHeight.value =
          window.innerHeight - topDistance - 15 - filterPx(getCssVar('--app-pagination-height'))
      }, 100)
      const getInitHeight = () => {
        const topDistance: any = tableWrapRef.value?.getBoundingClientRect().top
        console.log(tableWrapRef.value)
        tableHeight.value =
          window.innerHeight - topDistance - 15 - filterPx(getCssVar('--app-pagination-height'))
          resizeListener = () => {
            if (tableWrapRef.value) {
              resize();
            }
          }
          window.addEventListener('resize', resizeListener);
          onUnmounted(() => {
            if (resizeListener) {
              window.removeEventListener('resize', resizeListener);
            }
          })
      }
  return { tableHeight, tableWrapRef, getInitHeight }
}
export default getTableHeight
