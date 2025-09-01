<template>
  <div class="moreEdit">
    <div class="moreEdit-form">
      <el-scrollbar ref="scrollbarRef" class="">
        <el-form :model="formData" label-width="150px" class="p16px">
          <!-- 知识库名称 -->
          <el-form-item label="知识库名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入" />
          </el-form-item>
          <!-- 知识库图标 -->
          <el-form-item label="知识库缩略图" prop="iconUrl">
            <template #label>
              <div class="pr10px">知识库缩略图</div>
            </template>
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :http-request="handleImgUpload"
            >
              <img v-if="formData.iconUrl" :src="formData.iconUrl" class="avatar" />
              <Icon v-else icon="ep:plus" class="avatar-uploader-icon" :size="36" />
            </el-upload>
          </el-form-item>
          <!-- 建议文本块大小 -->
          <el-form-item label="建议文本块大小" prop="pagerank">
            <template #label>
              <div class="flex items-center gap-10px pr12px">
                <span>建议文本块大小</span>
                <el-tooltip
                  content="建议的生成文本块的 token 数阈值。如果切分得到的小文本段 token 数达不到这一阈值就会不断与之后的文本段合并，
                            直至再合并下一个文本段会超过这一阈值为止，此时产生一个最终文本块。如果系统在切分文本段时始终没有遇到文本分段标识符，
                            即便文本段token 数已经超过这一阈值，系统也不会生成新文本块。"
                  placement="top"
                  popper-class="knowledge-tooltip"
                >
                  <Icon icon="svg-icon:app-questionMark" :size="16" />
                </el-tooltip>
              </div>
            </template>
            <template #default>
              <div class="flex items-center justify-between gap10px w-100%">
                <el-slider v-model="formData.pagerank" :min="1" :max="512" />
                <el-input-number
                  v-model="formData.pagerank"
                  :min="1"
                  :max="512"
                  controls-position="right"
                />
              </div>
            </template>
          </el-form-item>

          <!-- 文档解析器 -->
          <el-form-item label="文档解析器" prop="docParser">
            <template #label>
              <div class="flex items-center gap-10px">
                <span>文档解析器</span>
                <el-tooltip
                  content="使用视觉模型进行 PDF 布局分析，以更好地识别文档结构，找到标题、文本块、图像和表格的位置。 如果选择 Naive 选项，则只能获取 PDF 的纯文本。请注意该功能只适用于 PDF 文档，对其他文档不生效。"
                  placement="top"
                  popper-class="knowledge-tooltip"
                >
                  <Icon icon="svg-icon:app-questionMark" :size="16" />
                </el-tooltip>
              </div>
            </template>
            <el-select v-model="formData.docParser" placeholder="请选择">
              <el-option
                v-for="item in parserOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <!-- 嵌入模型 -->
          <el-form-item label="嵌入模型" prop="embdId">
            <template #label>
              <div class="flex items-center gap-10px">
                <span>嵌入模型</span>
                <el-tooltip
                  content="用于嵌入块的嵌入模型。 一旦知识库有了块，它就无法更改。 如果你想改变它，你需要删除所有的块。"
                  placement="top"
                  popper-class="knowledge-tooltip"
                >
                  <Icon icon="svg-icon:app-questionMark" :size="16" />
                </el-tooltip>
              </div>
            </template>
            <el-select v-model="formData.embdId" placeholder="请选择">
              <el-option
                v-for="item in ModelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <!-- 切片方法 -->
          <el-form-item label="切片方法" prop="slicingMethod">
            <template #label>
              <div class="flex items-center gap-10px">
                <span>切片方法</span>
                <el-tooltip
                  content="说明位于右侧。"
                  placement="top"
                  popper-class="knowledge-tooltip"
                >
                  <Icon icon="svg-icon:app-questionMark" :size="16" />
                </el-tooltip>
              </div>
            </template>
            <el-select v-model="formData.slicingMethod" placeholder="请选择">
              <el-option
                v-for="item in descriptionObject"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <!-- 提取知识图谱 -->
          <el-form-item label="提取知识图谱" prop="isUseGraph">
            <template #label>
              <div class="flex items-center gap-10px">
                <span>提取知识图谱</span>
                <el-tooltip
                  content="文件分块后，所有块将用于知识图谱生成，这对多跳和复杂问题的推理大有帮助。"
                  placement="top"
                  popper-class="knowledge-tooltip"
                >
                  <Icon icon="svg-icon:app-questionMark" :size="16" />
                </el-tooltip>
              </div>
            </template>
            <el-switch v-model="formData.isUseGraph" />
          </el-form-item>

          <!-- 动态添加的字段 -->
          <template v-if="formData.isUseGraph">
            <!-- 实体类型 -->
            <el-form-item label="实体类型">
              <!-- <template #label>
                <div class="flex items-center gap-10px pr12px">
                  <span>实体类型</span>
                  <el-tooltip content="实体类型" placement="top" popper-class="knowledge-tooltip">
                    <Icon icon="svg-icon:app-questionMark" :size="16" />
                  </el-tooltip>
                </div>
              </template> -->
              <el-tag
                v-for="tag in formData.entityTypes"
                :key="tag"
                closable
                @close="handleClose(tag)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                v-if="inputVisible"
                ref="InputRef"
                v-model="inputValue"
                class="ml-1 w-20"
                size="small"
                @keyup.enter="handleInputConfirm"
                @blur="handleInputConfirm"
              />
              <el-button v-else class="button-new-tag ml-1" @click="showInput" size="small">
                + New Tag
              </el-button>
            </el-form-item>

            <!-- 方法 -->
            <el-form-item label="方法" props="methodGraph">
              <template #label>
                <div class="flex items-center gap-10px">
                  <span>方法</span>
                  <el-tooltip
                    content="Light：实体和关系提取提示来自 GitHub - HKUDS/LightRAG：“LightRAG：简单快速的检索增强生成”
                              General：实体和关系提取提示来自 GitHub - microsoft/graphrag：基于图的模块化检索增强生成 (RAG) 系统"
                    placement="top"
                    popper-class="knowledge-tooltip"
                  >
                    <Icon icon="svg-icon:app-questionMark" :size="16" />
                  </el-tooltip>
                </div>
              </template>
              <el-select v-model="formData.methodGraph" placeholder="请选择">
                <el-option
                  v-for="item in methodOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <!-- 实体归一化 -->
            <el-form-item label="实体归一化" props="isResolution">
              <template #label>
                <div class="flex items-center gap-10px">
                  <span>实体归一化</span>
                  <el-tooltip
                    content="解析过程会将具有相同含义的实体合并在一起，从而使知识图谱更简洁、更准确。应合并以下实体：特朗普总统、唐纳德·特朗普、唐纳德·J·特朗普、唐纳德·约翰·特朗普"
                    placement="top"
                    popper-class="knowledge-tooltip"
                  >
                    <Icon icon="svg-icon:app-questionMark" :size="16" />
                  </el-tooltip>
                </div>
              </template>
              <el-switch v-model="formData.isResolution" />
            </el-form-item>

            <!-- 社区报告生成 -->
            <el-form-item label="社区报告生成" props="isGeneralReport">
              <template #label>
                <div class="flex items-center gap-10px">
                  <span>社区报告生成</span>
                  <el-tooltip
                    content="区块被聚集成层次化的社区，实体和关系通过更高抽象层次将每个部分连接起来。 然后，我们使用 LLM
