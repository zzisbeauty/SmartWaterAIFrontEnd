<script setup lang="tsx">
import * as echarts from 'echarts'
import { ref, reactive, toRefs, onMounted } from 'vue'

// 服务商
const pieechartOption = ref({})
const pieresult = ref([])
const fuwuactiveTab = ref('week') // 默认选中“本周”
const fuwuchangeTab = (tab: string) => {
  fuwuactiveTab.value = tab
  updatefuwuResult(tab)
}
const updatefuwuResult = (tab: string) => {
  if (tab === 'week') {
    pieresult.value = [
      { value: 1048, name: '云智科技' },
      { value: 735, name: '星辰科技' },
      { value: 580, name: '数值未来' },
      { value: 484, name: '其他' }
    ]
  } else if (tab === 'month') {
    pieresult.value = [
      { value: 1500, name: '云智科技' },
      { value: 820, name: '星辰科技' },
      { value: 600, name: '数值未来' },
      { value: 1300, name: '其他' }
    ]
  } else if (tab === 'year') {
    pieresult.value = [
      { value: 2100, name: '云智科技' },
      { value: 1345, name: '星辰科技' },
      { value: 1266, name: '数值未来' },
      { value: 1000, name: '其他' }
    ]
  }
  pieechartOption.value = {
    color: ['#3AA1FF', '#36CBCB', '#FAD337', '#F47A8F', '#00cefe', '#a1e8fd', '#d4d7da'],
    title: {
      text: '{a|服务商}\n\n{b|34}',
      textStyle: {
        rich: {
          a: {
            color: '#333333',
            fontSize: 16,
            align: 'center'
          },
          b: {
            fontSize: 35,
            color: '#262626',
            fontWeight: 'bold',
            align: 'center'
          }
        }
      },
      itemGap: -100,
      x: '38%',
      y: 'center'
    },
    tooltip: {
      show: true,
      formatter: '{b}: {c} \t({d}%)'
    },
    legend: {
      bottom: '10',
      icon: 'rect', // 形状
      itemWidth: 24,
      itemHeight: 14
    },
    series: [
      {
        type: 'pie',
        // startAngle:45,
        radius: ['50%', '75%'],
        center: ['48%', '48%'],
        clockwise: true,
        zIndex: 4,
        avoidLabelOverlap: true,
        label: {
          show: false
        },
        labelLine: {
          //label线的长度
          show: false
        },
        itemStyle: {
          normal: {
            borderWidth: 5,
            borderColor: '#fff'
          }
        },
        data: pieresult.value
      }
    ]
  }
}
// 初始化时调用一次 updateRankingResult
updatefuwuResult('week')

// 使用时长
const barechartOption = ref({})
const barresult = ref([])
const timeactiveTab = ref('week') // 默认选中“日”
const timechangeTab = (tab: string) => {
  timeactiveTab.value = tab
  updatetimeResult(tab)
}
const xData = ref([])
const updatetimeResult = (tab: string) => {
  if (tab === 'day') {
    barresult.value = [
      { value: [23, 35, 126, 120, 200, 150, 80], name: '云智科技' },
      { value: [446, 123, 34, 116, 166, 142, 60], name: '星辰科技' },
      { value: [51, 143, 158, 110, 170, 140, 70], name: '数值未来' }
    ]
    xData.value = [
      '2025-07-03',
      '2025-07-04',
      '2025-07-05',
      '2025-07-06',
      '2025-07-07',
      '2025-07-08',
      '2025-07-09'
    ]
  } else if (tab === 'week') {
    barresult.value = [
      { value: [140, 200, 338, 152], name: '云智科技' },
      { value: [130, 180, 160, 90], name: '星辰科技' },
      { value: [113, 183, 110, 170], name: '数值未来' }
    ]
    xData.value = ['第一周', '第二周', '第三周', '第四周']
  } else if (tab === 'month') {
    barresult.value = [
      { value: [220, 200, 449, 180, 340, 456], name: '云智科技' },
      { value: [130, 223, 334, 145, 142, 213], name: '星辰科技' },
      { value: [134, 250, 312, 170, 226, 12], name: '数值未来' }
    ]
    xData.value = ['2025-02', '2025-03', '2025-04', '2025-05', '2025-06', '2025-07']
  }
  const series = []
  for (let i = 0; i < barresult.value.length; i++) {
    series.push({
      name: barresult.value[i].name,
      type: 'line',
      lineStyle: {
        normal: {
          width: 3
        }
      },
      data: barresult.value[i].value
    })
  }
  barechartOption.value = {
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderColor: '#fff'
    },
    color: ['#1890FF', '#2FC25B', '#FAD337'],
    legend: [
      {
        top: '20',
        right: '4%',
        icon: 'rect', // 形状
        itemWidth: 24, // 宽
        itemHeight: 14 // 高
      }
    ],
    xAxis: {
      type: 'category',
      data: xData,
      axisTick: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: '#E9E9E9'
        }
      },
      axisLabel: {
        color: '#333333',
        fontSize: 14
      }
    },
    yAxis: {
      type: 'value',
      name: '单位：h',
      nameTextStyle: {
        color: '#333'
      },
      axisLabel: {
        color: '#333'
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#E9E9E9',
          type: 'dashed',
          width: 1
        }
      }
    },
    series: series
  }
}
// 初始化时调用一次 updateRankingResult
updatetimeResult('week')

