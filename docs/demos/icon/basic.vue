<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { Toast, iconPaths } from 'xxui-mobile'

const names = Object.keys(iconPaths)

const copied = ref<string | null>(null)
let timer: number | undefined

/**
 * 写剪贴板。
 *
 * 预览跑在 sandbox iframe 里，Clipboard API 可能被权限策略拒绝，
 * 所以退回到选区 + execCommand 的方案，保证点了就能复制到。
 */
async function writeClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const area = document.createElement('textarea')
      area.value = text
      area.setAttribute('readonly', '')
      area.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none;'
      document.body.appendChild(area)
      area.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(area)
      return ok
    } catch {
      return false
    }
  }
}

const copy = async (name: string) => {
  if (!(await writeClipboard(name))) {
    Toast.fail(`复制失败，请手动复制 ${name}`)
    return
  }

  copied.value = name
  Toast.success(`已复制 ${name}`)
  window.clearTimeout(timer)
  timer = window.setTimeout(() => (copied.value = null), 1400)
}

onBeforeUnmount(() => window.clearTimeout(timer))
</script>

<template>
  <div class="icon-demo">
    <button
      v-for="name in names"
      :key="name"
      type="button"
      class="icon-demo__item"
      :class="{ 'is-copied': copied === name }"
      :title="`点击复制 ${name}`"
      @click="copy(name)"
    >
      <x-icon :name="name" size="22" />
      <span class="icon-demo__name">{{ copied === name ? '已复制' : name }}</span>
    </button>
  </div>
</template>

<style scoped>
.icon-demo {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
  gap: 12px;
}

.icon-demo__item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  padding: 12px 4px;
  font-family: inherit;
  font-size: 11px;
  color: var(--x-text-color-2);
  text-align: center;
  word-break: break-all;
  cursor: pointer;
  background: var(--x-background-3);
  border: 1px solid transparent;
  border-radius: 10px;
  transition: color 0.2s, background 0.2s, border-color 0.2s, transform 0.12s;
}

.icon-demo__item:hover {
  color: var(--x-primary);
  background: var(--x-background-2);
  border-color: var(--x-primary);
}

.icon-demo__item:active {
  transform: scale(0.96);
}

.icon-demo__item.is-copied {
  color: var(--x-success);
  background: var(--x-background-2);
  border-color: var(--x-success);
}

.icon-demo__name {
  line-height: 1.3;
}
</style>
