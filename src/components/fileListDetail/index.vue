<template>
    <div class="h-100% flex Attachment bg-#f8f8f8">
      <div class="h-[calc(100% - 20px)] w-68% flex-1 Attachment-content bg-#fff m-10px p-y-10px box-border">
        <div class="h-100% iframe-container" v-show="showAttachment">
          <div
            class="position-absolute top-10px left--10px cursor-pointer"
            @click="handleCloseAttachment"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              fill="none"
              version="1.1"
              width="46"
              height="42"
              viewBox="0 0 46 42"
            >
              <defs>
                <filter
                  id="master_svg0_33_4350"
                  filterUnits="objectBoundingBox"
                  color-interpolation-filters="sRGB"
                  x="-12"
                  y="-9"
                  width="52"
                  height="48"
                >
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  />
                  <feOffset dy="3" dx="0" />
                  <feGaussianBlur stdDeviation="3" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16078431904315948 0"
                  />
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                </filter>
              </defs>
              <g>
                <rect x="0" y="0" width="46" height="42" rx="0" fill="" fill-opacity="1" />
                <g filter="url(#master_svg0_33_4350)">
                  <path
                    d="M9 6C9 6 9 6 9 6L25 6C31.62741699796952 6 37 11.37258300203048 37 18L37 18C37 24.62741699796952 31.62741699796952 30 25 30L9 30C9 30 9 30 9 30Z"
                    fill="#FFFFFF"
                    fill-opacity="1"
                    style="mix-blend-mode: passthrough"
                  />
                </g>
                <g>
                  <path
                    d="M18.79770203125,22.581720625000003C18.64991203125,22.581720625000003,18.50211203125,22.433930625000002,18.50211203125,22.286130625C18.50211203125,22.138330625000002,18.64991203125,21.990540625,18.79770203125,21.990540625C18.79770203125,21.990540625,23.33009203125,21.990540625,23.33009203125,21.990540625C24.80805203125,21.990540625,26.039682031250003,20.758910625,26.039682031250003,19.280960625C26.039682031250003,17.803000625,24.80805203125,16.571370625,23.33009203125,16.571370625C23.33009203125,16.571370625,17.763135031250002,16.571370625,17.763135031250002,16.571370625C17.763135031250002,16.571370625,19.88153203125,18.689780625,19.88153203125,18.689780625C19.93080203125,18.739040625,19.98006203125,18.788300624999998,19.98006203125,18.886840624999998C19.98006203125,18.936100625,19.93080203125,19.034630625,19.88153203125,19.083900625C19.83227203125,19.133160625000002,19.78300203125,19.182430625000002,19.68447203125,19.182430625000002C19.63521203125,19.182430625000002,19.53668203125,19.133160625000002,19.48741203125,19.083900625C19.48741203125,19.083900625,16.87636233125,16.472840625,16.87636233125,16.472840625C16.82709713125,16.423580625,16.77783203125,16.374310625,16.77783203125,16.275780625C16.77783203125,16.226520625,16.82709713125,16.127990625,16.87636233125,16.078720625C16.87636233125,16.078720625,19.48741203125,13.467670425,19.48741203125,13.467670425C19.53668203125,13.418406025,19.58594203125,13.369140625,19.68447203125,13.369140625C19.73374203125,13.369140625,19.83227203125,13.418406025,19.88153203125,13.467670425C19.88153203125,13.566201625,19.93080203125,13.615466625,19.93080203125,13.713996625C19.93080203125,13.763261625,19.88153203125,13.861791625,19.83227203125,13.911057625C19.83227203125,13.911057625,17.71387003125,16.029460625,17.71387003125,16.029460625C17.71387003125,16.029460625,23.33009203125,16.029460625,23.33009203125,16.029460625C25.15305203125,16.029460625,26.63086203125,17.507260625,26.63086203125,19.330220625C26.63086203125,21.153180625,25.15305203125,22.630980625,23.33009203125,22.630980625C23.33009203125,22.630980625,18.79770203125,22.630980625,18.79770203125,22.630980625C18.79770203125,22.630980625,18.79770203125,22.581720625000003,18.79770203125,22.581720625000003C18.79770203125,22.581720625000003,18.79770203125,22.581720625000003,18.79770203125,22.581720625000003Z"
                    fill="#333333"
                    fill-opacity="1"
                    style="mix-blend-mode: passthrough"
                  />
                  <path
                    d="M18.54770203125,22.766430624999998Q18.47932203125,22.727740625,18.41770203125,22.666120624999998Q18.25211203125,22.500530625,18.25211203125,22.286130625Q18.25211203125,22.071730625,18.41771203125,21.906130625Q18.58330203125,21.740540625,18.79770203125,21.740540625L23.33009203125,21.740540625Q24.33500203125,21.740540625,25.062342031249997,21.013200625Q25.789682031250003,20.285870625,25.789682031250003,19.280960625Q25.789682031250003,18.276040625,25.062342031249997,17.548710625Q24.33500203125,16.821370625,23.33009203125,16.821380625L18.36669203125,16.821370625L20.05831203125,18.513000625Q20.23006203125,18.684750625,20.23006203125,18.886830625Q20.23006203125,19.088920625,20.05831203125,19.260670625Q19.88656203125,19.432430625000002,19.68447203125,19.432430625000002Q19.48239203125,19.432430625000002,19.31063203125,19.260670625L16.69958563125,16.649620625L16.69958213125,16.649620625Q16.52783203125,16.477870625,16.52783203125,16.275780625Q16.52783203125,16.073700625,16.69958413125,15.901950625L19.31064203125,13.290893725Q19.48239203125,13.119140625,19.68447203125,13.119140625Q19.88656203125,13.119140625,20.05831203125,13.290893025L20.13153203125,13.364116415L20.13153203125,13.467670425Q20.13153203125,13.476366625,20.14334203125,13.511777625Q20.18080203125,13.624162625,20.18080203125,13.713996625Q20.18080203125,13.916078625,20.00905203125,14.087833625L18.31742203125,15.779460625L23.33009203125,15.779460625Q24.80087203125,15.779460625,25.840862031249998,16.819450625Q26.88083203125,17.859450625,26.88083203125,19.330220625Q26.88083203125,20.800990625,25.840862031249998,21.840990625Q24.80086203125,22.880980625,23.33009203125,22.880980625L18.54770203125,22.880980625L18.54770203125,22.766430624999998ZM19.04770203125,22.380980625L23.33009203125,22.380980625Q24.59376203125,22.380980625,25.48731203125,21.487440624999998Q26.38086203125,20.593890625,26.38086203125,19.330220625Q26.38086203125,18.066560625,25.48731203125,17.173010625Q24.59376203125,16.279460625,23.33009203125,16.279460625L17.11031603125,16.279460625L19.65549203125,13.734281625L19.68080203125,13.713996625Q19.68080203125,13.705300625,19.66900203125,13.669890625Q19.66513203125,13.658307625,19.66167203125,13.646964625L17.05314003125,16.255500625L17.03089703125,16.273330625Q17.03849203125,16.281420625,17.05313903125,16.296070625L19.66419203125,18.907120625L19.68202203125,18.929360625Q19.69011203125,18.921770625,19.70476203125,18.907120625L19.72700203125,18.889290625Q19.71940203125,18.881200624999998,19.70476203125,18.866550625000002L17.15958103125,16.321370625L23.33009203125,16.321380625Q24.54211203125,16.321370625,25.41589203125,17.195160625Q26.289682031250003,18.068940625,26.289682031250003,19.280960625Q26.289682031250003,20.492980625,25.41589203125,21.366760625Q24.54211203125,22.240540625,23.33009203125,22.240540625L18.79770203125,22.240540625Q18.79041203125,22.240540625,18.77126203125,22.259690624999998Q18.75211203125,22.278840625,18.75211203125,22.286130625Q18.75211203125,22.293420625,18.77126203125,22.312570625Q18.79041203125,22.331720625000003,18.79770203125,22.331720625000003L19.04770203125,22.331720625000003L19.04770203125,22.380980625Z"
                    fill-rule="evenodd"
                    fill="#333333"
                    fill-opacity="1"
                    style="mix-blend-mode: passthrough"
                  />
                </g>
              </g>
            </svg>
          </div>
          <iframe
            height="100%"
            width="100%"
            :src="onlinePreview"
            frameborder="0"
            class="no-scrollbar"
          ></iframe>
        </div>
        <div class="h-100% Attachment-step" v-show="!showAttachment">
          <ElScrollbar>
            <slot ></slot>
          </ElScrollbar>
        </div>
      </div>
      <div class="h-100% w-32% Attachment-list" v-if="fileList.length">
        <div class="header-title">
          <div class="font-size-14px color-#333 flex justify-between items-center">
            <span>文件列表</span>
          </div>
        </div>
        <div
          class="p-10px box-border"
          :style="[
            {
              height: calculateHeight
            }
          ]"
        >
          <ElScrollbar>
            <div class="flex flex-col gap-10px p-5px">
              <div
                v-show="fileList.length"
                class="Attachment-list-item p-y-8px p-x-12px flex gap-12px items-caenter "
                v-for="(item, index) in fileList"
                :key="index"
                @click="toggleActive(index, item)"
                :class="{ active: isActiveIndex === index }"
              >
                <div class="w-36px h-36px">
                  <img
                    width="36px"
                    :src="importImg(`filetype${getIconNum(item.suffix)}.png`)"
                    alt=""
                  />
                </div>
                <div class="w-80% flex-1">
                  <div class="Attachment-list-item-fileName">{{ item.oldName }}</div>
                  <div class="Attachment-list-item-fileSize"
                    ><span>{{ item.fileSize }}</span
                    ><span class="">{{
                      dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
                    }}</span></div
                  >
                </div>
                <div class="flex gap-10px right-25px text-right" >
                  <Icon
                    icon="ep:download"
                    :size="16"
                    class="cursor-pointer download-icon"
                    @click.stop="handleDownload(item)"
                  />
                </div>
              </div>
              <el-empty v-show="!fileList.length" description="暂无文件" />
            </div>
          </ElScrollbar>
        </div>
     
       
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, nextTick, useSlots, computed } from 'vue'
//   import moment from 'moment'
  import dayjs from 'dayjs'
  import { ElMessageBox } from 'element-plus'
  import download from 'downloadjs'
  // 附件预览和内容切换
  const showAttachment = ref(false)
  const slots = useSlots()
  defineOptions({ name: 'Attachment' })
  const importImg = (url: string) => {
    return new URL(`/src/assets/imgs/${url}`, import.meta.url).href
  } 
  // 获取对应小图标
  const getIconNum = (suffix) => {
    if (['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].indexOf(suffix) !== -1) {
      return 4
    } else if (['doc', 'docx'].indexOf(suffix) != -1) {
      return 2
    } else if (['pdf'].indexOf(suffix) != -1) {
      return 1
    } else {
      return 3
    }
  }
  const props = withDefaults(
    defineProps<{
      fileList: Array<any>
      showAddBtn: boolean
      showUpload: boolean
    }>(),
    {
      fileList: [] as any,
      showAddBtn: false,
      showUpload: false
    }
  )
  const calculateHeight = computed(() => {
    const buttonHeight = slots.button ? '50px' : '0px'
    const uploadOffset = props.showUpload ? '190px' : '0px'
    const titleOffset = '42px'
  
    return `calc(100% - ${uploadOffset} - ${titleOffset} - ${buttonHeight})`
  })
  const onlinePreview = ref('')
  const isActiveIndex = ref(-1)
  const toggleActive = (index, item) => {
    isActiveIndex.value = isActiveIndex.value === index ? -1 : index
    showAttachment.value = true
    console.log(item.filePath)
    onlinePreview.value = `${import.meta.env.VITE_ONLINEPREVIEW}${encodeURIComponent(window.btoa(item.filePath))}`
  }
  
  const handleCloseAttachment = () => {
    showAttachment.value = false
  }
  
  const emit = defineEmits(['addFile', 'deleteFile'])
  const handleAddFile = (file: any) => {
    emit('addFile', file)
  }
  const handleDelete = (file) => {
    emit('deleteFile', file)
  }
  const handleDownload = (file) => {
    download(file?.filePath, `${file?.oldName}.${file?.suffix}`)
  }
  onMounted(() => {
    nextTick(() => {
      const dialog: HTMLElement = document.querySelector('.el-dialog')
      dialog.style.padding = '0'
      nextTick(() => {
        const dialogBody: HTMLElement = document.querySelector('.el-dialog__body')
        dialogBody.style.padding = '0'
      })
    })
  })
  </script>
  
  <style lang="less" scoped>
  .font-ysbt {
    font-family: 'Alibaba', sans-serif;
  }
  
  /* .iframe-container {
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
  
  .no-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
  } */
  
  .Attachment {
    &-content {
      // background-color: #f8f8f8;
      border-radius: 10px;
    }
  
    &-list {
      background-color: #fff;
  
      .header-title {
        border-bottom: 1px solid #e9e9e9;
        padding: 0 20px;
        line-height: 40px;
      }
  
      &-item {
        height: auto;
        width: auto;
        border-radius: 4px;
        background: #f8f8f8;
        box-sizing: border-box;
        cursor: pointer;
        flex-wrap: wrap;
        &:hover {
          // border: 1px solid #0080ff;
          background: #e6f3ff;
        }
  
        &.active {
          border: 1px solid #0080ff;
          background: #e6f3ff;
        }
  
        &-fileName {
          font-size: 12px;
          color: #333333;
          line-height: 14px;
        }
  
        &-fileSize {
          display: flex;
          // text-wrap: nowrap;
          gap: 5px;
          margin-top: 8px;
          font-size: 10px;
          color: #aaaaaa;
          line-height: 10px;
        }
      }
    }
  }
  
  .delete-icon {
    &:hover {
      color: rgb(201, 7, 7);
    }
  }
  .download-icon {
    &:hover {
      color: rgb(56, 173, 252);
    }
    
  }
  .Attachment-list-item-fileName{
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
  </style>
  