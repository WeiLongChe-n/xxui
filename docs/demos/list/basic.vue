<template>
  <div class="list-host">
    <vl-list
      :loading="loading"
      :finished="finished"
      :error="error"
      :offset="40"
      loading-text="加载中..."
      finished-text="没有更多了"
      error-text="加载失败，点击重试"
      @load="onLoad"
      @update:error="error = $event"
    >
      <vl-cell
        v-for="item in list"
        :key="item.id"
        :title="item.title"
        :label="item.desc"
        :value="`#${item.id}`"
      />
    </vl-list>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Item {
  id: number
  title: string
  desc: string
}

const list = ref<Item[]>([])
const loading = ref(false)
const finished = ref(false)
const error = ref(false)
let page = 0

const fetchPage = () =>
  new Promise<Item[]>((resolve) => {
    setTimeout(() => {
      page += 1
      const start = (page - 1) * 8
      resolve(
        Array.from({ length: 8 }, (_, index) => ({
          id: start + index + 1,
          title: `列表项 ${start + index + 1}`,
          desc: '滚动到底部自动加载下一页',
        })),
      )
    }, 600)
  })

const onLoad = async () => {
  if (loading.value || finished.value) return
  loading.value = true
  try {
    const items = await fetchPage()
    list.value = [...list.value, ...items]
    if (page >= 3) finished.value = true
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  onLoad()
})
</script>

<style scoped>
.list-host {
  overflow: hidden;
  background: var(--vl-background-2);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
}
</style>
