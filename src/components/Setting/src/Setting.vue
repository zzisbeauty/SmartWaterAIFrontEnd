<script setup lang="ts">
import { ElDrawer, ElDivider, ElMessage, ElOption } from 'element-plus'
import { ref, unref, computed, watch, onMounted } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ThemeSwitch } from '@/components/ThemeSwitch'
import { colorIsDark, lighten, hexToRGB } from '@/utils/color'
import { useCssVar } from '@vueuse/core'
import { useAppStore } from '@/store/modules/app'
import { setCssVar, getCssVar } from '@/utils'
// import ColorRadioPicker from './components/ColorRadioPicker.vue'
import InterfaceDisplay from './components/InterfaceDisplay.vue'
import LayoutRadioPicker from './components/LayoutRadioPicker.vue'
import { useStorage } from '@/hooks/web/useStorage'
import { useClipboard } from '@vueuse/core'
import { useDesign } from '@/hooks/web/useDesign'
import { useEventBus } from '@/hooks/event/useEventBus'
// const { on,off } = useEventBus()
useEventBus({
    name: 'setTheme',
    callback: (val: any) => {
        setSystemTheme(val)
    }
})
const { clear: storageClear } = useStorage('localStorage')

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('setting')

const appStore = useAppStore()

const { t } = useI18n()

const layout = computed(() => appStore.getLayout)

const drawer = ref(false)
// 主题色相关
const systemTheme = ref(appStore.themeStyle.elThemeStyle)
const systemThemeOption = appStore.themeStyle.systemThemeOption
const themeColorOptions = appStore.themeStyle.themeColorOptions
const setSystemTheme = (elThemeStyle: any) => {
  appStore.themeStyle.elThemeStyle = elThemeStyle
  const systemColor = themeColorOptions.system[elThemeStyle]
  const headerColor = themeColorOptions.header[elThemeStyle]
  const tabColor = themeColorOptions.tab[elThemeStyle]
  const menuColor = themeColorOptions.menu[elThemeStyle]
  setCssVar('--el-color-primary', systemColor)
  setCssVar('--el-disabled-bg-color', '#EFEFEF')
  appStore.setTheme({ elColorPrimary: systemColor })
  setHeaderTheme(headerColor)
  setTabTheme(tabColor)
  setMenuTheme(menuColor)
  if (unref(layout) === 'cutMenu') {
    setMenuTheme('#fff')
  }
  if (unref(layout) === 'cutMenu') {
    // .layout-border__top:before
    const styleElement = document.createElement('style')
    styleElement.textContent = `
    .layout-border__top:before {
      height: 0px;
    }
  `
    document.head.appendChild(styleElement)
  } else {
    const styleElement = document.createElement('style')
    styleElement.textContent = `
    .layout-border__top:before {
      height: 1px;
    }
  `
    document.head.appendChild(styleElement)
  }
}
const setHeaderTheme = (color: string) => {
  const isDarkColor = colorIsDark(color)
  const textColor = isDarkColor ? '#fff' : 'inherit'
  const textHoverColor = isDarkColor ? lighten(color!, 6) : '#f6f6f6'
  const topToolBorderColor = isDarkColor ? color : '#eee'
  setCssVar('--top-header-bg-color', color)
  setCssVar('--top-header-text-color', textColor)
  setCssVar('--top-header-hover-color', textHoverColor)
  // setCssVar('--parting-line', textHoverColor)
  appStore.setTheme({
    topHeaderBgColor: color,
    topHeaderTextColor: textColor,
    topHeaderHoverColor: textHoverColor,
    topToolBorderColor
  })
}

// 设置tab选项的颜色
const setTabTheme = (color: string) => {
  const primaryColor = useCssVar('--el-color-primary', document.documentElement)
  const isDarkColor = colorIsDark(color)
  const theme: Recordable = {
    // 左侧菜单边框颜色
    leftMenuBorderColor: isDarkColor ? 'inherit' : '#eee',
    // 左侧菜单背景颜色
    leftMenuBgColor: color,
    // 左侧菜单浅色背景颜色
    leftMenuBgLightColor: isDarkColor ? lighten(color!, 6) : color,
    // 左侧菜单选中背景颜色
    /* leftMenuBgActiveColor: isDarkColor
      ? 'var(--el-color-primary)'
      : hexToRGB(unref(primaryColor), 0.1), */
    leftMenuBgActiveColor: isDarkColor ? '#000306' : hexToRGB(unref(primaryColor), 0.1),
    // 左侧菜单收起选中背景颜色
    leftMenuCollapseBgActiveColor: isDarkColor
      ? 'var(--el-color-primary)'
      : hexToRGB(unref(primaryColor), 0.1),
    // 左侧菜单字体颜色
    leftMenuTextColor: isDarkColor ? '#fff' : '#333',
    // 左侧菜单选中字体颜色
    leftMenuTextActiveColor: isDarkColor ? '#fff' : 'var(--el-color-primary)',
    // logo字体颜色
    logoTitleTextColor: isDarkColor ? '#fff' : 'inherit',
    // logo边框颜色
    logoBorderColor: isDarkColor ? color : '#eee'
  }
  appStore.setTheme(theme)
  appStore.setCssVarTheme()
}