// 排行榜
const filterType = ref('username') // 默认筛选类型
const filterOptions = ref([
  { value: 'username', label: '用户名' },
  { value: 'ip', label: '使用IP' },
  { value: 'digitalHuman', label: '数字人' }
])
const filterTypechangeTab = (tab: string) => {
  filterType.value = tab
}
const closingbase64Img = {
  top1: 'data:image/png;base64,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',
  top2: 'data:image/png;base64,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',
  top3: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAgCAYAAAABtRhCAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAdiSURBVEiJtZZbjJ1VFYC/tfd//jNnzkxn7NSW3igtVFqwJCjlEqkgkUuMCQ8GfSEx8YEHI4nRB6MPOlGj8dEEwovBhEQSitZEiAkgUjVU8FaDhVpoO7QMM+1cOud+zv//e6/lwz83SRRq4k5Ozsk+e61vr7XXDS5ztZ6c3NT+ybf+EM6dWiimTt57ufLucg63H//Bh32mz6Lhdsv6E/SaPy+OH737/wJsPzG52SfhF4bcgnNYr4m1Lo1oe+np4sXDd31QPfJ+B8zMMXd6dzE99ThD9U/K8ChSSaFShRggG2DdZkOqw1+cYvS5vXv3Zv8z0JZmr4oxflvg8wj197lbMOyPHvs+G3e+KCLxAwPt8GEfP3XbF8TZY4jfgCmYoUvzhLnzUBSlpE/wY5vwV+wCJyvqFLMn5t9d+sqWG37ZF5nU/wq0l346FPbf+R3n3DeopCJpjeKt42R//y3WaawTERBBEKjWqOw5QGXvjUh1CAws6zbixXNHxVeft2r199Xrb38dQMwO++JY5YC2W3fY0uy9btueW5P9B8fUzNFpUJx+jeL0cVDFfWgzfmI7MjKGiEMHXayxQFycQQAZqlO54RBuy05Qg0EXa8ybVIeCpbXzePmxZC8+dURc8hntLKaGSfKxO0EcujRHduxXWJ7hNm4h3XczbmwCNIJpqdC0tCYGwtsnibNnEedJ9t2C33olZga9NmQ9LM8Jbx3vJvnrv/u03/aRqrgEf91BUMMGLbJXnsWyPsnOa0kPfKIEhQJsGaTlx5Z/JzuuwY1vJrz5V8Kpv4A4GBmDokCnzxJnzyCqJx354Fh8+zXMC1KrQ5GTn3gZ63dJtu4hvf42iAXECBqxIsOyPsSA9tpYr1MGUVHg0irJnhvAjHD2BDr3LnH6DNrrgoGKO5qIyUvm7B6//WqxokBbi8TZKSStUfnobaBhzZpQlPmnhrabhNN/BoPkmpsQ70EVqaTI6ATh4jtYEbB0CMyQxEc1fSERkd9QHf4etQ0VyzPiO28iQHLlPsQMYixByxYSApoPEFUszwDBsgFx8RwyNA4uAfGlbN4HM0wjTirZ2HDyihvuNP8hE9saxIjlA7S5AM6TbNuzBhMHaRXr9TCNCGWgEAdIbQzrLBHOv0Zx6lW00wSNSForPRMKyPpoKP4kD062nEw+nbsrdj9vRQaDHpb1AEGcK5WqYq3GcoBEiBHxjnj+JJb3sM4i8cIZrNdHxreXQaWKq40gzpcWZn20368BJAAyPD5NnmFFhiBIbRSLcdmNilQqWK+DGx3Hem2sGGA2wPodtLGIaY7Ut+Hq46UrobycS0pgyAHdvAq0Io+mYblkuRJWFOvCP0I2KMtXGBCbF7HGfBmlFhEBv2ELgpUWrlSipFIW95gjqmENmPebaJnE4ivljUIBLAeNKqYRW7qINuaIizNor4lZQEzBj+CGR9fBDMSVz7Kiy2x6DZj1Tgg+mMVEhkag10I7DaQ6XFqnCkVOmJlGW4tYKBA/hqtvQESQ4Q0gsgY0AzWkkmCDDsSAEf+5CgzHjlzlb7zPIx6pDAFt4sIFki07QSPaaREb81hvFkILBh0074BmmBnWckjlEG54w3KjCkilimFot4HFQLZ4btcqEO9v1blzIhu3g0+gUsV6bbSxgBZF2WjzPtrtQJFhIYIkIIJhgGFFViY4hjkPSUJYvFAGWMgZNGfumP/StaOJTT6QdkfH7olzU1AbwwBXHca6bYp3p/DjE+A8UhsjSetrLlv/DTjvS7AaVGtYiIS5KYgFeWuOJE2rWa16c9Ldtv06ycNGmnPEubNQHSWESFIfRwy03cIN1xFfKa1/Dwis7JBWwqRaB3Fk069D1kVDQegv4WujSVIbuTtB3V14n0QN5G++itu2v/S/5qRjW8sSNhhAEpCkUlad9aAVq3xaNl8RsnNvEBszEJX2whnMZaQjW0mG6oeS0G23e9MnYrF0IZGo+Jk3qO3aDgMIegHn03XGlO8lIsu9MIJFzLkyBzE066GdBRxKtzmg31zA14Ru65TWq9ddEpvEnTm76/6Ja3Z8E7GDqhHnfFmW3rtWIQpWYBrLbkJALJbVZfl/A4KN4tIaPqn2Whdmvnap13pqdaZZnDx4n5k9ozEmIKS1+n8ABczCcn6Gcp+wdobyfYsAQav4yhA+HXps03ePf3ktLYAW80drxYYp1bg3qVTXgda5zsIyJKzurV6EfxvOACOEHlGL4GL3Zyu7q0DXH74paLYTM5LhUSwWCBqwqFjEYhAsVFZgZrGEmCJYZGUONcSESuIFkUgsgg8FnwVehnUz3/TXr34yRr3fTCkU+llBmlZ+eMXmiV9TFMRQpPmC/MiiHUKVnCZKAY5mWvMPjYwmZwB6Rdw0KMIREUTM0DKWGqmFAzsebS+WtRSYxT+cm34V+ngHIwoXLrrWvkf+1l/xwuzDN35O1D1jZrdgbQztiNoDOx699MKqIydxU0v1PQbY8mysFbF+1umst/ADr5mHPr7JfP9I4Rb3m/Qf3P1I67nLkf8XtrK9/fziC20AAAAASUVORK5CYII='
}
const rankingcolor = ['#FAD337', '#9F9F9F', '#FB6B04', '#1890FF']
const rankingcolor1 = ['#FEF6DA', '#ECECEC', '#FEDEC7', '#D7EBFF']
const rankingresult = ref([])
const valrankingresult = []
const valMax = ref([])
var rankingindex = 0
const rankingechartOption = ref({})
const activeTab = ref('week') // 默认选中“本周”
const changeTab = (tab: string) => {
  activeTab.value = tab
  updateRankingResult(tab)
}
const updateRankingResult = (tab: string) => {
  if (tab === 'week') {
    rankingresult.value = [
      { name: '云智科技', value: 58 },
      { name: '星辰科技', value: 53 },
      { name: '数值未来', value: 35 },
      { name: '其他', value: 30 },
      { name: '其他', value: 28 },
      { name: '其他', value: 25 },
      { name: '其他', value: 20 },
      { name: '其他', value: 18 },
      { name: '其他', value: 10 },
      { name: '其他', value: 8 }
    ]
  } else if (tab === 'month') {
    rankingresult.value = [
      // 月份的数据
      { name: '云智科技', value: 1123 },
      { name: '星辰科技', value: 1111 },
      { name: '数值未来', value: 1070 },
      { name: '其他', value: 905 },
      { name: '其他', value: 828 },
      { name: '其他', value: 825 },
      { name: '其他', value: 820 },
      { name: '其他', value: 618 },
      { name: '其他', value: 410 },
      { name: '其他', value: 98 }
    ]
  } else if (tab === 'year') {
    rankingresult.value = [
      // 年份的数据
      { name: '云智科技', value: 1358 },
      { name: '星辰科技', value: 1253 },
      { name: '数值未来', value: 1135 },
      { name: '其他', value: 1030 },
      { name: '其他', value: 1028 },
      { name: '其他', value: 1025 },
      { name: '其他', value: 1020 },
      { name: '其他', value: 818 },
      { name: '其他', value: 810 },
      { name: '其他', value: 308 }
    ]
  }
  rankingresult.value.forEach((data, index) => (valrankingresult[index] = data.value))
  const maxVal = Math.max(...valrankingresult)
  const maxdata = []
  rankingresult.value.map(() => {
    maxdata.push(maxVal)
  })
  valMax.value = maxdata
  rankingechartOption.value = {
    color: ['#FAD337', '#9F9F9F', '#FB6B04', '#1890FF'],
    grid: {
      left: 130,
      top: 6,
      bottom: 0,
      right: 66
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
      // inverse: true,
      axisLine: {
        show: false // 隐藏y轴
      },
      axisTick: {
        show: false // 刻度线
      },
      axisLabel: {
        show: false // 隐藏刻度值
      },
      splitLine: {
        show: false // 不显示网格线
      }
    },
    yAxis: [
      {
        type: 'category',
        data: rankingresult.value.map((item) => item.value),
        inverse: true,
        position: 'right',
        axisTick: {
          show: false // 刻度线
        },
        axisLine: {
          show: false // 隐藏y轴
        },
        axisLabel: {
          formatter: '{value}h',
          textStyle: {
            fontSize: '16',
            fontWeight: 800,
            color: function () {
              if (rankingindex < 3) {
                return rankingcolor[rankingindex++ % rankingcolor.length]
              } else {
                return '#1890FF'
              }
            }
          }
        }
      },
      {
        type: 'category',
        inverse: true,
        axisTick: 'none',
        axisLine: 'none',
        show: true,
        axisLabel: {
          textStyle: {
            fontSize: '14'
          },
          formatter: function (params, index) {
            const rankingindex = index + 1
            if (rankingindex <= 3) {
              return ['{a' + rankingindex + '|}' + '  ' + params].join('\n')
            } else {
              return ['{b|' + rankingindex + '}' + '  ' + params].join('\n')
            }
          },
          rich: {
            a1: {
              backgroundColor: {
                image: closingbase64Img.top1
              },
              width: 22,
              height: 22,
              align: 'center'
            },

            a2: {
              backgroundColor: {
                image: closingbase64Img.top2
              },
              width: 22,
              height: 22,
              align: 'center'
            },
            a3: {
              backgroundColor: {
                image: closingbase64Img.top3
              },
              width: 22,
              height: 22,
              align: 'center'
            },
            b: {
              color: '#fff',
              backgroundColor: '#1890FF',
              width: 20,
              height: 20,
              fontSize: 14,
              align: 'center',
              lineHeight: 3,
              borderRadius: 100,
              padding: [2, 2]
            }
          },
          align: 'left',
          padding: [0, 0, 0, -100],
          show: true
        },
        data: rankingresult.value.map((item) => item.name)
      }
    ],
    series: [
      {
        name: '',
        type: 'bar',
        zlevel: 1,
        barWidth: 12,
        data: rankingresult.value.map((item) => item.value),
        itemStyle: {
          normal: {
            color: (item) => {
              if (item.dataIndex < 3) {
                return rankingcolor[item.dataIndex]
              } else {
                return '#1890FF'
              }
            },
            barBorderRadius: [15, 15, 15, 15]
          }
        }
      },
      ,
      {
        //最大值背景条形图
        name: '',
        type: 'bar',
        barWidth: 12,
        barGap: '-100%',
        margin: '20',
        data: valMax,
        textStyle: {
          //图例文字的样式
          fontSize: 12,
          color: '#fff'
        },
        itemStyle: {
          normal: {
            color: (item) => {
              if (item.dataIndex < 3) {
                return rankingcolor1[item.dataIndex]
              } else {
                return '#D7EBFF'
              }
            },
            fontSize: 12,
            barBorderRadius: 30
          }
        }
      }
    ]
  }
}
// 初始化时调用一次 updateRankingResult
updateRankingResult('week')

