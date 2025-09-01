<script setup lang="ts">
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useAppStore } from '@/store/modules/app'
import { Footer } from '@/components/Footer'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NotFound from '@/views/Error/404.vue'

const appStore = useAppStore()

const layout = computed(() => appStore.getLayout)

const fixedHeader = computed(() => appStore.getFixedHeader)

const footer = computed(() => appStore.getFooter)

const tagsViewStore = useTagsViewStore()

const getCaches = computed((): string[] => {
  return tagsViewStore.getCachedViews
})
function setCssVariable(name: string, value: string) {
  document.documentElement.style.setProperty(name, value)
}
const tagsView = computed(() => appStore.getTagsView)
// 带地图的页面去掉padding
onMounted(()=>{
    if(useRouter().currentRoute.value.path.includes("CurrentScene")){
        setCssVariable('--app-content-padding', '0px')
    }
})
</script>

<template>
  <section
  id="container"
    class="relative"
    :class="[
      'p-[var(--app-content-padding)] h-[calc(100%-var(--app-content-padding)-var(--app-content-padding))] w-[calc(100%-var(--app-content-padding)-var(--app-content-padding))] bg-[var(--app-content-bg-color)] dark:bg-[var(--el-bg-color)]',
      {
        '!min-h-[calc(100%-var(--app-content-padding)-var(--app-content-padding)-var(--app-footer-height))]':
          (fixedHeader &&
            (layout === 'classic' || layout === 'topLeft' || layout === 'top') &&
            footer) ||
          (!tagsView && layout === 'top' && footer),

        '!min-h-[calc(100%-var(--app-content-padding)-var(--app-content-padding)-var(--app-footer-height)-var(--tags-view-height))]':
          tagsView && layout === 'top' && footer,

        '!min-h-[calc(100%-var(--tags-view-height)-var(--app-content-padding)-var(--app-content-padding)-var(--top-tool-height)-var(--app-footer-height))]':
          !fixedHeader && layout === 'classic' && footer,

        '!min-h-[calc(100%-var(--tags-view-height)-var(--app-content-padding)-var(--app-content-padding)-var(--app-footer-height))]':
          !fixedHeader && layout === 'topLeft' && footer,

        // '!min-h-[calc(100%-var(--app-content-padding)-var(--app-content-padding)-var(--app-footer-height)-var(--tags-view-height)-var(--top-tool-height))]':
        //   !fixedHeader && layout === 'top' && footer,

        '!min-h-[calc(100%-var(--app-footer-height)-var(--app-content-padding)-var(--app-content-padding))]':
          fixedHeader && layout === 'cutMenu' && footer,

        '!min-h-[calc(100%-var(--app-footer-height)-var(--app-content-padding)-var(--app-content-padding)-var(--tags-view-height))]':
          !fixedHeader && layout === 'cutMenu' && footer
      }
      //   'h-[calc(100%-var(--app-content-padding)-var(--app-content-padding)-var(--tags-view-height)-var(--top-tool-height))]'
    ]"
  >
    <router-view>
      <template #default="{ Component, route }">
        <keep-alive :include="getCaches">
          <component :is="Component || NotFound" :key="route.fullPath" />
        </keep-alive>
      </template>
    </router-view>
  </section>
  <Footer v-if="footer" />
</template>
