import { defineConfig, toEscapedSelector as e, presetUno, presetIcons } from 'unocss'
import transformerVariantGroup from '@unocss/transformer-variant-group'

const createPresetIcons = () => {
  // @ts-ignore
  if (import.meta.env.VITE_USE_ONLINE_ICON === 'true') {
    return [
      presetIcons({
        prefix: ''
      })
    ]
  } else {
    return []
  }
}

export default defineConfig({
  // ...UnoCSS options
  rules: [
    [/^fs-(\d+)$/, ([, num]) => ({ 'font-size': `${num}px` })],
    [/^cs-p/, ([]) => ({ cursor: `pointer` })],
    [/^lh-(\d+)$/, ([, num]) => ({ 'line-height': `${num}px` })],
    [
      /^overflow-ellipsis$/,
      ([], { rawSelector }) => {
        const selector = e(rawSelector)
        return `
${selector} {
  text-overflow: ellipsis;
}
`
      }
    ],
    [
      /^custom-hover$/,
      ([], { rawSelector }) => {
        const selector = e(rawSelector)
        return `
${selector} {
  display: flex;
  height: 100%;
  padding: 1px 10px 0;
  cursor: pointer;
  align-items: center;
  transition: background var(--transition-time-02);
}
/* you can have multiple rules */
${selector}:hover {
  background-color: var(--top-header-hover-color);
}
.dark ${selector}:hover {
  background-color: var(--el-bg-color-overlay);
}
`
      }
    ],
    [
      /^layout-border__left$/,
      ([], { rawSelector }) => {
        const selector = e(rawSelector)
        return `
${selector}:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 100%;
  background-color: var(--parting-line);
  z-index: 3;
}
`
      }
    ],
    [
      /^layout-border__right$/,
      ([], { rawSelector }) => {
        const selector = e(rawSelector)
        return `
${selector}:after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 1px;
  height: 100%;
  background-color: var(--parting-line);
  z-index: 3;
}
`
      }
    ],
    [
      /^layout-border__top$/,
      ([], { rawSelector }) => {
        const selector = e(rawSelector)
        return `
${selector}:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: var(--parting-line);
  background-color: rgba(222,222,222,0.5);
  z-index: 3;
}
`
      }
    ],
    [
      /^layout-border__bottom$/,
      ([], { rawSelector }) => {
        const selector = e(rawSelector)
        return `
${selector}:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: var(--parting-line);
  z-index: 3;
}
`
      }
    ],
    [/^border-(solid|dashed|dotted)$/, ([, style]) => ({ 'border-style': style })],
    [/^border-(\w+)$/, ([, color]) => ({ 'border-color': `var(--el-border-color-${color})` })],
    [
      /^border-(\d+)-(solid|dashed|dotted)-(.+)$/,
      ([, width, style, color]) => ({
        'border-width': `${width}px`,
        'border-style': style,
        'border-color': color.startsWith('#') ? color : `var(--${color})`
      })
    ]
  ],
  presets: [presetUno({ dark: 'class', attributify: false }), ...createPresetIcons()],
  transformers: [transformerVariantGroup()],
  content: {
    pipeline: {
      include: [/\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html|ts)($|\?)/]
    }
  },
  shortcuts: {
    center: 'flex items-center justify-center',
    bold: 'font-bold',
    'flex-col': 'flex flex-col',
    pointer: 'cursor-pointer'
  }
})
