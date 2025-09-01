<template>
  <div class="w-100% h-100% flex flex-col gap-10px px-10px box-border">
    <div class="h-48% w-100%" style="border: 1px solid #eee">
      <div class="detail-title">
        <div class="detail-title__icon"></div>
        <div>请求报文</div>
      </div>
      <el-scrollbar class="!h-[calc(100%-40px)]">
        <div class="detail-content p-20px">{{ requestContent }}</div>
      </el-scrollbar>
    </div>
    <div class="h-48% w-100%" style="border: 1px solid #eee">
      <div class="detail-title">
        <span class="detail-title__icon"></span>
        <span>响应报文</span>
      </div>
      <el-scrollbar class="!h-[calc(100%-40px)]">
        <div class="detail-content p-20px">{{ responseContent }}</div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface RowData {
  request: string
  response: string
}

const requestContent = ref<string>(
  'Ceakequideof!DFDdNLnhaSApgCXANI7IPUDCO4RHJEPiaHTTP REFERE//123.6.38.8t2t0 VALWIFUCBHFKVGZCVSVAIZSIVHMGN.EXNORWTIKHHEBrIVAEXIPFaSSNYSEOUEST METQUERY STRING:Ik4rp9l5TslM8kK6btotayDEDdNlnk49sb5E0-EdRhe7yMMgRlT9uOsl1s&nPFaS5NYhHTTP CONNECTION:T4nEiUEo7QBwWgl80hsTRGvScVgkmVzzS2PATH TRA!JvSTSIMBkKGbtOtaVDFDdNLnhgSAPgCXANj7IPUDCo4RHJEPjarWubHxri48cWpDy568lssFG0J-dzlhsHHw-TNKanCeakequideof!DFDdNLnhaSApgCXANI7IPUDCO4RHJEPiaHTTP REFERE//123.6.38.8t2t0 VALWIFUCBHFKVGZCVSVAIZSIVHMGN.EXNORWTIKHHEBrIVAEXIPFaSSNYSEOUEST METQUERY STRING:Ik4rp9l5TslM8kK6btotayDEDdNlnk49sb5E0-EdRhe7yMMgRlT9uOsl1s&nPFaS5NYhHTTP CONNECTION:T4nEiUEo7QBwWgl80hsTRGvScVgkmVzzS2PATH TRA!JvSTSIMBkKGbtOtaVDFDdNLnhgSAPgCXANj7IPUDCo4RHJEPjarWubHxri48cWpDy568lssFG0J-dzlhsHHw-TNKan'
)
const responseContent = ref<string>(
  'Ceakequideof!DFDdNLnhaSApgCXANI7IPUDCO4RHJEPiaHTTP REFERE//123.6.38.8t2t0 VALWIFUCBHFKVGZCVSVAIZSIVHMGN.EXNORWTIKHHEBrIVAEXIPFaSSNYSEOUEST METQUERY STRING:Ik4rp9l5TslM8kK6btotayDEDdNlnk49sb5E0-EdRhe7yMMgRlT9uOsl1s&nPFaS5NYhHTTP CONNECTION:T4nEiUEo7QBwWgl80hsTRGvScVgkmVzzS2PATH TRA!JvSTSIMBkKGbtOtaVDFDdNLnhgSAPgCXANj7IPUDCo4RHJEPjarWubHxri48cWpDy568lssFG0J-dzlhsHHw-TNKanCeakequideof!DFDdNLnhaSApgCXANI7IPUDCO4RHJEPiaHTTP REFERE//123.6.38.8t2t0 VALWIFUCBHFKVGZCVSVAIZSIVHMGN.EXNORWTIKHHEBrIVAEXIPFaSSNYSEOUEST METQUERY STRING:Ik4rp9l5TslM8kK6btotayDEDdNlnk49sb5E0-EdRhe7yMMgRlT9uOsl1s&nPFaS5NYhHTTP CONNECTION:T4nEiUEo7QBwWgl80hsTRGvScVgkmVzzS2PATH TRA!JvSTSIMBkKGbtOtaVDFDdNLnhgSAPgCXANj7IPUDCo4RHJEPjarWubHxri48cWpDy568lssFG0J-dzlhsHHw-TNKan'
)

const feedBackData = (row: RowData) => {
  // requestContent.value = row.request
  // responseContent.value = row.response
}

defineExpose({
  feedBackData
})
</script>

<style scoped lang="less">
.detail-title {
  display: flex;
  background-color: #e6f3ff;
  height: 39px;
  line-height: 39px;
  font-size: 14px;
  font-weight: normal;
  text-align: right;
  letter-spacing: 0em;
  color: #333333;
  &__icon {
    margin-right: 12px;
    width: 6px;
    height: 39px;
    opacity: 1;
    background: #2b90fb;
  }
}
.detail-content {
  box-sizing: border-box;
  font-family: Microsoft YaHei;
  font-size: 14px;
  letter-spacing: 0em;
  color: #333333;
}
</style>
