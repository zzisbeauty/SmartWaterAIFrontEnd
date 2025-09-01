<template>
  <div class="w-100% h-100% dialogue-container">
<message />
  </div>
</template>

<script setup lang="tsx">
import message from "./Message/Index.vue"
interface DialogueItem {
  content: string;
  timestamp: string;
  isUser: boolean;
  avatar: string;
}
const feedBackData = ()=>{}

defineExpose({
  feedBackData,
});
</script>