// 顶部信息
const state = reactive({
  totalUsageTime: '6,284',
  totalUsageUnit: 'h',
  totalUsageTimeChangeRate: '+1.25%'
})
const stats = computed(() => [
  {
    title: '云智科技',
    value: '1,034',
    unit: 'min',
    changeRate: '+0.12%',
    compareText: '较昨日'
  },
  {
    title: '云智科技',
    value: '1,000',
    unit: 'min',
    changeRate: '-1.38%',
    compareText: '较昨日'
  },
  {
    title: '云智科技',
    value: '1,088',
    unit: 'min',
    changeRate: '+1.77%',
    compareText: '较昨日'
  },
  {
    title: '云智科技',
    value: '1,098',
    unit: 'min',
    changeRate: '-0.21%',
    compareText: '较昨日'
  },
  {
    title: '云智科技',
    value: '1,023',
    unit: 'min',
    changeRate: '+0.52%',
    compareText: '较昨日'
  },
  {
    title: '云智科技',
    value: '1,041',
    unit: 'min',
    changeRate: '-0.66%',
    compareText: '较昨日'
  }
])
const scrollBlocks = () => {
  console.log('scrollBlocks')
  // const container = document.querySelector('.stats-container')
  // if (container) {
  //   container.scrollBy({ left: 300, behavior: 'smooth' }) // 根据实际宽度调整滚动距离
  // }
}
// 使用记录
import { handleFetchData, handleExport } from './IndexApi'
import { getTableColumns } from './data'
const singleTableRef = ref<{ elTableRef: any } & InstanceType<typeof Table>>()

