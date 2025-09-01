<template>
  <div class="w-100% h-100% table-page-container retrieval">
    <div class="retrieval-body">
      <div class="retrieval-body-header">检索测试</div>
      <div class="retrieval-body-content">
        <div class="retrieval-body-content-left">
          <span>
            请完成召回测试:确保你的配置可以从数据库召回正确的文本块。如果你调整了这里的默认设置，比如关键词相似度权重，请注意这里的改动不会被自动保存。请务必在聊天助手设置或者召回算子设置处同步更新相关设置。
          </span>
          <div class="flex justify-between items-center mt30px">
            <div>测试文本</div>
            <div class="flex justify-between items-center gap-10px">
              <span>使用知识图谱</span>
              <el-switch v-model="useGraphRag" class="ml6px" />
              <el-tooltip
                content="文件分块后，所有块将用于知识图谱生成，这对多跳和复杂问题的推理大有帮助。"
                placement="top"
              >
                <Icon icon="svg-icon:app-questionMark" :size="16" />
              </el-tooltip>
            </div>
          </div>
          <div class="input-box">
            <!-- <ElScrollbar>
              <div
                ref="editableDiv"
                class="input-content"
                contenteditable="true"
                spellcheck="false"
                autocapitalize="off"
                autofocus
                @input="handleInput"
                @focus="saveCursor"
                @blur="saveCursor"
                @paste="handlePaste"
                @keydown="handleKeyDown"
              > </div>
            </ElScrollbar> -->
            <el-input
              v-model="textInput"
              :rows="10"
              :maxlength="200"
              placeholder="请输入文本"
              type="textarea"
              class="input-content"
            />

            <div class="input-bar">
              <div class="input-limit"> {{ textInput.length }}/200 </div>
              <BaseButton class="input-btn" type="primary" @click="handleTest">测试</BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="retrieval-body">
      <div class="retrieval-body-header">检索结果</div>
      <div class="retrieval-body-content bg-#F8F8F8">
        <div v-if="retrievalResult" class="p16px">
          {{ retrievalResult }}
        </div>
        <div v-else class="h-100% flex flex-col gap-20px items-center justify-center">
          <img src="@/assets/imgs/table-empty.png" alt="" />
          <span class="color-#333 font-size-14px">暂无数据</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { handleRetrievalTest } from '../IndexApi'
const props = defineProps({
  item: {
    type: Object as () => Record<string, any>, // 明确类型定义
    default: () => ({
      id: ''
    }),
    required: false
  }
})

const retrievalResult = ref(
  '请完成召回测试:确保你的配置可以从数据库召回正确的文本块。如果你调整了这里的默认设置，比如关键词相似度权重，请注意这里的改动不会被自动保存。请务必在聊天助手设置或者召回算子设置处同步更新相关设置。'
)
const useGraphRag = ref(false)
const textInput = ref('')
/* const editableDiv = ref<HTMLElement | null>(null)
const maxLength = 200 // 输入最大长度
const savedRange = ref<Range | null>(null) */

