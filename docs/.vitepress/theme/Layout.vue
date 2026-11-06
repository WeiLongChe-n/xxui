<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import ThemeSwitcher from './components/ThemeSwitcher.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #nav-bar-content-after>
      <ThemeSwitcher />
    </template>
  </Layout>
</template>
