<script setup lang="tsx">
import { editor } from 'monaco-editor'
import * as echarts from 'echarts'
import commonText from './commonText.vue' //纯文本
import commonTable from './commonTable.vue' //表格
import commonRank from './commonRank.vue' //排行榜
import commonEcharts from './commonEcharts.vue' //echarts图
import { Echart } from '@/components/Echart'
import commonUrlPage from './commonUrlPage.vue' //链接
import { ca } from 'element-plus/es/locale'
import html2canvas from 'html2canvas'
import { ref, reactive, toRefs, onMounted, onUpdated, nextTick, provide } from 'vue'
import { handleEdit, handleSave } from '../IndexApi'
const dialogSchemas = reactive<FormSchema[]>([
  {
    field: 'resultType',
    label: '结果类型',
    component: 'Select',
    value: 'text',
    componentProps: {
      clearable: false,
      onChange: (val: string) => {
        previewType.value = val as typeof previewType.value
        switch (val) {
          case 'text':
            editorContent.value = JSON.stringify(textareaContent.value)
            break
          case 'table':
            editorContent.value = JSON.stringify(tableData.value)
            break
          case 'echarts':
            editorContent.value = JSON.stringify(EchartOption.value)
            break
          case 'iframe':
            editorContent.value = JSON.stringify(iframeUrl.value)
            break
          case 'rank':
            editorContent.value = JSON.stringify(rankData.value)
            break
          case 'image_text':
            editorContent.value = JSON.stringify(imagetext.value)
            break
          default:
            break
        }
      }
    },
    optionApi: async () => {
      const res = await getDictById({ code: 'result_type' })
      return res || []
    },
    colProps: {
      span: 12
    }
  },
  {
    field: 'styleName',
    label: '样式名称',
    component: 'Input',
    ConditionalType: '*',
    componentProps: {},
    colProps: {
      span: 12
    }
  },
  {
    field: 'styleType',
    label: '样式类型',
    component: 'Select',
    value: 'text',
    componentProps: { clearable: false },
    optionApi: async () => {
      const res = await getDictById({ code: 'style' })
      return res || []
    },
    colProps: {
      span: 12
    }
  },
  {
    field: 'status',
    label: '状态',
    component: 'Switch',
    componentProps: {
      activeValue: 1,
      inactiveValue: 0
    },
    value: 1,
    colProps: {
      span: 12
    }
  }
])
// 配置表单验证，可调用useValidator正则库方便各种情况验证
const { required, isMobileOrNull } = useValidator()
const rules = reactive({
  styleName: [required()]
})
const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose, setSchema } = formMethods
const showChart = ref(false)
provide('showChart', showChart)
const previewType = ref<'text' | 'table' | 'echarts' | 'iframe' | 'rank' | 'image_text'>('text')

const loaded = ref(true)

