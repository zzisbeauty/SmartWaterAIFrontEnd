<script setup lang="tsx">
import * as echarts from 'echarts'
import { ref, reactive, toRefs, onMounted } from 'vue'
const props = defineProps({
  echartsConfig: {
    type: String,
    required: true
  }
})
// 服务商
const pieechartOption = ref({})
onMounted(() => {
  pieechartOption.value = isValidJSONString(props.echartsConfig)
    ? JSON.parse(props.echartsConfig)
    : {
        grid: {
          left: '5%',
          right: '5%',
          bottom: '5%',
          top: '10%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          }
        },
        backgroundColor: 'rgb(255,255,255)',
        xAxis: {
          show: false,
          type: 'value'
        },
        yAxis: [
          {
            type: 'category',
            inverse: true,
            axisLabel: {
              show: true,
              textStyle: {
                color: '#333'
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            data: ['1月份', '2月份', '3月份', '4月份', '5月份', '6月份']
          }
        ],
        series: [
          {
            name: '完成率',
            type: 'bar',
            zlevel: 1,
            itemStyle: {
              normal: {
                barBorderRadius: 0,
                color: {
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgb(57,89,255,1)'
                    },
                    {
                      offset: 1,
                      color: 'rgb(46,200,207,1)'
                    }
                  ],
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 0,
                  type: 'linear',
                  global: false
                }
              }
            },
            barWidth: 20,
            data: [50, 60, 70, 20, 30, 10]
          },
          {
            name: '背景',
            type: 'bar',
            barWidth: 20,
            barGap: '-100%',
            data: [100, 100, 100, 100, 100, 100],
            itemStyle: {
              normal: {
                color: '#90b5e975',
                barBorderRadius: 0
              }
            }
          }
        ]
      }
})

// watch(
//   () => props.echartsConfig,
//   (newConfig) => {
//     console.log('EchartsConfig changed:', newConfig)
//     pieechartOption.value = newConfig
//     console.log('PiechartOption updated:', pieechartOption.value)
//   },
//   { immediate: true, deep: true }
// )
</script>
<template>
  <div class="data-board w-full h-full">
    <Echart :height="'100%'" :options="pieechartOption" />
  </div>
</template>
<style scoped lang="less">
[data-theme] {
  .data-board {
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: 20px; /* 确保每个部分之间的间隔 */
    .stat-value {
      gap: 0.5rem; /* 确保统计值和变化率之间的间距 */
    }
  }
}
.active {
  background-color: #1890ff;
  color: white;
  padding: 5px 10px;
}
</style>
