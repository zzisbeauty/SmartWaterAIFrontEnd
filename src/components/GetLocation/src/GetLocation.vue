<script setup lang="tsx">
import { Dialog } from '@/components/Dialog'
import { ref } from 'vue'
import * as mars2d from 'mars2d'
import { mars2dMap } from '@/components/mars2dMap'
import { propTypes } from '@/utils/propTypes'
import { jsonpRequest } from '@/utils/jsonpRequest'

const visible = ref(false)

const props = defineProps({
  // locate: propTypes.bool.def(true),
  locate: propTypes.object.def({
    lat: '',
    lng: ''
  })
})

const selectedLocate = {
  lat: '',
  lng: '',
  addr: ''
}
const markers: any = []
const onload = (e) => {
  e.zoom = 13
//   e.center = [34.77731029084353,113.4078714556311]
  if (props.locate.lat || props.locate.lng) {
    addMarker(e, props.locate.lat, props.locate.lng)
    e.flyTo([props.locate.lat, props.locate.lng], e.getZoom(), {
      duration: 2
    })
  }
  e.on(mars2d.EventType.click, async function (event) {
    console.log(event)
    const res: any = await jsonpRequest(
      `https://api.map.baidu.com/reverse_geocoding/v3/?ak=fip4cGILfmldGc9jITG5fIq01cCSbejU&output=json&coordtype=gcj02ll&location=${event.latlng.lat},${event.latlng.lng}&extensions_poi=1&radius=100`
    )
    const list = res.result.result.pois
    console.log(list)
    let minDistance: number | null = null
    if (list.length > 0) {
      list.forEach((item) => {
        if (minDistance !== null && minDistance > parseInt(item.distance)) {
          minDistance = parseInt(item.distance)
          selectedLocate.addr = item.addr
        } else if (minDistance === null) {
          minDistance = parseInt(item.distance)
          selectedLocate.addr = item.addr
        }
      })
      addMarker(e, event.latlng.lat, event.latlng.lng)
    } else {
      selectedLocate.addr = ''
      addMarker(e, event.latlng.lat, event.latlng.lng)
    }
  })
}

const addMarker = (e, lat, lng) => {
  markers.forEach((item) => {
    e.removeLayer(item)
  })
  const imgUrl = new URL(`@/assets/imgs/marker-icon.png`, import.meta.url).href

  const marker = new mars2d.graphic.Marker({
    latlng: [lat, lng],
    style: {
      image: imgUrl,
      width: 22,
      height: 30
    }
  }).addTo(e)
  if (selectedLocate.addr !== '') {
    marker.bindPopup(selectedLocate.addr, {
      className: 'popupDiv'
    })
    new mars2d.layer.GraphicLayer({}).addGraphic(marker).addTo(e).openPopup()
  }
  selectedLocate.lat = lat
  selectedLocate.lng = lng
  markers.push(marker)
}

const emit = defineEmits(['located'])
const confirmLocate = () => {
  visible.value = false
  emit('located', selectedLocate)
}

defineExpose({
  visible
})
</script>

<template>
  <Dialog
    class="location-dialog"
    maxHeight="80%"
    maxWidth="80%"
    :isAappendToBody="true"
    :fullscreen="false"
    v-model="visible"
    title="获取坐标"
  >
    <mars2dMap @onload="onload" v-if="visible" />
    <template #footer>
      <BaseButton @click="visible = false">取消</BaseButton>
      <BaseButton type="primary" @click="confirmLocate"> 确定 </BaseButton>
    </template>
  </Dialog>
</template>

<style lang="less">
.location-dialog {
  height: 100%;

  .el-dialog__body {
    height: 100%;
  }
}
</style>