const editorOption = ref({
  theme: 'lightBlueTheme',
  minimap: { enabled: false },
  scrollbar: {
    verticalScrollbarSize: 0,
    horizontalScrollbarSize: 0
  }
})
// 纯文本
const textareaContent = ref()
textareaContent.value = {
  type: 'text',
  text: '市区共有<strong>48</strong>个压力监测设备。其中:',
  title: '压力监测设备',
  speechText:
    '市区目前建设有48个压力监测设备，其中在线37个，离线11个；目前有7个点位正在报警，当前压力最高的点位为准东西苑小区东侧，压力值：0.51Mpa',
  ulDataList: [
    '在线设备:<strong>37</strong>,占比77.08%',
    '离线设备:<strong>11</strong>,占比22.92%',
    '报警设备:<strong>7</strong>,占比14.58%'
  ]
}
// 图表
const EchartOption = ref()
EchartOption.value = {
  title: '管网物联监测设备',
  text: '市区目前建设有305个监测设备，其中压力监测48个；流量监测252个；水质监测5个。',
  type: 'echarts',
  speechText:
    '市区目前建设有305个监测设备，其中压力监测48个；流量监测252个；水质监测5个，具体情况见下方图表',
  options: [
    {
      echartTitle: '设备状态统计',
      color: [
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(3, 177, 255, 1)'
            },
            {
              offset: 1,
              color: 'rgba(55, 224, 255, 1)'
            }
          ]
        },
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(198, 198, 198, 1)'
            },
            {
              offset: 1,
              color: 'rgba(171, 171, 171, 1)'
            }
          ],
          global: false
        },
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(255, 41, 41, 1)'
            },
            {
              offset: 1,
              color: 'rgba(255, 128, 128, 1)'
            }
          ],
          global: false
        }
      ],
      graphic: [
        {
          type: 'group',
          top: 'middle',
          left: 'center',
          id: 'data',
          children: [
            {
              type: 'text',
              top: 20,
              style: {
                text: '设备总数',
                font: ' 14px "AlibabaRegular", sans-serif',
                fill: 'rgb(255,255,255,0.8)',
                textAlign: 'center',
                zIndex: 9999
              }
            },
            {
              type: 'text',
              top: 40,
              style: {
                text: '305',
                textAlign: 'center',
                font: ' 36px "Dinpro", sans-serif',
                fill: 'url(#textGradient)'
              }
            },
            {
              type: 'text',
              top: 80,
              style: {
                text: '( 个 )',
                font: ' 14px "Microsoft YaHei", sans-serif',
                fill: 'rgb(255,255,255,0.8)',
                textAlign: 'center',
                zIndex: 9999
              }
            }
          ]
        }
      ],
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          type: 'pie',
          center: ['50%', '50%'],
          radius: ['45%', '65%'],
          padAngle: 5,
          itemStyle: {
            borderRadius: 0,
            borderWidth: 10
          },
          data: [
            {
              name: '在线',
              value: 244,
              label: {
                color: 'rgb(251, 132, 88)'
              }
            },
            {
              name: '离线',
              value: 61,
              label: {
                color: 'rgb(53, 251, 152)'
              }
            },
            {
              name: '报警',
              value: 12,
              label: {
                color: 'rgb(7, 143, 240)'
              }
            }
          ],
          labelLine: {
            length: 15,
            length2: 25
          },
          label: {
            formatter: '{name|{b}}\n{line2|{c}}{unit|个}{line2|{d}%}\n{hr|}',
            color: '#fffdef',
            rich: {
              hr: {
                backgroundColor: 'auto',
                borderRadius: 3,
                width: 3,
                height: 3,
                padding: [3, 3, 0, -12]
              },
              name: {
                padding: [-14, 15, 0, 15],
                color: '#000',
                fontSize: 14,
                fontFamily: 'AlibabaRegular'
              },
              line2: {
                padding: [0, 10, -20, 5],
                fontFamily: 'AlibabaRegular',
                fontSize: 16,
                fontWeight: 'bold'
              },
              unit: {
                color: '#000',
                fontSize: 14,
                padding: [0, 0, -20, 0],
                fontFamily: 'AlibabaRegular'
              }
            }
          }
        },
        {
          type: 'pie',
          center: ['50%', '50%'],
          radius: ['37%', '75%'],
          label: {
            show: false
          },
          padAngle: 5,
          itemStyle: {
            opacity: 0.1,
            borderRadius: 0,
            borderWidth: 10
          },
          data: [
            {
              name: '在线',
              value: 244
            },
            {
              name: '离线',
              value: 61
            },
            {
              name: '报警',
              value: 12
            }
          ]
        }
      ]
    },
    {
      echartTitle: '设备类别统计',
      color: [
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgb(251, 132, 88)'
            },
            {
              offset: 1,
              color: '#F2CAA4'
            }
          ],
          global: false
        },
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgb(53, 251, 152)'
            },
            {
              offset: 1,
              color: 'rgb(127, 235, 186 )'
            }
          ]
        },
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgb(18, 217, 254)'
            },
            {
              offset: 1,
              color: 'rgb(7, 143, 240)'
            }
          ],
          global: false
        }
      ],
      graphic: [
        {
          type: 'group',
          top: 'middle',
          left: 'center',
          id: 'data',
          children: [
            {
              type: 'text',
              top: 20,
              style: {
                text: '设备总数',
                font: ' 14px "AlibabaRegular", sans-serif',
                fill: 'rgb(255,255,255,0.8)',
                textAlign: 'center',
                zIndex: 9999
              }
            },
            {
              type: 'text',
              top: 40,
              style: {
                text: '305',
                textAlign: 'center',
                font: ' 36px "Dinpro", sans-serif',
                fill: 'url(#textGradient)'
              }
            },
            {
              type: 'text',
              top: 80,
              style: {
                text: '( 个 )',
                font: ' 14px "Microsoft YaHei", sans-serif',
                fill: 'rgb(255,255,255,0.8)',
                textAlign: 'center',
                zIndex: 9999
              }
            }
          ]
        }
      ],
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          type: 'pie',
          center: ['50%', '50%'],
          radius: ['45%', '65%'],
          padAngle: 5,
          itemStyle: {
            borderRadius: 0,
            borderWidth: 10
          },
          data: [
            {
              name: '水质监测点',
              value: 5,
              label: {
                color: 'rgb(251, 132, 88)'
              }
            },
            {
              name: '流量',
              value: 252,
              label: {
                color: 'rgb(53, 251, 152)'
              }
            },
            {
              name: '压力',
              value: 48,
              label: {
                color: 'rgb(7, 143, 240)'
              }
            }
          ],
          labelLine: {
            length: 15,
            length2: 25
          },
          label: {
            formatter: '{name|{b}}\n{line2|{c}}{unit|个}{line2|{d}%}\n{hr|}',
            color: '#fffdef',
            rich: {
              hr: {
                backgroundColor: 'auto',
                borderRadius: 3,
                width: 3,
                height: 3,
                padding: [3, 3, 0, -12]
              },
              name: {
                padding: [-12, 15, 0, 15],
                color: '#000',
                fontSize: 14,
                fontFamily: 'AlibabaRegular'
              },
              line2: {
                padding: [0, 10, -20, 5],
                fontFamily: 'AlibabaRegular',
                fontSize: 16,
                fontWeight: 'bold'
              },
              unit: {
                color: '#000',
                fontSize: 14,
                padding: [0, 0, -20, 0],
                fontFamily: 'AlibabaRegular'
              }
            }
          }
        },
        {
          type: 'pie',
          center: ['50%', '50%'],
          radius: ['37%', '75%'],
          label: {
            show: false
          },
          padAngle: 5,
          itemStyle: {
            opacity: 0.1,
            borderRadius: 0,
            borderWidth: 10
          },
          data: [
            {
              name: '水质监测点',
              value: 5
            },
            {
              name: '流量',
              value: 252
            },
            {
              name: '压力',
              value: 48
            }
          ]
        }
      ]
    }
  ]
}
// 表格
const tableData = ref()
tableData.value = {
  type: 'table',
  text: '029-009020601用户于2025年3月--2025年10月共计用水60吨，用水金额为264元，详情如下:',
  title: '用户用水情况',
  speechText: '你好我是数字人，你可以向我提问任何问题',
  tableConfig: {
    propList: [
      {
        label: '账单年月',
        prop: 'date'
      },
      {
        label: '用水量',
        prop: 'usage'
      },
      {
        label: '用水金额',
        prop: 'waterCost'
      },
      {
        label: '缴费金额',
        prop: 'payment'
      },
      {
        label: '账户余额',
        prop: 'balance'
      },
      {
        label: '上月抄码',
        prop: 'lastMonthCode'
      },
      {
        label: '本月抄码',
        prop: 'thisMonthCode'
      }
    ],
    total: 8,
    tableList: [
      {
        date: '2025-3',
        usage: 36,
        waterCost: 122.4,
        payment: 66.6,
        balance: 0,
        lastMonthCode: 12,
        thisMonthCode: 48
      },
      {
        date: '2025-4',
        usage: 13,
        waterCost: 100,
        payment: 55.8,
        balance: 48,
        lastMonthCode: 61,
        thisMonthCode: 72
      },
      {
        date: '2025-5',
        usage: 11,
        waterCost: 37.4,
        payment: 37.4,
        balance: 18.4,
        lastMonthCode: 61,
        thisMonthCode: 72
      },
      {
        date: '2025-6',
        usage: 12,
        waterCost: 40.8,
        payment: 22.4,
        balance: 0,
        lastMonthCode: 72,
        thisMonthCode: 84
      },
      {
        date: '2025-7',
        usage: 13,
        waterCost: 44.2,
        payment: 44.2,
        balance: 0,
        lastMonthCode: 84,
        thisMonthCode: 97
      },
      {
        date: '2025-8',
        usage: 7,
        waterCost: 23.8,
        payment: 50,
        balance: 26.2,
        lastMonthCode: 97,
        thisMonthCode: 104
      },
      {
        date: '2025-9',
        usage: 13,
        waterCost: 44.2,
        payment: 50,
        balance: 32,
        lastMonthCode: 104,
        thisMonthCode: 117
      },
      {
        date: '2025-10',
        usage: 14,
        waterCost: 47.6,
        payment: 50,
        balance: 34.4,
        lastMonthCode: 117,
        thisMonthCode: 131
      }
    ]
  },
  ulDataList: [
    '用户号: 029-009020601',
    '用户名: 杜凤琴',
    '用户地址:阳光花园小区9-2-601',
    '用户余额:34.40元',
    '总计欠费金额:0.00元'
  ]
}
// 排行榜
const rankData = ref()
rankData.value = {
  type: 'rank',
  text: '2025年4月-2025年10月欠费大户查询结果如下：',
  title: '查询欠费大户',
  speechText: '你好我是数字人，你可以向我提问任何问题',
  rankConfig: {
    propList: ['排名', '用户名称', '欠费金额'],
    total: 10,
    rankData: [
      {
        name: '新疆博格达物业管理有限公司',
        value: 4057638.6,
        unit: '元'
      },
      {
        name: '中国人民解放军9243部队',
        value: 452730.33,
        unit: '元'
      },
      {
        name: '阜康有色发展有限责任公司',
        value: 446047.2,
        unit: '元'
      },
      {
        name: '新疆五江天山投资有限公司',
        value: 352037.25,
        unit: '元'
      },
      {
        name: '新疆神火炭素制品有限公司',
        value: 282184.5,
        unit: '元'
      },
      {
        name: '阜康市城市管理局',
        value: 179878.7,
        unit: '元'
      },
      {
        name: '宝石花物业管理有限公司阜康准东分公司',
        value: 154525.75,
        unit: '元'
      },
      {
        name: '阜康市天池热力',
        value: 147718.6,
        unit: '元'
      },
      {
        name: '克拉玛依准东第一小学',
        value: 130692.6,
        unit: '元'
      },
      {
        name: '城关镇鱼儿沟中心村',
        value: 91713.6,
        unit: '元'
      }
    ]
  }
}
// 链接
const iframeUrl = ref()
iframeUrl.value = {
  title: '水源井数据分析统计',
  url: 'http://10.0.15.41:8000//smartwater/DevelopmentCase/WaterSourceWell/Portal/index.html'
}
// 图文
const imagetext = ref()
imagetext.value = {
  title: '水源井数据分析统计',
  url: 'http://10.0.15.41:8000//smartwater/DevelopmentCase/WaterSourceWell/Portal/index.html'
}
// 编辑器内容
const editorContent = ref()
editorContent.value = JSON.stringify(textareaContent.value)
const handleEditorChange = (value: string) => {
  editorContent.value = value
}
// 添加一个用于强制刷新的响应式变量
const refreshKey = ref(0)
const preView = async () => {
  let content
  // 确保内容是有效的 JSON 字符串再解析
  if (typeof editorContent.value === 'string') {
    content = JSON.parse(editorContent.value)
  } else {
    content = editorContent.value
  }
  switch (previewType.value) {
    case 'text':
      textareaContent.value = { ...content }
      break
    case 'table':
      tableData.value = { ...content }
      break
    case 'echarts':
      EchartOption.value = { ...content }
      break
    case 'iframe':
      iframeUrl.value = { ...content }
      break
    case 'rank':
      rankData.value = { ...content }
      break
    case 'image_text':
      imagetext.value = { ...content }
      break
    default:
      break
  }
  // 强制刷新预览区域
  refreshKey.value++
}
const previewRef = ref()
// 将previewRef内容保存成图片
// 为 iframe 创建占位图片
const createIframePlaceholderCanvas = async () => {
  // 创建一个临时的 div 元素来显示 iframe 信息
  const placeholderDiv = document.createElement('div')
  placeholderDiv.style.width = '600px'
  placeholderDiv.style.height = '400px'
  // 字体颜色根据主题变化
  placeholderDiv.style.color = isDarkTheme.value ? '#fff' : '#333'
  placeholderDiv.style.backgroundColor = 'transparent'
  placeholderDiv.style.display = 'flex'
  placeholderDiv.style.flexDirection = 'column'
  placeholderDiv.style.justifyContent = 'center'
  placeholderDiv.style.alignItems = 'center'
  placeholderDiv.style.fontFamily = 'Arial, sans-serif'
  placeholderDiv.style.padding = '20px'
  placeholderDiv.style.boxSizing = 'border-box'

  // 添加标题
  const titleEl = document.createElement('div')
  titleEl.textContent = iframeUrl.value?.title || '网页链接预览'
  titleEl.style.fontSize = '24px'
  titleEl.style.fontWeight = 'bold'
  titleEl.style.marginBottom = '20px'
  titleEl.style.textAlign = 'center'

  // 添加 URL 信息
  const urlEl = document.createElement('div')
  urlEl.textContent = iframeUrl.value?.url || '无链接信息'
  urlEl.style.fontSize = '16px'
  urlEl.style.textAlign = 'center'
  urlEl.style.wordBreak = 'break-all'
  urlEl.style.padding = '10px'
  urlEl.style.borderRadius = '4px'
  urlEl.style.maxWidth = '90%'

  // 添加提示信息
  const tipEl = document.createElement('div')
  tipEl.textContent = '注：网页链接内容无法直接生成图片'
  tipEl.style.fontSize = '14px'
  tipEl.style.marginTop = '20px'

  placeholderDiv.appendChild(titleEl)
  placeholderDiv.appendChild(urlEl)
  placeholderDiv.appendChild(tipEl)

  // 添加到页面中但隐藏起来
  placeholderDiv.style.position = 'absolute'
  placeholderDiv.style.top = '-10000px'
  document.body.appendChild(placeholderDiv)

  // 使用 html2canvas 转换为 canvas
  const canvas = await html2canvas(placeholderDiv, {
    useCORS: true,
    backgroundColor: null,
    allowTaint: true,
    scale: 9 // 提高图片质量
  })

  // 移除临时元素
  document.body.removeChild(placeholderDiv)

  return canvas
}
const getPreviewImageFileId = async () => {
  if (!previewRef.value) return ''
  const dom = previewRef.value.$el ? previewRef.value.$el : previewRef.value
  let canvas
  // 特殊处理 iframe 类型的预览
  if (previewType.value === 'iframe' && iframeUrl.value?.url) {
    // 对于 iframe，我们创建一个占位图片，显示标题和链接信息
    canvas = await createIframePlaceholderCanvas()
  } else {
    // 其他类型的预览正常使用 html2canvas
    canvas = await html2canvas(dom, { useCORS: true, backgroundColor: null })
  }

  const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), 'image/png'))
  const file = new File([blob], previewType.value + '.png', { type: 'image/png' })

  // 上传图片到服务器，获得 fileId
  let response: any = await handleFileUpload({
    file: file,
    dataId: '',
    folder: 'AIFile'
  })

  if (response.success) {
    return response.fileId
  }
}

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData(false)
    formData['sampleData'] = editorContent.value
    formData['styleContent'] = editorContent.value
    formData['styleScheme'] = 'PC'
    const fileId = await getPreviewImageFileId()
    formData['fileId'] = fileId
    let res: any
    if (formData.id) {
      res = await handleEdit(formData)
    } else {
      res = await handleSave(formData)
    }
    if (res.success) {
      return res.message || '操作成功'
    } else {
      useMessage('error', res.message || '操作失败')
      return false
    }
  } else {
    return false
  }
}
const feedBackData = async (row = {}) => {
  await nextTick() // 确保DOM更新完成
  console.log(row)
  const parm = { ...row } // 创建新对象保持响应性
  setValues(parm)
  previewType.value = row.resultType
  editorContent.value = row.sampleData
  // 执行下预览
  preView()
}
// 添加背景色切换相关变量
const isDarkTheme = ref(false)
const togglePreviewTheme = () => {
  isDarkTheme.value = !isDarkTheme.value
}
// 向子组件提供主题状态
provide('isDarkTheme', isDarkTheme)
const showRight = ref(true)
defineExpose({
  submit,
  feedBackData
})
</script>

