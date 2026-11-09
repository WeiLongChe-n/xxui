<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import DefaultTheme from 'vitepress/theme'
import ThemeSwitcher from './components/ThemeSwitcher.vue'
import DemoStage from './components/DemoStage.vue'
import DemoGuide from './components/DemoGuide.vue'
import { initStageViewport } from './utils/demo-stage'
import { installSearchHotkeyGuard } from './utils/search-hotkey'

const { Layout } = DefaultTheme

let uninstallHotkey: (() => void) | null = null

onMounted(() => {
  initStageViewport()
  uninstallHotkey = installSearchHotkeyGuard()
})

onBeforeUnmount(() => {
  uninstallHotkey?.()
  uninstallHotkey = null
})
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

    <!-- 交互规则每页只讲一次，不再逐张卡片重复 -->
    <template #doc-before>
      <DemoGuide class="x-demo-guide" />
    </template>
  </Layout>
</template>
