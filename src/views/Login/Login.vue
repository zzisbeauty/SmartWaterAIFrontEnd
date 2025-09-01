<script setup lang="ts">
import { LoginForm } from './components'
import { useDesign } from '@/hooks/web/useDesign'
import { ElScrollbar } from 'element-plus'
import logoUrl from '/logo.png'

const title = import.meta.env.VITE_APP_TITLE

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('login')
</script>

<template>
  <div :class="prefixCls" class="h-[100%] relative lt-sm:px-10px lt-xl:px-10px lt-md:px-10px">
    <ElScrollbar class="h-full">
      <div class="relative min-h-100vh flex flex-col">
        <!-- 新增顶部标题区域 -->
        <!-- <div class="flex items-center justify-end p-r-2% py-8 border-b border-gray-100 shadow-sm"> -->
        <div class="flex items-center justify-end p-r-2% py-8 border-b border-gray-100">
          <img :src="logoUrl" alt="系统Logo" class="w-7 h-7 mr-2" />
          <h1 class="text-xl font-bold text-blue-800 costumer-font">{{ title }}</h1>
        </div>

        <!-- 登录表单 -->
        <div class="relative z-10 flex-1 flex items-center justify-center">
          <LoginForm />
        </div>
      </div>
    </ElScrollbar>
  </div>
</template>
<style lang="less" scoped>
.costumer-font {
  color: #1a76f0;
}
@prefix-cls: ~'@{namespace}-login';

.v-login {
  background-image: url('@/assets/imgs/login/bg4.png');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

// 新增响应式适配
@media screen and (max-width: 768px) {
  .v-login {
    .fixed {
      width: 80%;
      left: 50%;
      top: 50%;
      -webkit-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
    }
  }
}
</style>
<!-- <style lang="less" scoped>
@prefix-cls: ~'@{namespace}-login';

.@{prefix-cls} {
  overflow: auto;

  &__left {
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      background-image: url('@/assets/svgs/login-bg.svg');
      background-position: center;
      background-repeat: no-repeat;
      content: '';
    }
  }
}

.v-login {
  background-image: url('@/assets/imgs/login/bg.png');
  background-position: center;
  background-repeat: no-repeat;

  .center-content {
    width: 60%;
    height: 690px;
    border-radius: 12px;
    background: #ffffff;
    box-shadow: 0px 16px 32px 0px #bcd9ff;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    display: flex;
    .center-left {
      width: 50%;
      background-image: url('@/assets/imgs/login/left-bg.png');
      border-radius: 12px 0 0 12px;
      background-size: cover;
      background-position: center;
      box-sizing: border-box;
      padding: 43px 60px;
      .left-label {
        font-family: Alibaba PuHuiTi;
        font-size: 16px;
        font-weight: normal;
        line-height: 16px;
        text-transform: uppercase;
        letter-spacing: 0em;
        color: #ffffff;
        opacity: 0.5;
      }
      .left-title {
        font-family: Alibaba PuHuiTi;
        font-size: 32px;
        font-weight: 500;
        line-height: 32px;
        text-transform: uppercase;
        letter-spacing: 0em;
        color: #ffffff;
      }
      .left-title-line {
        margin-top: 18px;
        width: 31px;
        height: 3px;
        opacity: 1;
        background: #ffffff;
      }
    }
    .center-right {
      width: 50%;
    }
    @media screen and (max-width: 1279.9px) {
      .center-right {
        width: 100%;
      }
    }
    :deep(.el-form) {
      .el-col {
        padding-right: 0 !important;
        padding-left: 0 !important;
      }
      .login-title {
        font-family: Source Han Sans SC;
        font-size: 24px;
        font-weight: 500;
        line-height: 24px;
        letter-spacing: 0em;
        color: #232426;
        display: flex;
        align-items: center;
        flex-direction: column;
        margin-bottom: 46px;
        margin-top: 0;
        &:after {
          content: '';
          position: absolute;
          width: 56px;
          height: 4px;
          opacity: 1;
          background: #1a76f0;
          top: 35px;
        }
      }
      .el-input {
        width: 100%;
        height: 56px;
        border-radius: 4px;
        opacity: 1;
        .el-input__wrapper {
          background: #f2f4f9;
          box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
        }
        .input-icon {
          width: 25px;
          height: 25px;
        }
      }
      .el-button {
        height: 56px;
        margin-bottom: 25px;
      }
    }
  }
}

:deep(.input-icon) {
  width: 25px;
  height: 25px;
}
</style> -->
