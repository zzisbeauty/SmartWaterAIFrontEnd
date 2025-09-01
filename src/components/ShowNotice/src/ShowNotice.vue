<script setup lang="ts">
import { Icon } from '@/components/Icon'
import { propTypes } from '@/utils/propTypes'
import { useI18n } from '@/hooks/web/useI18n'
import { ref } from 'vue'
const { t } = useI18n()
defineProps({
  color: propTypes.string.def('')
})
const isShowNotice = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const clickBadge = () => {}
</script>

<template>
  <div @click="clickBadge">
    <Icon
      :size="18"
      :icon="isShowNotice ? 'mdi:bell-badge' : 'mdi:bell'"
      :color="color"
      class="cursor-pointer"
    />
  </div>
</template>