生成每个社区的摘要，称为社区报告。更多信息：https://www.microsoft.com/en-us/research/blog/graphrag-improving-global-search-via-dynamic-community-selection/"
                    placement="top"
                    popper-class="knowledge-tooltip"
                  >
                    <Icon icon="svg-icon:app-questionMark" :size="16" />
                  </el-tooltip>
                </div>
              </template>
              <el-switch v-model="formData.isGeneralReport" />
            </el-form-item>
          </template>
          <!-- 描述 -->
          <el-form-item label="知识库表述" prop="description">
            <el-input v-model="formData.description" type="textarea" :rows="3" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>

    <div class="moreEdit-preview">
      <div class="moreEdit-preview__box">
        <div class="moreEdit-preview__box-title">{{ currentDes.value }}分块方法说明</div>
        <div class="moreEdit-preview__box-text">{{ currentDes.describe }}</div>
      </div>

      <div class="moreEdit-preview__box max-h-75%">
        <div class="moreEdit-preview__box-title">示例</div>
        <div class="h-100% mt16px">
          <el-scrollbar>
            <div class="moreEdit-preview__box-img">
              <img
                v-for="(name, index) in currentDes.imgList"
                :key="index"
                :src="importImg(name)"
                alt=""
              />
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { handleEdit } from '../IndexApi'
const formData = reactive({
  name: '',
  iconUrl: '',
  fileId: '',
  pagerank: 5,
  docParser: '',
  embdId: '',
  slicingMethod: 'laws',
  isUseGraph: false,
  entityTypes: [] as string[],
  methodGraph: '',
  isResolution: false,
  isGeneralReport: false,
  description: ''
})
// 文档解析
const parserOptions = [
  { label: 'DeepDoc', value: 'DeepDoc' },
  { label: 'Naive', value: 'Naive' }
]
// 嵌入模型
const ModelOptions = [
  { label: 'BAAI/BGE-LARGE-ZH-V1.5@BAAI', value: 'BAAI/BGE-LARGE-ZH-V1.5@BAAI' }
]
// 方法
const methodOptions = [
  { label: 'Light', value: 'Light' },
  { label: 'General', value: 'General' }
]
// 切片方法对应的描述说明
const descriptionObject = [
  {
    label: 'General',
    value: 'General',
    title: 'General分块方法说明',
    describe: `支持的文件格式为DOCX、XLSX、XLS (Excel97~2003)、PPT、PDF、TXT、JPEG、JPG、PNG、TIF、GIF、CSV、JSON、EML、HTML。 此方法将简单的方法应用于块文件：
      系统将使用视觉检测模型将连续文本分割成多个片段。
      接下来，这些连续的片段被合并成Token数不超过“Token数”的块。`,
    imgList: ['knowledge/General1.png', 'knowledge/General2.png']
  },
  {
    label: 'Q&A',
    value: 'Q&A',
    title: 'Q&A分块方法说明',
    describe: `此块方法支持 excel 和 csv/txt 文件格式。
      如果文件是 excel 格式，则应由两个列组成 没有标题：一个提出问题，另一个用于答案， 答案列之前的问题列。多张纸是 只要列正确结构，就可以接受。
      如果文件是 csv/txt 格式 以 UTF-8 编码且用 TAB 作分开问题和答案的定界符。 未能遵循上述规则的文本行将被忽略，并且 每个问答对将被认为是一个独特的部分。
      未能遵循上述规则的文本行将被忽略，并且 每个问答对将被认为是一个独特的部分。`,
    imgList: ['knowledge/Q&A1.png', 'knowledge/Q&A2.png']
  },
  {
    label: 'Manual',
    value: 'Manual',
    title: 'Manual分块方法说明',
    describe: `此块方法仅支持PDF。
      我们假设手册具有分层部分结构。 我们使用最低的部分标题作为对文档进行切片的枢轴。 因此，同一部分中的图和表不会被分割，并且块大小可能会很大。`,
    imgList: ['knowledge/Manual1.png', 'knowledge/Manual2.png']
  },
  {
    label: 'Table',
    value: 'Table',
    title: 'Table',
    describe: `支持XLSX和CSV/TXT格式文件。
      以下是一些提示：
      对于 csv 或 txt 文件，列之间的分隔符为 TAB。
      第一行必须是列标题。
      列标题必须是有意义的术语，以便我们的大语言模型能够理解。 列举一些同义词时最好使用斜杠'/'来分隔，甚至更好 使用方括号枚举值，例如 'gender/sex(male,female)'.
      以下是标题的一些示例：
      供应商/供货商'TAB'颜色（黄色、红色、棕色）'TAB'性别（男、女）'TAB'尺码（M、L、XL、XXL）
      姓名/名字'TAB'电话/手机/微信'TAB'最高学历（高中，职高，硕士，本科，博士，初中，中技，中 专，专科，专升本，MPA，MBA，EMBA）
      表中的每一行都将被视为一个块。`,
    imgList: ['knowledge/Table1.png', 'knowledge/Table2.png']
  },
  {
    label: 'Paper',
    value: 'Paper',
    title: 'Paper分块方法说明',
    describe: `仅支持PDF文件。
      如果我们的模型运行良好，论文将按其部分进行切片，例如摘要、1.1、1.2等。
      这样做的好处是LLM可以更好的概括论文中相关章节的内容， 产生更全面的答案，帮助读者更好地理解论文。 缺点是它增加了 LLM 对话的背景并增加了计算成本， 所以在对话过程中，你可以考虑减少‘topN’的设置。`,
    imgList: ['knowledge/Paper1.png', 'knowledge/Paper2.png']
  },
  {
    label: 'Book',
    value: 'Book',
    title: 'Book分块方法说明',
    describe: `支持的文件格式为DOCX、PDF、TXT。
      由于一本书很长，并不是所有部分都有用，如果是 PDF， 请为每本书设置页面范围，以消除负面影响并节省分析计算时间。`,
    imgList: [
      'knowledge/Book1.png',
      'knowledge/Book2.png',
      'knowledge/Book3.png',
      'knowledge/Book4.png'
    ]
  },
  {
    label: 'Laws',
    value: 'Laws',
    title: 'Laws分块方法说明',
    describe: `支持的文件格式为DOCX、PDF、TXT。
      法律文件有非常严格的书写格式。 我们使用文本特征来检测分割点。
      chunk的粒度与'ARTICLE'一致，所有上层文本都会包含在chunk中。`,
    imgList: ['knowledge/Laws1.png', 'knowledge/Laws2.png']
  },
  {
    label: 'Presentation',
    value: 'Presentation',
    title: 'Presentation分块方法说明',
    describe: `支持的文件格式为PDF、PPTX。
      每个页面都将被视为一个块。 并且每个页面的缩略图都会被存储。
      您上传的所有PPT文件都会使用此方法自动分块，无需为每个PPT文件进行设置。`,
    imgList: ['knowledge/Presentation1.png', 'knowledge/Presentation2.png']
  }
]
const currentDes = computed(() => {
  return (
    descriptionObject.find((item) => item.value === formData.slicingMethod) || {
      label: '',
      value: '',
      title: '',
      describe: '',
      imgList: []
    }
  )
})

