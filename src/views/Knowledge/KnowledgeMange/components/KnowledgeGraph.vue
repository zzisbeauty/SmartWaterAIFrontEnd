<template>
  <div ref="graphContainer" class="w-100% h-100% table-page-container"></div>
</template>

<script setup lang="ts">
import { Graph, iconfont } from '@antv/g6'
import { handleGetKnowledgeGraph } from '../IndexApi'
const props = defineProps({
  item: {
    type: Object as () => Record<string, any>, // 明确类型定义
    default: () => ({
      id: ''
    }),
    required: false
  }
})

const style = document.createElement('style')
style.innerHTML = `@import url('${iconfont.css}');`
document.head.appendChild(style)

const graphContainer: any = ref(null)
let graph = null

const TooltipColorMap = {
  combo: 'red',
  node: 'black',
  edge: 'blue'
}
const parseData = {
  nodes: [
    {
      id: 'node1',
      combo: 'combo1',
      style: { x: 245, y: 200 }
    },
    {
      id: 'node2',
      combo: 'combo1',
      style: { x: 210, y: 250 }
    },
    {
      id: 'node3',
      combo: 'combo1',
      style: { x: 280, y: 245 }
    },
    {
      id: 'node4',
      combo: 'combo2',
      style: { x: 400, y: 165 }
    },
    {
      id: 'node5',
      combo: 'combo2',
      style: { x: 450, y: 162 }
    },
    {
      id: 'node6',
      combo: 'combo3',
      style: { x: 425, y: 300 }
    },
    {
      id: 'node7',
      combo: 'combo3',
      style: { x: 360, y: 332 }
    }
  ],
  edges: [{ source: 'node2', target: 'node3' }],
  combos: [
    {
      id: 'combo1',
      combo: 'combo1',
      data: { label: 'Combo A' }
    },
    {
      id: 'combo2',
      combo: 'combo2',
      data: { label: 'Combo B' }
    },
    {
      id: 'combo3',
      data: { label: 'Combo C' }
    }
  ]
}

