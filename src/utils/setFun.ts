import { ref ,unref,computed } from 'vue'
import { setCssVar, getCssVar } from '@/utils'
import { useAppStore } from '@/store/modules/app'
import { colorIsDark, lighten, hexToRGB } from '@/utils/color'
import { useCssVar } from '@vueuse/core'

export const setThemeFun = () => {
  const appStore = useAppStore()
const layout = computed(() => appStore.getLayout)
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
  return {
    setSystemTheme,
    systemTheme,
    systemThemeOption,
  }
}
