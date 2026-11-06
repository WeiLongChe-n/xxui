<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useData } from 'vitepress'
import { highlight } from '../utils/highlight'
import MobilePreview from './MobilePreview.vue'

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    /** 源码内容，通常通过 ?raw 引入 */
    code?: string
    lang?: string
    /** 演示区域内边距 */
    padding?: 'normal' | 'none'
    /** 演示区背景 */
    background?: 'card' | 'page' | 'transparent'
    /** 是否默认展示代码 */
    defaultOpen?: boolean
    /** 是否用手机外框包裹演示（弹层类组件建议关闭） */
    mobile?: boolean
    /** 手机屏幕最大高度 */
    maxHeight?: number
  }>(),
  { lang: 'vue', padding: 'normal', background: 'card', mobile: true, maxHeight: 470 },
)

const { isDark } = useData()
const open = ref(props.defaultOpen || false)
const html = ref('')
const copied = ref(false)

const render = async () => {
  if (!props.code) return
  html.value = await highlight(props.code, props.lang, isDark.value)
}

watch([() => props.code, isDark], render, { immediate: true })

const toggle = async () => {
  open.value = !open.value
  if (open.value && !html.value) await render()
}

const copy = async () => {
  if (!props.code) return
  try {
    await navigator.clipboard.writeText(props.code.trim())
    copied.value = true
    setTimeout(() => (copied.value = false), 1600)
  } catch {
    copied.value = false
  }
}

const bodyClass = computed(() =>
  props.mobile
    ? ['demo-block__body', 'demo-block__body--mobile']
    : [
        'demo-block__body',
        `demo-block__body--${props.padding}`,
        `demo-block__body--${props.background}`,
      ],
)

const lines = computed(() => (props.code ? props.code.trim().split('\n').length : 0))
</script>

<template>
  <section class="demo-block">
    <header v-if="title || description" class="demo-block__header">
      <h3 v-if="title" class="demo-block__title">{{ title }}</h3>
      <p v-if="description" class="demo-block__desc">{{ description }}</p>
    </header>

    <div :class="bodyClass">
      <MobilePreview
        v-if="mobile"
        :padding="padding"
        :background="background"
        :max-height="maxHeight"
      >
        <slot />
      </MobilePreview>
      <slot v-else />
    </div>

    <footer v-if="code" class="demo-block__footer">
      <button type="button" class="demo-block__action" @click="toggle">
        <span class="demo-block__chevron" :class="{ 'demo-block__chevron--open': open }">▾</span>
        {{ open ? '收起代码' : '查看代码' }}
      </button>
      <div class="demo-block__meta">
        <span>{{ lines }} 行</span>
        <button type="button" class="demo-block__action" @click="copy">
          {{ copied ? '已复制' : '复制' }}
        </button>
      </div>
    </footer>

    <div v-if="code" v-show="open" class="demo-block__code" v-html="html" />
  </section>
</template>

<style scoped>
.demo-block {
  margin: 20px 0;
  overflow: hidden;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  transition: border-color 0.2s;
}

.demo-block:hover {
  border-color: var(--vp-c-brand-2);
}

.demo-block__header {
  padding: 18px 20px 0;
}

.demo-block__title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.demo-block__desc {
  margin: 6px 0 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.demo-block__body {
  padding: 20px;
}

.demo-block__body--mobile {
  padding: 18px 16px 16px;
  background:
    radial-gradient(circle at 1px 1px, var(--vp-c-divider) 1px, transparent 0) 0 0 / 18px 18px,
    var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-divider);
}

.demo-block__body--none {
  padding: 0;
}

.demo-block__body--page {
  background: var(--vl-background);
}

.demo-block__body--transparent {
  background: transparent;
}

.demo-block__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-top: 1px dashed var(--vp-c-divider);
}

.demo-block__meta {
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.demo-block__action {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  padding: 4px 8px;
  font-size: 12px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 6px;
  transition: color 0.2s, background 0.2s;
}

.demo-block__action:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
}

.demo-block__chevron {
  display: inline-block;
  font-size: 10px;
  transition: transform 0.2s;
}

.demo-block__chevron--open {
  transform: rotate(180deg);
}

.demo-block__code {
  max-height: 520px;
  overflow: auto;
  border-top: 1px solid var(--vp-c-divider);
}

.demo-block__code :deep(pre) {
  padding: 16px 20px;
  margin: 0;
  font-size: 12.5px;
  line-height: 1.75;
  background: var(--vp-c-bg-soft) !important;
}

.demo-block__code :deep(code) {
  font-family: var(--vp-font-family-mono);
}
</style>
