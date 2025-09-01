<script lang="tsx">
import { computed, defineComponent, unref } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { Backtop } from '@/components/Backtop'
import { Setting } from '@/components/Setting'
import { useRenderLayout } from './components/useRenderLayout'
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('layout')

const appStore = useAppStore()

// 是否是移动端
const mobile = computed(() => appStore.getMobile)

// 菜单折叠
const collapse = computed(() => appStore.getCollapse)

const layout = computed(() => appStore.getLayout)

const handleClickOutside = () => {
  appStore.setCollapse(true)
}
// 如果在iframe中，隐藏layout布局，使用独特的iframe布局,isInIframe为true
const isInIframe = window.self !== window.top 
const renderLayout = () => {
  if (isInIframe) {
    const { renderInIframe } = useRenderLayout()
    return renderInIframe()
  } else {
    switch (unref(layout)) {
      case 'classic':
        const { renderClassic } = useRenderLayout()
        return renderClassic()
      case 'topLeft':
        const { renderTopLeft } = useRenderLayout()
        return renderTopLeft()
      case 'top':
        const { renderTop } = useRenderLayout()
        return renderTop()
      case 'cutMenu':
        const { renderCutMenu } = useRenderLayout()
        return renderCutMenu()
      default:
        break
    }
  }
}

export default defineComponent({
  name: 'Layout',
  setup() {
    return () => (
      <section  class={[prefixCls, `${prefixCls}__${layout.value}`, 'w-[100%] h-[100%] relative']}>
        {mobile.value && !collapse.value ? (
          <div
            class="absolute top-0 left-0 w-full h-full opacity-30 z-99 bg-[var(--el-color-black)]"
            onClick={handleClickOutside}
          ></div>
        ) : undefined}
        {renderLayout()}
        {/* 如果在iframe中，不显示返回顶部和设置 */}
        {!isInIframe ? <Backtop></Backtop> : undefined}
        {!isInIframe ? <Setting></Setting> : undefined}
      </section>
    )
  }
})
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-layout';

.@{prefix-cls} {
  background-color: var(--app-content-bg-color);
  :deep(.@{elNamespace}-scrollbar__view) {
    height: 100% !important;
    // width: calc(100% - var(--app-content-padding) - var(--app-content-padding));
  }
  :deep(.@{elNamespace}-scrollbar__bar) {
    right: 0px;
  }
  :deep(.is-horizontal) {
    height: 5px;
    border-radius: 9px;
    left: 0;
  }
  :deep(.is-vertical) {
    width: 5px;
    border-radius: 9px;
  }
}
</style>