/* 自定义文本编辑器 */
/* // 保存光标位置
const saveCursor = () => {
  const selection = window.getSelection()
  if (selection && selection.rangeCount > 0) {
    savedRange.value = selection.getRangeAt(0)
  }
}
// 恢复光标位置
const restoreCursor = () => {
  const selection = window.getSelection()
  if (savedRange.value && editableDiv.value) {
    selection?.removeAllRanges()
    selection?.addRange(savedRange.value)
  }
}
// 处理输入事件，限制字符长度
const handleInput = () => {
  const div = editableDiv.value
  if (!div) return

  let text = div.textContent || ''
  const currentLength = text.length

  // 截断超出最大长度的内容
  if (currentLength > maxLength) {
    text = text.slice(0, maxLength)
    div.textContent = text
    textInput.value = text

    // 将光标定位到文本末尾
    moveCursorToEnd(div)
  } else {
    textInput.value = text
  }
}
const moveCursorToEnd = (element: HTMLElement) => {
  const range = document.createRange()
  const selection = window.getSelection()

  if (selection && element) {
    range.selectNodeContents(element)
    range.collapse(false) // false 表示定位到末尾

    selection.removeAllRanges()
    selection.addRange(range)
  }
}
const handleKeyDown = (event: KeyboardEvent) => {
  // const div = editableDiv.value;
  // if (!div) return;
  // const text = div.textContent || '';
  // const currentLength = text.length;
  // // 如果已经到达最大长度，阻止继续输入
  // if (currentLength >= maxLength) {
  //   event.preventDefault(); // 阻止默认输入行为
  //   moveCursorToEnd(div); // 保持光标在末尾
  // }
}
// 处理粘贴事件，限制为纯文本并截断
const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()

  const clipboardData = event.clipboardData || (window as any).clipboardData
  let pastedText = clipboardData.getData('text/plain')

  // 清理 HTML 标签
  // pastedText = DOMPurify.sanitize(pastedText, {
  //   ALLOWED_TAGS: [],
  //   ALLOWED_ATTR: []
  // })

  // 截断到最大长度
  const currentText = editableDiv.value?.textContent || ''
  const newText = currentText + pastedText
  const truncatedText = newText.slice(0, maxLength)

  // 插入文本到光标位置
  insertAtCursor(truncatedText)
}
// 插入文本到当前光标位置
const insertAtCursor = (text: string) => {
  const div = editableDiv.value
  if (!div) return

  const selection = window.getSelection()
  if (!selection || !selection.rangeCount || !div.contains(selection.anchorNode)) return

  const range = selection.getRangeAt(0)
  range.deleteContents()

  const textNode = document.createTextNode(text)
  range.insertNode(textNode)
  range.setStartAfter(textNode)
  range.setEndAfter(textNode)
  selection.removeAllRanges()
  selection.addRange(range)

  // 更新文本框内容
  textInput.value = div.textContent || ''
}
 */
/* onMounted(() => {
  if (editableDiv.value) {
    editableDiv.value.focus()
    // 设置初始内容（可选）
    // editableDiv.value.textContent = '初始输入内容';
    textInput.value = editableDiv.value.textContent || ''
  }
}) */
const handleTest = () => {
  const data = {
    question: textInput.value, //召回问题
    useGraphRag: useGraphRag.value, //是否启用知识图谱
    ragId: props.item.id, //知识库Id
    // doc_ids: '', //包含文档ID
    // vectorSimilarityWeight: '', //向量相似度权重
    // similarityThreshold: '' //相似度阈值
    pageSize: -1
  }
  handleRetrievalTest(data).then((res) => {
    if (res.code === 200) {
      retrievalResult.value = res.result.records[0]
    }
  })
}
</script>

<style scoped lang="less">
.retrieval {
  display: flex;
  flex-direction: row;
  border-radius: 2px;
  background: #ffffff;
  padding: 12px 16px;
  box-sizing: border-box;

  &-body {
    flex: 1;

    &-header {
      font-size: 16px;
      font-weight: bold;
      height: 32px;
      line-height: 20px;
      letter-spacing: 0em;
      color: #2e3336;
    }

    &-content {
      height: calc(100% - 32px);
      box-sizing: border-box;

      span {
        font-size: 14px;
        font-weight: normal;
        line-height: normal;
        letter-spacing: 0em;
        color: #777777;
      }

      &-left {
        width: 100%;
        height: 100%;
        padding: 10px 10px 0 0;
        box-sizing: border-box;
      }
    }
  }

  .input-box {
    max-width: 100%;
    background: #ffffff;
    border-radius: 4px;
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid rgba(0, 0, 0, 0.149);

    .input-content {
      // width: 700px;
      // max-width: 45vw;
      height: 228px;
      border: none;
      outline: none;
      white-space: pre-wrap; /* 保留空白和换行，自动换行 */
      overflow: auto; /* 内容过长时显示滚动条 */
      font-family: inherit;
      font-size: inherit;
    }

    .input-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;

      .input-limit {
        font-size: 12px;
        font-weight: normal;
        line-height: 12px;
        letter-spacing: 0em;
        color: #aaaaaa;
      }

      .input-btn {
        min-width: 76px;
      }
    }
  }
}
:deep(.input-content) {
  .el-textarea__inner {
    box-shadow: none;
    padding: 0;
    resize: none;
  }
}
</style>
