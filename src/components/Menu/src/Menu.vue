<script lang="tsx">
import { computed, defineComponent, unref, PropType } from 'vue'
import { ElMenu, ElScrollbar } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { useRenderMenuItem } from './components/useRenderMenuItem'
import { useRouter } from 'vue-router'
import { isUrl } from '@/utils/is'
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('menu')

export default defineComponent({
  name: 'Menu',
  props: {
    menuSelect: {
      type: Function as PropType<(index: string) => void>,
      default: undefined
    }
  },
  setup(props) {
    const appStore = useAppStore()

    const layout = computed(() => appStore.getLayout)

    const { push, currentRoute } = useRouter()

    const permissionStore = usePermissionStore()

    const menuMode = computed((): 'vertical' | 'horizontal' => {
      // 竖
      const vertical: LayoutType[] = ['classic', 'topLeft', 'cutMenu']

      if (vertical.includes(unref(layout))) {
        return 'vertical'
      } else {
        return 'horizontal'
      }
    })

    const routers = computed(() =>
      unref(layout) === 'cutMenu' ? permissionStore.getMenuTabRouters : permissionStore.getRouters
    )

    const collapse = computed(() => appStore.getCollapse)

    const uniqueOpened = computed(() => appStore.getUniqueOpened)

    const activeMenu = computed(() => {
      const { meta, path } = unref(currentRoute)
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu as string
      }
      return path
    })

    const menuSelect = (index: string) => {
      if (props.menuSelect) {
        props.menuSelect(index)
      }
      // 自定义事件
      if (isUrl(index)) {
        window.open(index)
      } else {
        push(index)
      }
    }

    const renderMenuWrap = () => {
      if (unref(layout) === 'top') {
        return renderMenu()
      } else {
        return <ElScrollbar>{renderMenu()}</ElScrollbar>
      }
    }

    const renderMenu = () => {
      return (
        <ElMenu
          defaultActive={unref(activeMenu)}
          mode={unref(menuMode)}
          popperClass={'myPopperClass'}
          collapse={
            unref(layout) === 'top' || unref(layout) === 'cutMenu' ? false : unref(collapse)
          }
          uniqueOpened={unref(layout) === 'top' ? false : unref(uniqueOpened)}
          backgroundColor={
            unref(layout) === 'top'
              ? 'var(--right-menu-top-bg-color)'
              : 'var(--right-menu-bg-color)'
          }
          textColor={
            unref(layout) === 'top'
              ? 'var(--right-menu-top-text-color)'
              : 'var(--right-menu-text-color)'
          }
          activeTextColor="var(--right-menu-text-active-color)"
          onSelect={menuSelect}
        >
          {{
            default: () => {
              const { renderMenuItem } = useRenderMenuItem(unref(menuMode))
              return renderMenuItem(unref(routers))
            }
          }}
        </ElMenu>
      )
    }

    return () => (
      <div
        id={prefixCls}
        class={[
          `${prefixCls} ${prefixCls}__${unref(menuMode)}`,
          'h-[100%] overflow-hidden flex-col bg-[var(--right-menu-bg-color)]',
          unref(layout) === 'top'
            ? 'bg-[var(--right-menu-top-bg-color)]'
            : 'bg-[var(--right-menu-bg-color)]',
          unref(layout) === 'top' ? '' : 'haveBoxShadow',
          {
            'w-[var(--left-menu-min-width)]': unref(collapse) && unref(layout) !== 'cutMenu',
            'w-[var(--left-menu-max-width)]': !unref(collapse) && unref(layout) !== 'cutMenu'
          }
        ]}
      >
        {renderMenuWrap()}
      </div>
    )
  }
})
</script>

<style lang="less" scoped>
.myPopperClass {
  color: red;
}
:deep(.is-vertical) {
  width: 0px !important;
}
:deep(.@{elNamespace}-scrollbar__wrap) {
  // padding: 0 6px;
}
/* .haveBoxShadow {
  box-shadow:
    rgb(118 118 118 / 20%) 1px -1px 4px,
    inset rgba(118, 118, 118, 0.1) 2px -4px 4px;
} */
@prefix-cls: ~'@{namespace}-menu';