// 定义搜索参数，并执行搜索事件
const searchParams = ref({})
const searchText = ref('')
const handleSearch = () => {
  // 执行搜索逻辑
  console.log('搜索:', searchText.value)
}
// 表格注册
const { tableRegister, tableState, tableMethods } = useTable({
  immediate: true,
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    // const res: any = await handleFetchData(
    //   { ...searchParams.value },
    //   {
    //     pageNo: unref(currentPage),
    //     pageSize: unref(pageSize)
    //   }
    // )
    const res: any = {
      result: {
        records: [
          {
            name: '智能助手ALPHA',
            serviceProvider: '数值未来',
            account: 'ashfkhssdkf',
            ip: '131.0.0.1',
            startTime: '2025-03-13 15:45:22',
            endTime: '2025-03-13 15:45:22',
            duration: '2小时26分56秒'
          },
          {
            name: '智能助手ALPHA',
            serviceProvider: '数值未来',
            account: 'ashfkhssdkf',
            ip: '131.0.0.1',
            startTime: '2025-03-13 15:45:22',
            endTime: '2025-03-13 15:45:22',
            duration: '2小时26分56秒'
          },
          {
            name: '智能助手ALPHA',
            serviceProvider: '数值未来',
            account: 'ashfkhssdkf',
            ip: '131.0.0.1',
            startTime: '2025-03-13 15:45:22',
            endTime: '2025-03-13 15:45:22',
            duration: '2小时26分56秒'
          }
        ],
        total: 3
      }
    }
    return {
      list: res.result.records,
      total: res.result.total
    }
  }
})
const { loading, dataList, total, currentPage, pageSize, requestTime } = tableState
const { getList, refresh, getElTableExpose } = tableMethods
const tableColumns = reactive<TableColumn[]>(getTableColumns())
// 导出
const doExport = async () => {
  // const params = await getSearchParam()
  // handleExport(params).then((res) => {
  //   if (res.success) {
  //     fileExport(res.result, '数字人使用记录.xlsx')
  //     useMessage('success', res.message)
  //   } else {
  //     useMessage('error', '数字人使用记录导出失败')
  //   }
  // })
}