const inputVisible = ref(false)
const inputValue = ref('')
const InputRef = ref()

const submit = async () => {
  const res = await handleEdit(formData)
  if (res.success) {
    useMessage('success', res.message || '操作成功')
    return true
  } else {
    useMessage('error', res.message || '操作失败')
    return false
  }
}

const feedBackData = (row: any = {}) => {
  Object.entries(row).forEach(([key, value]) => {
    formData[key] = value
  })
  formData.entityTypes = row.entityTypes || []
}

const showInput = () => {
  inputVisible.value = true
  inputValue.value = ''
  nextTick(() => {
    InputRef.value?.input?.focus()
  })
}
const scrollbarRef = ref()
const handleInputConfirm = async () => {
  if (inputValue.value) {
    formData.entityTypes.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}
watch(
  () => formData.isUseGraph,
  async () => {
    await nextTick()
    scrollbarRef.value?.update()
  }
)
const handleClose = (tag: string) => {
  formData.entityTypes.splice(formData.entityTypes.indexOf(tag), 1)
}

const handleImgUpload = async (res) => {
  let response: any = await handleFileUpload({
    file: res.file,
    folder: 'AIFile'
  })
  if (response.success) {
    // 上传成功后进行回显
    formData.iconUrl = response.fileUrl
    formData.fileId = response.fileId
  }
}
defineExpose({
  submit,
  feedBackData
})
</script>

<style lang="less" scoped>
div {
  box-sizing: border-box;
}
.moreEdit {
  display: flex;
  flex-direction: row;
  border-radius: 2px;
  background-color: #f5f5f5;
  height: 100%;
  max-height: 100%;
  // min-height: 100%;

  &-form {
    // padding: 16px;
    width: 40%;
    background: #fff;
  }
  &-preview {
    padding: 24px 32px;
    // flex: 1;
    width: 60%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    &__box {
      &-title {
        font-family: Microsoft YaHei UI;
        font-size: 16px;
        font-weight: bold;
        line-height: 16px;
        letter-spacing: 0em;
        color: #333333;
      }
      &-text {
        font-size: 14px;
        font-weight: normal;
        line-height: 14px;
        letter-spacing: 0em;
        color: #777777;
        padding: 20px 0;
      }
      &-img {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        img {
          height: 220px;
        }
      }
    }
  }
}
.avatar-uploader .avatar {
  width: 112px;
  height: 112px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  width: 112px;
  height: 112px;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
.knowledge-tooltip {
  width: 240px;
}
</style>