// 设置右侧菜单的颜色
const setMenuTheme = (color: string) => {
  const primaryColor = useCssVar('--el-color-primary', document.documentElement)
  const isDarkColor = colorIsDark(color)
  const theme: Recordable = {
    rightMenuBgColor: isDarkColor ? '#00152A' : '#fff',
    rightMenuBgActiveColor: isDarkColor
      ? 'var(--el-color-primary)'
      : hexToRGB(unref(primaryColor), 0.1),
    rightMenuCollapseBgActiveColor: isDarkColor
      ? 'var(--el-color-primary)'
      : hexToRGB(unref(primaryColor), 0.1),
    rightMenuTextColor: isDarkColor ? '#fff' : '#00152A',
    rightMenuTextActiveColor: isDarkColor ? '#fff' : 'var(--el-color-primary)',
    rightMenuBgLightColor: isDarkColor ? '#0C2136' : '#fff',
    partingLine: isDarkColor ? '#93939333' : '#dfdede61'
    // rightMenuTopTextColor: isDarkColor ? '#fff' : '#001529',
    // rightMenuTopBgColor: isDarkColor ? '#001529' : '#fff'
  }
  appStore.setTheme(theme)
  appStore.setCssVarTheme()
}

// 监听layout变化，重置一些主题色
watch(
  () => layout.value,
  (n) => {
    // if (n === 'top' && !appStore.getIsDark) {
    // 当布局为top需要特殊处理
    // headerTheme.value = '#fff'
    //   setSystemTheme(unref(systemTheme))
    // } else {
    // setMenuTheme(unref(menuTheme))
    setSystemTheme(unref(systemTheme))
    // }
  }
)
// 拷贝
const copyConfig = async () => {
  const { copy, copied, isSupported } = useClipboard({
    source: `
      // 面包屑
      breadcrumb: ${appStore.getBreadcrumb},
      // 面包屑图标
      breadcrumbIcon: ${appStore.getBreadcrumbIcon},
      // 折叠图标
      hamburger: ${appStore.getHamburger},
      // 全屏图标
      screenfull: ${appStore.getScreenfull},
      // 尺寸图标
      size: ${appStore.getSize},
      // 多语言图标
      locale: ${appStore.getLocale},
      // 标签页
      tagsView: ${appStore.getTagsView},
      // 标签页图标
      getTagsViewIcon: ${appStore.getTagsViewIcon},
      // logo
      logo: ${appStore.getLogo},
      // 菜单手风琴
      uniqueOpened: ${appStore.getUniqueOpened},
      // 固定header
      fixedHeader: ${appStore.getFixedHeader},
      // 页脚
      footer: ${appStore.getFooter},
      // 灰色模式
      greyMode: ${appStore.getGreyMode},
      // layout布局
      layout: '${appStore.getLayout}',
      // 暗黑模式
      isDark: ${appStore.getIsDark},
      // 组件尺寸
      currentSize: '${appStore.getCurrentSize}',
      // 主题相关
      theme: {
        // 主题色
        elColorPrimary: '${appStore.getTheme.elColorPrimary}',
        // 左侧菜单边框颜色
        leftMenuBorderColor: '${appStore.getTheme.leftMenuBorderColor}',
        // 左侧菜单背景颜色
        leftMenuBgColor: '${appStore.getTheme.leftMenuBgColor}',
        // 左侧菜单浅色背景颜色
        leftMenuBgLightColor: '${appStore.getTheme.leftMenuBgLightColor}',
        // 左侧菜单选中背景颜色
        leftMenuBgActiveColor: '${appStore.getTheme.leftMenuBgActiveColor}',
        // 左侧菜单收起选中背景颜色
        leftMenuCollapseBgActiveColor: '${appStore.getTheme.leftMenuCollapseBgActiveColor}',
        // 左侧菜单字体颜色
        leftMenuTextColor: '${appStore.getTheme.leftMenuTextColor}',
        // 左侧菜单选中字体颜色
        leftMenuTextActiveColor: '${appStore.getTheme.leftMenuTextActiveColor}',
        // logo字体颜色
        logoTitleTextColor: '${appStore.getTheme.logoTitleTextColor}',
        // logo边框颜色
        logoBorderColor: '${appStore.getTheme.logoBorderColor}',
        // 头部背景颜色
        topHeaderBgColor: '${appStore.getTheme.topHeaderBgColor}',
        // 头部字体颜色
        topHeaderTextColor: '${appStore.getTheme.topHeaderTextColor}',
        // 头部悬停颜色
        topHeaderHoverColor: '${appStore.getTheme.topHeaderHoverColor}',
        // 头部边框颜色
        topToolBorderColor: '${appStore.getTheme.topToolBorderColor}'
      }
    `,
    legacy: true
  })
  if (!isSupported) {
    ElMessage.error(t('setting.copyFailed'))
  } else {
    await copy()
    if (unref(copied)) {
      ElMessage.success(t('setting.copySuccess'))
    }
  }
}

