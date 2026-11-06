<script setup lang="ts">
import { onMounted } from 'vue'
import DefaultTheme from 'vitepress/theme'
import ThemeSwitcher from './components/ThemeSwitcher.vue'
import DemoStage from './components/DemoStage.vue'
import { initStageViewport } from './utils/demo-stage'

const { Layout } = DefaultTheme

onMounted(initStageViewport)
</script>

<template>
  <Layout>
    <template #nav-bar-content-after>
      <ThemeSwitcher />
    </template>

    <!-- 右侧固定预览盒：整页交互都在这一个沙箱里 -->
    <template #doc-top>
      <DemoStage class="x-stage-aside" />
    </template>
  </Layout>
</template>