const initGraph1 = () => {
  const data = {
    nodes: [
      { id: '0', data: { type: 'a' } },
      { id: '1', data: { type: 'a' } },
      { id: '2', data: { type: 'a' } },
      { id: '3', data: { type: 'a' } },
      { id: '4', data: { type: 'c' } },
      { id: '5', data: { type: 'a' } },
      { id: '6', data: { type: 'b' } },
      { id: '7', data: { type: 'b' } },
      { id: '8', data: { type: 'c' } },
      { id: '9', data: { type: 'd' } },
      { id: '10', data: { type: 'd' } },
      { id: '11', data: { type: 'b' } },
      { id: '12', data: { type: 'c' } },
      { id: '13', data: { type: 'b' } },
      { id: '14', data: { type: 'd' } },
      { id: '15', data: { type: 'd' } },
      { id: '16', data: { type: 'b' } },
      { id: '17', data: { type: 'c' } },
      { id: '18', data: { type: 'c' } },
      { id: '19', data: { type: 'b' } },
      { id: '20', data: { type: 'b' } },
      { id: '21', data: { type: 'd' } },
      { id: '22', data: { type: 'd' } },
      { id: '23', data: { type: 'd' } },
      { id: '24', data: { type: 'a' } },
      { id: '25', data: { type: 'a' } },
      { id: '26', data: { type: 'b' } },
      { id: '27', data: { type: 'b' } },
      { id: '28', data: { type: 'd' } },
      { id: '29', data: { type: 'c' } },
      { id: '30', data: { type: 'c' } },
      { id: '31', data: { type: 'b' } },
      { id: '32', data: { type: 'b' } },
      { id: '33', data: { type: 'a' } }
    ],
    edges: [
      { source: '0', target: '1' },
      { source: '0', target: '2' },
      { source: '0', target: '3' },
      { source: '0', target: '4' },
      { source: '0', target: '5' },
      { source: '0', target: '7' },
      { source: '0', target: '8' },
      { source: '0', target: '9' },
      { source: '0', target: '10' },
      { source: '0', target: '11' },
      { source: '0', target: '13' },
      { source: '0', target: '14' },
      { source: '0', target: '15' },
      { source: '0', target: '16' },
      { source: '2', target: '3' },
      { source: '4', target: '5' },
      { source: '4', target: '6' },
      { source: '5', target: '6' },
      { source: '7', target: '13' },
      { source: '8', target: '14' },
      { source: '9', target: '10' },
      { source: '10', target: '22' },
      { source: '10', target: '14' },
      { source: '10', target: '12' },
      { source: '10', target: '24' },
      { source: '10', target: '21' },
      { source: '10', target: '20' },
      { source: '11', target: '24' },
      { source: '11', target: '22' },
      { source: '11', target: '14' },
      { source: '12', target: '13' },
      { source: '16', target: '17' },
      { source: '16', target: '18' },
      { source: '16', target: '21' },
      { source: '16', target: '22' },
      { source: '17', target: '18' },
      { source: '17', target: '20' },
      { source: '18', target: '19' },
      { source: '19', target: '20' },
      { source: '19', target: '33' },
      { source: '19', target: '22' },
      { source: '19', target: '23' },
      { source: '20', target: '21' },
      { source: '21', target: '22' },
      { source: '22', target: '24' },
      { source: '22', target: '25' },
      { source: '22', target: '26' },
      { source: '22', target: '23' },
      { source: '22', target: '28' },
      { source: '22', target: '30' },
      { source: '22', target: '31' },
      { source: '22', target: '32' },
      { source: '22', target: '33' },
      { source: '23', target: '28' },
      { source: '23', target: '27' },
      { source: '23', target: '29' },
      { source: '23', target: '30' },
      { source: '23', target: '31' },
      { source: '23', target: '33' },
      { source: '32', target: '33' }
    ]
  }
  graph = new Graph({
    container: graphContainer.value,
    autoFit: 'center',
    data,
    layout: {
      type: 'radial',
      nodeSize: 32,
      unitRadius: 90,
      linkDistance: 200,
      preventOverlap: true,
      sortBy: 'type',
      sortStrength: 50
    },
    node: {
      style: {
        labelFill: '#fff',
        labelPlacement: 'center',
        labelText: (d) => d.id
      },
      palette: {
        type: 'group',
        field: 'type'
      }
    },
    edge: {
      style: {
        endArrow: true
      }
    },
    behaviors: [
      'drag-element',
      'drag-canvas',
      'zoom-canvas',
      'collapse-expand',
      {
        type: 'hover-activate',
        degree: 1
      }
    ]
  })
  graph.render()
}
// 初始化知识图谱
/* const initKnowledgeGraph = () => {
  const graph = new Graph({
    container: graphContainer.value,
    autoFit: 'view',
    autoResize: true,
    behaviors: [
      'drag-element',
      'drag-canvas',
      'zoom-canvas',
      'collapse-expand',
      {
        type: 'hover-activate',
        degree: 1
      }
    ],
    plugins: [
      {
        type: 'tooltip',
        enterable: true,
        getContent: (e, items) => {
          if (Array.isArray(items)) {
            // if (items.some(x => x?.isCombo)) {
            // 	return `<p style="font-weight:600;color:red">${items?.[0]?.data?.label}</p>`
            // }
            let result = ``
            items.forEach((item) => {
              result += `<section style="color:${
                TooltipColorMap[e['targetType']]
              };"><h3>${item?.id}</h3>`
              if (item?.entity_type) {
                result += `<div style="padding-bottom: 6px;"><b>Entity type: </b>${item?.entity_type}</div>`
              }
              if (item?.weight) {
                result += `<div><b>Weight: </b>${item?.weight}</div>`
              }
              if (item?.description) {
                result += `<p>${item?.description}</p>`
              }
            })
            return result + '</section>'
          }
          return undefined
        }
      }
    ],
    layout: {
      type: 'combo-combined',
      preventOverlap: true,
      comboPadding: 1,
      spacing: 100
    },
    node: {
      style: {
        size: 150,
        labelText: (d) => d.id,
        // labelPadding: 30,
        labelFontSize: 40,
        //   labelOffsetX: 20,
        labelOffsetY: 20,
        labelPlacement: 'center',
        labelWordWrap: true
      },
      palette: {
        type: 'group',
        field: (d): any => d.entity_type
      }
    },
    edge: {
      style: (model) => {
        const weight = Number(model.weight) || 2
        const lineWeight = weight * 4
        return {
          stroke: '#99ADD1',
          lineWidth: lineWeight > 10 ? 10 : lineWeight
        }
      }
    }
  })
  graph.setData(parseData)
  graph.render()
}

const nextData = (data) => {
  if (!isEmpty(data)) {
    const graphData: any = data
    const mi = buildNodesAndCombos(graphData.nodes)
    return {
      edges: graphData.edges,
      nodes: mi.nodes,
      combos: mi.combos // 确保返回 combos
    }
  }
  return { nodes: [], edges: [], combos: [] }
}

const buildNodesAndCombos = (nodes) => {
  // 创建 combos 数组
  const combos = []
  // 根据 entity_type 创建 combo
  const entityTypes = [...new Set(nodes.map((node) => node.entity_type).filter(Boolean))]
  // 根据rank创建combo分组
  const rankGroups = [...new Set(nodes.map((node) => node.rank).filter(Boolean))]

  rankGroups.forEach((rank) => {
    combos.push({
      id: `rank_${rank}`,
      data: {
        label: `Rank ${rank}`
      }
    })
  })

  entityTypes.forEach((type) => {
    combos.push({
      id: type,
      data: {
        label: type
      }
    })
  })

  // 为每个节点分配对应的 combo
  // const nextNodes = nodes.map(node => {
  // 	return {
  // 		...node,
  // 		combo: node.entity_type // 使用 entity_type 作为 combo 的 id
  // 	}
  // })

  // 为每个节点分配对应的combo
  const nextNodes = nodes.map((node) => {
    return {
      ...node,
      combo: node.rank ? `rank_${node.rank}` : undefined
    }
  })

  return {
    nodes: nextNodes,
    combos: combos
  }
} */
onMounted(() => {
  // handleGetKnowledgeGraph({ id: props.item.id })
  initGraph1()
  // initKnowledgeGraph()
  // fetch('https://assets.antv.antgroup.com/g6/combo.json')
  //   .then((res) => res.json())
  //   .then((data) => {
  //     graph = new Graph({
  //       container: 'container',
  //       data,
  //       layout: {
  //         type: 'combo-combined',
  //         comboPadding: 2
  //       },
  //       node: {
  //         style: {
  //           size: 20,
  //           labelText: (d) => d.id,
  //           halo: true,
  //           badgeFontSize: 8,
  //           badgePadding: [1, 4],
  //           portR: 3,
  //           iconFontFamily: 'iconfont'
  //         },
  //         palette: {
  //           type: 'group',
  //           field: (d): any => d.combo
  //         }
  //       },
  //       edge: {
  //         style: (model): any => {
  //           const { size, color } = model.data
  //           return {
  //             stroke: color || '#99ADD1',
  //             lineWidth: size || 1,
  //             endArrow: true
  //           }
  //         }
  //       },
  //       combo: {},
  //       behaviors: ['drag-element', 'drag-canvas', 'zoom-canvas'],
  //       autoFit: 'view'
  //     })

  //     graph.render()
  //   })
})
onUnmounted(() => {
  graph.destroy()
})
</script>

<style lang="less" scoped></style>
