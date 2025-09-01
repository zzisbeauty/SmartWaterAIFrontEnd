<template>
  <div class="h100% pos-relative">
    <div :id="withKeyId" class="mars2d-container"></div>
    <div
      class="absolute z-999 left-0 bottom-0 baseBox"
      :class="notShowChangeBaseMap ? 'hidden' : 'flex'"
      @mouseover="isHover = true"
      @mouseleave="isHover = false"
    >
      <div
        class="baseImgBox cursor-pointer pos-relative"
        v-for="item in basemaps"
        :key="item.id"
        :class="item.id == activeBase ? 'active' : ''"
        @click="changeBase(item.id)"
        v-show="isHover || (!isHover && item.id == activeBase)"
        ><img :src="item.img" alt="" />
        <span>{{ item.text }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
/**
 * 地图渲染组件
 * @copyright 火星科技 mars2d.cn
 * @author 火星吴彦祖 2022-02-19
 */
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import 'leaflet/dist/leaflet.css'
import 'leaflet'
import 'mars2d/dist/mars2d.css'
import 'mars2d'
import * as mars2d from 'mars2d'
// import * as mars2d from 'mars2d'
import 'leaflet/dist/leaflet.css'
import 'leaflet'
import 'mars2d/dist/mars2d.css'
import 'mars2d'
import basemap1 from '@/assets/imgs/basemap1.png'
import basemap2 from '@/assets/imgs/basemap2.png'

const props = withDefaults(
  defineProps<{
    url?: string
    mapKey?: string
    options?: any
    notShowChangeBaseMap?: boolean
  }>(),
  {
    url: new URL('/public/config/config.json', import.meta.url).href,
    mapKey: 'default',
    notShowChangeBaseMap: true,
    options: () => ({})
  }
)
const activeBase = ref(1)
const isHover = ref(false)
const basemaps = reactive([
  {
    id: 1,
    img: basemap1,
    text: '电子'
  },
  {
    id: 2,
    img: basemap2,
    text: '卫星'
  }
])
// 用于存放地球组件实例
let map: mars2d.Map // 地图对象

// 使用用户传入的 mapKey 拼接生成 withKeyId 作为当前显示容器的id
const withKeyId = computed(() => `mars2d-container-${props.mapKey}`)

onMounted(() => {
  // 获取配置
  mars2d.Util.fetchJson({ url: props.url }).then((data: any) => {
    initMars2d({
      // 合并配置项
      ...data.mars2d,
      ...props.options
    })
  })
})

// onload事件将在地图渲染后触发
const emit = defineEmits(['onload'])
const initMars2d = (option: any) => {
  map = new mars2d.Map(withKeyId.value, option) 
  console.log(map)
  // map构造完成后的一些处理
  onMapLoad()
  emit('onload', map)
   map.bindContextMenu([])
}
const flyto = (lat, lng,zoom = 16) => {
  map.flyTo([lat, lng], zoom)
}
const changeBase = (id) => {
  map.basemap = id
  activeBase.value = id
}
defineExpose({ flyto })

// map构造完成后的一些处理
function onMapLoad() {
  // 用于 config.json 中 西藏垭口 图层的详情按钮 演示
  // @ts-ignore
  // window.showPopupDetails = (item: any) => {
  //   alert(item.NAME);
  // };
}

// 组件卸载之前销毁mars2d实例
onBeforeUnmount(() => {
  if (map) {
    map.destroy()
    map = null
  }
  console.log('map销毁完成', map)
})
</script>

<style lang="less" scoped>
.mars2d-container {
  height: 100%;
  overflow: hidden;
}
.leaflet-tile-container img {
  width: 257px !important;
  height: 257px !important;
}
.mars2d-logo {
  display: none;
}
.leaflet-container.leaflet-touch-drag.leaflet-touch-zoom:focus-visible {
  outline: none !important;
}
.baseBox {
  padding-left: 10px;
  padding-top: 5px;
  .baseImgBox {
    margin-right: 10px;
    span {
      position: absolute;
      right: 0px;
      bottom: 5px;
      padding: 5px;
    }
    &.active {
      img {
        border: 2px solid #00b9ff;
      }
      span {
        color: #fff;
        background-color: #00b9ff;
      }
    }
  }
}
</style>