.@{prefix-cls} {
  position: relative;
  transition: width var(--transition-time-02);
  // box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  // box-shadow: rgb(118 118 118 / 20%) 0px -1px 4px;
  // padding: 8px 0;
  // background-color: var(--right-menu-bg-active-color) !important;
  :deep(.@{elNamespace}-menu) {
    width: 100% !important;
    border-right: none;
    // 设置选中时子标题的颜色
    .is-active {
      & > .@{elNamespace}-sub-menu__title {
        color: var(--right-menu-text-active-color) !important;
      }
    }
    .@{elNamespace}-sub-menu .@{elNamespace}-menu {
      background-color: var(--right-menu-bg-light-color);
    }
    // 设置子菜单悬停的高亮和背景色
    .@{elNamespace}-sub-menu__title,
    .@{elNamespace}-menu-item {
      margin-bottom: 2px;
      &:hover {
        color: var(--right-menu-text-active-color) !important;
        background-color: var(--right-menu-bg-active-color) !important;
        // border-radius: 5px;
      }
    }

    // 设置选中时的高亮背景和高亮颜色
    .@{elNamespace}-menu-item.is-active {
      color: var(--right-menu-text-active-color) !important;
      background-color: var(--right-menu-bg-active-color) !important;

      &:hover {
        background-color: var(--right-menu-bg-active-color) !important;
      }
    }

    .@{elNamespace}-menu-item.is-active {
      position: relative;
      // border-radius: 5px;
    }

    // 设置子菜单的背景颜色
    .@{elNamespace}-menu {
      .@{elNamespace}-sub-menu__title,
      .@{elNamespace}-menu-item:not(.is-active) {
        background-color: var(--right-menu-bg-light-color);
      }
    }
  }

  // 折叠时的最小宽度
  :deep(.@{elNamespace}-menu--collapse) {
    width: var(--left-menu-min-width);

    & > .is-active,
    & > .is-active > .@{elNamespace}-sub-menu__title {
      position: relative;
      // background-color: var(--left-menu-collapse-bg-active-color) !important;
    }
    .@{elNamespace}-sub-menu__title {
      padding: 0 16px;
    }
  }

  // 折叠动画的时候，就需要把文字给隐藏掉
  :deep(.horizontal-collapse-transition) {
    .@{prefix-cls}__title {
      display: none;
    }
  }

  // 水平菜单
  &__horizontal {
    height: calc(~'var(--top-tool-height)') !important;

    :deep(.@{elNamespace}-menu--horizontal) {
      height: calc(~'var(--top-tool-height)');
      border-bottom: none;
      // 重新设置底部高亮颜色
      & > .@{elNamespace}-sub-menu.is-active {
        .@{elNamespace}-sub-menu__title {
          border-bottom-color: var(--el-color-primary) !important;
        }
      }

      .@{elNamespace}-menu-item.is-active {
        position: relative;

        &::after {
          display: none !important;
        }
      }

      .@{prefix-cls}__title {
        /* stylelint-disable-next-line */
        max-height: calc(~'var(--top-tool-height) - 2px') !important;
        /* stylelint-disable-next-line */
        line-height: calc(~'var(--top-tool-height) - 2px');
      }
    }
  }
}
</style>

<style lang="less" scoped>
:deep(.el-sub-menu .el-menu) {
  padding: 0 6px !important;
}
:deep(.el-sub-menu) {
  padding: 0 2px !important;
}
@prefix-cls: ~'@{namespace}-menu-popper';
.@{prefix-cls}--horizontal > ul {
  padding: 5px 5px !important;
}
.@{prefix-cls}--vertical,
.@{prefix-cls}--horizontal {
  // 设置选中时子标题的颜色
  .is-active {
    & > .el-sub-menu__title {
      color: var(--right-menu-text-active-color) !important;
      position: relative;
      border-radius: 5px;
    }
  }

  // 设置子菜单悬停的高亮和背景色
  .el-sub-menu__title,
  .el-menu-item {
    margin-bottom: 2px;
    &:hover {
      color: var(--right-menu-text-active-color) !important;
      background-color: var(--right-menu-bg-active-color) !important;
      border-radius: 5px;
      // margin: 1px 0;
    }
  }

  // 设置选中时的高亮背景
  .el-menu-item.is-active {
    position: relative;
    background-color: var(--right-menu-bg-active-color) !important;

    &:hover {
      background-color: var(--right-menu-bg-active-color) !important;
    }
  }
}
</style>