onMounted(() => {})
</script>
<template>
  <div class="data-board w-full h-full">
    <!-- 顶部统计信息 -->
    <div class="w-[calc(100%-48px)] bg-white flex items-center px-6 py-4 mb-3">
      <!-- 今日总使用时长 -->
      <div class="w-220px flex items-center mr-6" style="border-right: 1px solid #efefef">
        <img src="@/assets/imgs/ASR时长.png" alt="时长" class="w-12 h-12 mr-3" />
        <div>
          <div class="text-16px mb-2">今日总使用时长</div>
          <div class="flex items-end mb-2">
            <span class="text-32px font-bold">{{ state.totalUsageTime }}</span>
            <span class="text-18px font-bold text-gray-500 ml-2">{{ state.totalUsageUnit }}</span>
          </div>
          <div class="flex items-center gap-1">
            <img
              v-if="state.totalUsageTimeChangeRate.startsWith('+')"
              src="@/assets/imgs/上升.png"
            />
            <img
              v-else-if="state.totalUsageTimeChangeRate.startsWith('-')"
              src="@/assets/imgs/下降.png"
            />
            <span
              :class="
                state.totalUsageTimeChangeRate.startsWith('+') ? 'text-green-600' : 'text-red-600'
              "
              class="text-12px"
            >
              {{ state.totalUsageTimeChangeRate.replace(/[+-]/, '') }}
            </span>
            <span class="text-12px text-gray-400 ml-2">较昨日</span>
          </div>
        </div>
      </div>
      <!-- 分级子块 -->
      <div class="flex-1 flex gap-3 overflow-x-auto">
        <div
          v-for="stat in stats"
          :key="stat.title"
          class="min-w-175px flex-1 bg-[#F6FBFF] rounded-2 flex flex-col justify-center items-start px-6 py-4"
        >
          <div class="text-16px mb-2">{{ stat.title }}</div>
          <div class="flex items-end mb-2">
            <span class="text-32px font-bold">{{ stat.value }}</span>
            <span class="text-18px font-bold text-gray-500 ml-2">{{ stat.unit }}</span>
          </div>
          <div class="flex items-center gap-1">
            <img v-if="stat.changeRate.startsWith('+')" src="@/assets/imgs/上升.png" />
            <img v-else-if="stat.changeRate.startsWith('-')" src="@/assets/imgs/下降.png" />
            <span
              :class="stat.changeRate.startsWith('+') ? 'text-green-600' : 'text-red-600'"
              class="text-12px"
            >
              {{ stat.changeRate.replace(/[+-]/, '') }}
            </span>
            <span class="text-12px text-gray-400 ml-2">{{ stat.compareText }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full flex justify-between gap-3 p-b-3" style="height: calc(100% - 172px)">
      <!-- 左侧 -->
      <div class="w-2/3 h-full flex flex-col gap-3">
        <div class="flex gap-3">
          <!-- 项目服务商饼图 -->
          <div class="w-1/3 bg-white">
            <div class="p-l-3 p-r-3" style="border-bottom: 1px solid #ddd">
              <div class="flex justify-between items-center h-45px">
                <span class="text-16px font-bold m-l-10px whitespace-nowrap">项目服务商</span>
                <!-- 本周、本月、本年切换按钮 -->
                <div
                  class="flex items-center border-rd-5px cursor-pointer"
                  style="border: 1px solid #ddd"
                >
                  <span
                    class="px-10px py-5px w-43px text-center text-14px"
                    style="border-right: 1px solid #ddd"
                    :class="{ active: fuwuactiveTab === 'week' }"
                    @click="fuwuchangeTab('week')"
                    >本周</span
                  >
                  <span
                    class="px-10px py-5px w-43px text-center text-14px"
                    style="border-right: 1px solid #ddd"
                    :class="{ active: fuwuactiveTab === 'month' }"
                    @click="fuwuchangeTab('month')"
                    >本月</span
                  >
                  <span
                    class="px-10px py-5px w-43px text-center text-14px"
                    :class="{ active: fuwuactiveTab === 'year' }"
                    @click="fuwuchangeTab('year')"
                    >本年</span
                  >
                </div>
              </div>
            </div>
            <div class="h-70">
              <Echart :height="'100%'" :options="pieechartOption" />
            </div>
          </div>

          <!-- 使用时长统计柱状图 -->
          <div class="w-2/3 bg-white">
            <div class="p-l-3 p-r-3" style="border-bottom: 1px solid #ddd">
              <div class="flex justify-between items-center h-45px">
                <span class="text-16px font-bold m-l-10px whitespace-nowrap">使用时长统计</span>
                <!--  日、周、月切换按钮 -->
                <div
                  class="flex items-center border-rd-5px cursor-pointer"
                  style="border: 1px solid #ddd"
                >
                  <span
                    class="px-10px py-5px w-43px text-center text-14px"
                    style="border-right: 1px solid #ddd"
                    :class="{ active: timeactiveTab === 'day' }"
                    @click="timechangeTab('day')"
                    >日</span
                  >
                  <span
                    class="px-10px py-5px w-43px text-center text-14px"
                    style="border-right: 1px solid #ddd"
                    :class="{ active: timeactiveTab === 'week' }"
                    @click="timechangeTab('week')"
                    >周</span
                  >
                  <span
                    class="px-10px py-5px w-43px text-center text-14px"
                    :class="{ active: timeactiveTab === 'month' }"
                    @click="timechangeTab('month')"
                    >月</span
                  >
                </div>
              </div>
            </div>
            <div class="h-70">
              <Echart :height="'100%'" :options="barechartOption" />
            </div>
          </div>
        </div>
        <!-- 使用记录表格 -->
        <div class="bg-white" style="height: calc(100% - 200px)">
          <div class="p-l-3 p-r-3" style="border-bottom: 1px solid #ddd">
            <div class="flex justify-between items-center h-45px">
              <span class="text-16px font-bold m-l-10px whitespace-nowrap">使用记录</span>
              <!-- 搜索 -->
              <div class="flex items-center gap-2">
                <div class="relative flex-1">
                  <el-input
                    v-model="searchText"
                    class="w-full"
                    placeholder="名称、账号、IP"
                    clearable
                    @keyup.enter="handleSearch"
                  >
                    <template #suffix>
                      <Icon class="cursor-pointer" icon="ep:search" color="#777" />
                    </template>
                  </el-input>
                </div>
                <el-button type="primary" @click="doExport">
                  <Icon class="cursor-pointer mr-4px" :size="20" icon="ep:download" />
                  导出
                </el-button>
              </div>
            </div>
          </div>
          <div class="w-full" style="height: calc(100% - 70px)">
            <div class="p-3.75 pb-0 card-container flex-1 h-full">
              <!-- 表格组件 -->
              <Table
                ref="singleTableRef"
                v-model:pageSize="pageSize"
                v-model:currentPage="currentPage"
                :columns="tableColumns"
                :data="dataList"
                :loading="loading"
                :pagination="{
                  total: total
                }"
                highlight-current-row
                sortable
                :border="false"
                :showOverflowTooltip="true"
                @register="tableRegister"
                @refresh="refresh"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- 右侧 -->
      <!-- 使用排行榜 -->
      <div class="w-1/3 bg-white">
        <div class="p-l-3 p-r-3" style="border-bottom: 1px solid #ddd">
          <div class="flex justify-between items-center h-45px">
            <span class="text-16px font-bold m-l-10px whitespace-nowrap">使用排行榜</span>
            <div class="flex items-center justify-end">
              <!-- 用户名、使用IP、数字人名称 -->
              <el-select
                v-model="filterType"
                placeholder="请选择筛选类型"
                class="w-90px! mr-8px"
                @change="filterTypechangeTab"
              >
                <el-option
                  v-for="item in filterOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <!-- 本周、本月、本年切换按钮 -->
              <div
                class="flex items-center border-rd-5px cursor-pointer"
                style="border: 1px solid #ddd"
              >
                <span
                  class="px-10px py-5px w-43px text-center text-14px"
                  style="border-right: 1px solid #ddd"
                  :class="{ active: activeTab === 'week' }"
                  @click="changeTab('week')"
                  >本周</span
                >
                <span
                  class="px-10px py-5px w-43px text-center text-14px"
                  style="border-right: 1px solid #ddd"
                  :class="{ active: activeTab === 'month' }"
                  @click="changeTab('month')"
                  >本月</span
                >
                <span
                  class="px-10px py-5px w-43px text-center text-14px"
                  :class="{ active: activeTab === 'year' }"
                  @click="changeTab('year')"
                  >本年</span
                >
              </div>
            </div>
          </div>
        </div>
        <div class="h-[calc(100%-40px)]">
          <Echart :height="'100%'" :options="rankingechartOption" />
        </div>
      </div>
    </div>
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
