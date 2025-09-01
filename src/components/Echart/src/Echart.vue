<script setup lang="ts">
import type { EChartsOption } from 'echarts'
import echarts from '@/plugins/echarts'
import { debounce } from 'lodash-es'
import 'echarts-wordcloud'
import { propTypes } from '@/utils/propTypes'
import {
  computed,
  PropType,
  ref,
  unref,
  watch,
  onMounted,
  onBeforeUnmount,
  onActivated,
  inject
} from 'vue'
import { useAppStore } from '@/store/modules/app'
import { isString } from '@/utils/is'
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls, variables } = useDesign()

const prefixCls = getPrefixCls('echart')

const appStore = useAppStore()

const props = defineProps({
  options: {
    type: Object as PropType<EChartsOption>,
    required: false
  },
  chartConfig: {
    type: Object,
    default: () => ({})
  },
  width: propTypes.oneOfType([Number, String]).def(''),
  height: propTypes.oneOfType([Number, String]).def('500px')
})

const isDark = computed(() => appStore.getIsDark)

const theme = computed(() => {
  const echartTheme: boolean | string = unref(isDark) ? true : 'auto'

  return echartTheme
})

// const options = computed(() => {
//   return Object.assign(props.chartConfig.option, {
//     darkMode: unref(theme)
//   })
// })

const elRef = ref<ElRef>()

let echartRef: Nullable<echarts.ECharts> = null

const contentEl = ref<Element>()

const styles = computed(() => {
  const width = isString(props.width) ? props.width : `${props.width}px`
  const height = isString(props.height) ? props.height : `${props.height}px`

  return {
    width,
    height
  }
})
const registerShape = () => {
  const offsetX = 12
  const offsetY = 6
  // 绘制左侧面
  const CubeLeft = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0
    },
    buildPath: function (ctx: any, shape) {
      const xAxisPoint = shape.xAxisPoint
      const c0 = [shape.x, shape.y]
      const c1 = [shape.x - offsetX, shape.y - offsetY]
      const c2 = [xAxisPoint[0] - offsetX, xAxisPoint[1] - offsetY]
      const c3 = [xAxisPoint[0], xAxisPoint[1]]
      ctx
        .moveTo(c0[0], c0[1])
        .lineTo(c1[0], c1[1])
        .lineTo(c2[0], c2[1])
        .lineTo(c3[0], c3[1])
        .closePath()
    }
  })
  // 绘制右侧面
  const CubeRight = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0
    },
    buildPath: function (ctx: any, shape) {
      const xAxisPoint = shape.xAxisPoint
      const c1 = [shape.x, shape.y]
      const c2 = [xAxisPoint[0], xAxisPoint[1]]
      const c3 = [xAxisPoint[0] + offsetX, xAxisPoint[1] - offsetY]
      const c4 = [shape.x + offsetX, shape.y - offsetY]
      ctx
        .moveTo(c1[0], c1[1])
        .lineTo(c2[0], c2[1])
        .lineTo(c3[0], c3[1])
        .lineTo(c4[0], c4[1])
        .closePath()
    }
  })
  // 绘制顶面
  const CubeTop = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0
    },
    buildPath: function (ctx: any, shape) {
      const c1 = [shape.x, shape.y]
      const c2 = [shape.x + offsetX, shape.y - offsetY] //右点
      const c3 = [shape.x, shape.y - offsetX]
      const c4 = [shape.x - offsetX, shape.y - offsetY]
      ctx
        .moveTo(c1[0], c1[1])
        .lineTo(c2[0], c2[1])
        .lineTo(c3[0], c3[1])
        .lineTo(c4[0], c4[1])
        .closePath()
    }
  })
  // 注册三个面图形
  echarts.graphic.registerShape('CubeLeft', CubeLeft)
  echarts.graphic.registerShape('CubeRight', CubeRight)
  echarts.graphic.registerShape('CubeTop', CubeTop)
}
function createFormatter(formatterString, chartData) {
  return new Function('name', `return (${formatterString})(name, ${JSON.stringify(chartData)});`)
}
const processFormatters = (option) => {
  if (option.legend && typeof option.legend.formatter === 'string') {
    option.legend.formatter = createFormatter(option.legend.formatter, option.legend.data)
  }
  // 处理柱状图
  if (option.series && option.series.length) {
    option.series.forEach((item) => {
      if (item.type === 'custom') {
        const config = item.renderItemConfig
        item.renderItem = (params, api) => {
          const location = api.coord([api.value(0), api.value(1)])
          config.children.forEach((child) => {
            child.shape.x = location[0]
            child.shape.y = location[1]
            child.shape.xAxisPoint = api.coord([api.value(0), 0])
          })
          return config
        }

        //此时为柱状图，超过八个滚动显示
        if (option.series.length > 2 && option.xAxis.data.length >= 8) {
          option.dataZoom = [
            {
              type: 'inside',
              start: 0,
              end: 50
            }
          ]
        } else if (option.xAxis.data.length >= 12) {
          /* option.dataZoom = [
            {
              type: 'inside',
              start: 0,
              end: 50
            }
          ] */
        }
      }
    })
  }
  return option
}
const scrollToBottom = inject('scrollToBottom', () => {})
const initChart = () => {
  if (unref(elRef) && props.chartConfig.option) {
    registerShape()
    const newOptions = props.chartConfig.option
    const dealAfterOption = processFormatters(newOptions)
    echartRef = echarts.init(unref(elRef) as HTMLElement, '', { renderer: 'svg' })
    echartRef?.setOption(unref(dealAfterOption))
  }
  scrollToBottom()
}

watch(
  () => props.options,
  (options) => {
    if (echartRef) {
      echartRef?.setOption(options)
    }
  },
  {
    deep: true
  }
)

const resizeHandler = debounce(() => {
  if (echartRef) {
    echartRef.resize()
  }
}, 100)

const contentResizeHandler = async (e: TransitionEvent) => {
  if (e.propertyName === 'width') {
    resizeHandler()
  }
}
onMounted(() => {
  initChart()

  window.addEventListener('resize', resizeHandler)

  contentEl.value = document.getElementsByClassName(`${variables.namespace}-layout-content`)[0]
  unref(contentEl) &&
    (unref(contentEl) as Element).addEventListener('transitionend', contentResizeHandler)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler)
  unref(contentEl) &&
    (unref(contentEl) as Element).removeEventListener('transitionend', contentResizeHandler)
})

onActivated(() => {
  if (echartRef) {
    echartRef.resize()
  }
})
</script>

<template>
  <div ref="elRef" :class="[$attrs.class, prefixCls]" :style="styles"></div>
  <svg style="position: absolute; width: 0; height: 0; z-index: 9999">
    <linearGradient :id="'textGradient' + chartConfig.id" x1="0" y1="0" x2="0" y2="1">
      <stop offset="20%" stop-color="#ffffff"></stop>
      <stop offset="100%" stop-color="#0082ff"></stop>
    </linearGradient>
  </svg>
</template>