// 清空缓存
const clear = () => {
  storageClear()
  window.location.reload()
}

// const isDark = ref(false)
/* const themeChange = () => {
  const color = getCssVar('--el-bg-color')
  isDark.value = !unref(isDark)
  if (!unref(isDark)) {
    setSystemTheme(unref(systemTheme))
  } else {
    setHeaderTheme(color)
    setTabTheme(color)
    setMenuTheme(color, unref(isDark))
  }
} */
onMounted(() => {
  setSystemTheme(unref(systemTheme))
})
</script>

<template>
  <div
    :class="prefixCls"
    class="fixed top-[45%] right-0 w-40px h-40px flex items-center justify-center bg-[var(--el-color-primary)] cursor-pointer z-10 z-999"
    @click="drawer = true"
  >
    <Icon icon="ant-design:setting-outlined" color="#fff" />
  </div>

  <ElDrawer v-model="drawer" direction="rtl" size="300px">
    <template #header>
      <span class="text-16px font-700">{{ t('setting.projectSetting') }}</span>
    </template>
    <div class="text-center">
      <!-- <ElDivider>{{ t('setting.theme') }}</ElDivider>
      <ThemeSwitch @change="themeChange" /> -->

      <!-- 布局 -->
      <ElDivider>{{ t('setting.layout') }}</ElDivider>
      <LayoutRadioPicker />

      <!-- 系统主题 -->
      <ElDivider>{{ t('setting.systemTheme') }}</ElDivider>
      <!-- <ColorRadioPicker
        v-model="systemTheme"
        :schema="[
          '#409eff',
          '#009688',
          '#536dfe',
          '#ff5c93',
          '#ee4f12',
          '#0096c7',
          '#9c27b0',
          '#ff9800'
        ]"
        @change="setSystemTheme"
      /> -->
      <el-select v-model="systemTheme" class="m-2" @change="setSystemTheme">
        <el-option
          v-for="item in systemThemeOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <!-- 头部主题 -->
      <!-- <ElDivider>{{ t('setting.headerTheme') }}</ElDivider>
      <ColorRadioPicker
        v-model="headerTheme"
        :schema="[
          '#fff',
          '#151515',
          '#5172dc',
          '#e74c3c',
          '#24292e',
          '#394664',
          '#009688',
          '#383f45'
        ]"
        @change="setHeaderTheme"
      /> -->

      <!-- 菜单主题 -->
      <!-- <template v-if="layout !== 'top'">
        <ElDivider>{{ t('setting.menuTheme') }}</ElDivider>
        <ColorRadioPicker
          v-model="menuTheme"
          :schema="[
            '#fff',
            '#001529',
            '#212121',
            '#273352',
            '#191b24',
            '#383f45',
            '#001628',
            '#344058'
          ]"
          @change="setMenuTheme"
        />
      </template> -->
    </div>

    <!-- 界面显示 -->
    <ElDivider>{{ t('setting.interfaceDisplay') }}</ElDivider>
    <InterfaceDisplay />

    <ElDivider />
    <div>
      <BaseButton type="primary" class="w-full" @click="copyConfig">{{
        t('setting.copy')
      }}</BaseButton>
    </div>
    <div class="mt-5px">
      <BaseButton type="danger" class="w-full" @click="clear">
        {{ t('setting.clearAndReset') }}
      </BaseButton>
    </div>
  </ElDrawer>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-setting';

.@{prefix-cls} {
  border-radius: 6px 0 0 6px;
}
</style>
