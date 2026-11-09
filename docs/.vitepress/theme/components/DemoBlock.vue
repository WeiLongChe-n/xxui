<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import { useData } from 'vitepress'
import { highlight } from '../utils/highlight'
import MobilePreview from './MobilePreview.vue'
import {
  activateDemo,
  registerDemo,
  stageActiveId,
  stageBody,
  stageResetKey,
  stageWide,
  unregisterDemo,
} from '../utils/demo-stage'

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
    /** 手机屏幕最大高度（窄屏内嵌时生效） */
    maxHeight?: number
  }>(),
  { lang: 'vue', padding: 'normal', background: 'card', maxHeight: 470 },
)

const { isDark } = useData()
const open = ref(props.defaultOpen || false)
const html = ref('')
const copied = ref(false)

const rootEl = ref<HTMLElement | null>(null)

/** SSR 安全的自增标识，保证服务端与客户端一致 */
const demoId = `demo-${useId()}`

/** 宽屏才把交互收进右侧盒子，窄屏回落到卡片内嵌 */
const useStage = computed(() => stageWide.value)
const active = computed(() => useStage.value && stageActiveId.value === demoId)

/** 重置时只重挂载当前激活的示例，切走再切回仍保留交互状态 */
const renderKey = ref(0)
watch(stageResetKey, () => {
  if (active.value) renderKey.value += 1
})

onMounted(() => {
  if (!rootEl.value) return
  registerDemo({
    id: demoId,
    el: rootEl.value,
    title: props.title ?? '',
    padding: props.padding,
    background: props.background,
  })
})

onBeforeUnmount(() => unregisterDemo(demoId))

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

const lines = computed(() => (props.code ? props.code.trim().split('\n').length : 0))

/** 宽屏下整张卡片都可点：提示条本身就写着「点击本卡片可切换」 */
const onCardClick = () => {
  if (useStage.value) activateDemo(demoId)
}
</script>

<template>
  <section
    ref="rootEl"
    class="demo-block"
    :class="{ 'is-active': active, 'is-stage': useStage }"
    @click="onCardClick"
  >
    <header class="demo-block__header" :class="{ 'demo-block__header--clickable': useStage }">
      <div class="demo-block__heading">
        <h3 v-if="title" class="demo-block__title">{{ title }}</h3>
        <p v-if="description" class="demo-block__desc">{{ description }}</p>
      </div>

      <span v-if="useStage" class="demo-block__badge" :class="{ 'is-on': active }">
        {{ active ? '预览中' : '查看' }}
      </span>
    </header>

    <!-- 宽屏：交互内容 Teleport 进右侧唯一的沙箱，这里只留提示 -->
    <div v-if="useStage" class="demo-block__hint">
      <span class="demo-block__hint-arrow" aria-hidden="true">→</span>
      <span>交互演示在右侧预览框中，点击本卡片可切换</span>
    </div>

    <!-- 窄屏：卡片内嵌手机框，行为与之前一致 -->
    <div v-else class="demo-block__body demo-block__body--mobile">
      <MobilePreview :padding="padding" :background="background" :max-height="maxHeight">
        <slot />
      </MobilePreview>
    </div>

    <Teleport v-if="useStage && stageBody" :to="stageBody">
      <div
        :key="renderKey"
        class="x-demo-hold"
        :class="{ 'is-active': active }"
        :data-demo="demoId"
      >
        <slot />
      </div>
    </Teleport>

    <footer v-if="code" class="demo-block__footer" @click.stop>
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
  transition: border-color 0.2s, box-shadow 0.2s;
}

.demo-block:hover {
  border-color: var(--vp-c-brand-2);
}

/* 宽屏下整卡可点，给出手型光标；页脚的操作按钮由 @click.stop 挡掉 */
.demo-block.is-stage {
  cursor: pointer;
}

.demo-block.is-active {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.demo-block__header {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 20px 0;
}

.demo-block__header--clickable {
  padding-bottom: 14px;
  cursor: pointer;
  user-select: none;
}

.demo-block__heading {
  min-width: 0;
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

.demo-block__badge {
  flex: none;
  padding: 2px 9px;
  font-size: 11px;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  transition: color 0.2s, background 0.2s, border-color 0.2s;
}

.demo-block__badge.is-on {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-2);
}

/* 宽屏提示条：说明交互去右侧看，同时撑起卡片高度，滚动联动更稳 */
.demo-block__hint {
  display: flex;
  gap: 8px;
  align-items: center;
  margin: 0 20px 14px;
  padding: 14px 16px;
  font-size: 12.5px;
  color: var(--vp-c-text-3);
  background:
    radial-gradient(circle at 1px 1px, var(--vp-c-divider) 1px, transparent 0) 0 0 / 16px 16px,
    var(--vp-c-bg-soft);
  border: 1px dashed var(--vp-c-divider);
  border-radius: 10px;
  transition: color 0.2s, border-color 0.2s;
}

.demo-block.is-active .demo-block__hint {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-2);
}

.demo-block__hint-arrow {
  font-size: 14px;
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
  background: var(--x-background);
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