<template>
  <div class="flex h-100%">
    <div
      class="flex-col p-20px"
      :style="{ width: showRight ? '40%' : '100%', borderRight: showRight ? '1px solid #eee' : '' }"
    >
      <div class="title-before m-b-10px">基础信息</div>
      <Form
        require-asterisk-position="right"
        :rules="rules"
        @register="formRegister"
        :schema="dialogSchemas"
      />
      <div class="title-before m-b-10px flex items-center justify-between">
        <div>内容编辑器</div>
        <div class="flex gap-2">
          <baseButton type="primary" @click="preView">预览</baseButton>
          <baseButton @click="togglePreviewTheme">
            {{ isDarkTheme ? '浅色主题' : '深色主题' }}
          </baseButton>
        </div>
      </div>
      <div class="flex-1">
        <CodeEditor
          v-model="editorContent"
          :editor-option="{
            ...editorOption,
            automaticLayout: true // 启用自动布局
          }"
          style="width: 100%; height: 100%; min-height: 300px"
          language="javascript"
          @update:modelValue="handleEditorChange"
        />
      </div>
    </div>
    <div class="flex-1 flex-col h-100% p-20px box-border" v-if="showRight">
      <div class="title-before m-b-10px">预览</div>
      <div
        class="flex-1"
        :class="isDarkTheme ? 'bg-[#0C2A42]' : 'bg-[var(--el-color-primary-light-11)]'"
      >
        <div class="h-100% center">
          <div class="w-90% h-100%" ref="previewRef">
            <div :key="refreshKey" class="w-100% h-100%">
              <!-- 使用 key 强制刷新 -->
              <template v-if="loaded">
                <!-- 纯文本 -->
                <div v-if="previewType === 'text'" class="w-full h-full p-4">
                  <!-- <pre>{{ textareaContent }}</pre> -->
                  <commonText :reply="textareaContent" />
                </div>
                <!-- 表格 -->
                <div v-if="previewType === 'table'" class="w-full h-full">
                  <!-- <commonText :reply="tableData" /> -->
                  <div v-if="showChart"> <commonTable :tableConfig="tableData.tableConfig" /> </div
                ></div>
                <!-- 排行榜 -->
                <div v-if="previewType === 'rank'" class="w-full h-full">
                  <!-- <commonText :reply="rankData" /> -->
                  <div v-if="showChart"> <commonRank :rankConfig="rankData.rankConfig" /> </div
                ></div>
                <!-- 图表 -->
                <div v-if="previewType === 'echarts'" class="w-full h-full">
                  <!-- <commonText :reply="EchartOption" /> -->
                  <div v-if="showChart">
                    <Echart
                      :height="EchartOption.options[0].series[0]?.type == 'pie' ? '350px' : '700px'"
                      v-for="(item, idx) in EchartOption.options"
                      :key="idx"
                      :chartConfig="{ option: item }"
                    />
                  </div>
                </div>
                <!-- 链接 -->
                <div v-if="previewType === 'iframe'" class="w-full h-full">
                  <commonUrlPage :replyContent="iframeUrl" class="w-full h-full" />
                </div>
                <!-- 图文展示 -->
                <div v-if="previewType === 'image_text'" class="w-full h-full"> </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.blue-bg {
  margin-top: 10px;
  background: #f9fbff;
  box-shadow: inset 0px 0px 12px 0px rgba(24, 144, 255, 0.1216);
  // padding: 15px 20px;
  padding: 3px;
  border-radius: 10px;
}
</style>
