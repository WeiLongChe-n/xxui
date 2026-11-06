<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData, useRoute, useRouter } from 'vitepress'
import MobilePreview from './MobilePreview.vue'
import {
  activateDemo,
  stageActiveId,
  stageActiveItem,
  stageItems,
  stagePosition,
  stageWide,
} from '../utils/demo-stage'

const { theme, page } = useData()
const route = useRoute()
const router = useRouter()

interface MenuItem {
  text: string
  link: string
}
interface MenuGroup {
  text: string
  items: MenuItem[]
}

type Panel = 'components' | 'demos' | null
const panel = ref<Panel>(null)
const menuRef = ref<HTMLElement | null>(null)

/* ---------------- 组件菜单（来自文档侧边栏） ---------------- */
const groups = computed<MenuGroup[]>(() => {
  const sidebar = theme.value.sidebar as Record<string, MenuGroup[]> | undefined
  return sidebar?.['/components/'] ?? []
})

const flatComponents = computed(() => groups.value.flatMap((group) => group.items))

const currentLink = computed(() => {
  const path = route.path.replace(/\.html$/, '').replace(/\/+$/, '')
  return flatComponents.value.find((item) => item.link === path)?.link ?? null
})

const currentName = computed(
  () =>
    flatComponents.value.find((item) => item.link === currentLink.value)?.text ??
    page.value.title ??
    '组件',
)

/* ---------------- 组件间浏览历史 ---------------- */
const history = ref<string[]>([])

watch(
  currentLink,
  (link) => {
    if (!link) return
    if (history.value[history.value.length - 1] === link) return
    history.value = [...history.value.slice(-19), link]
  },
  { immediate: true },
)

const canBack = computed(() => history.value.length > 1)

function goBack() {
  panel.value = null
  if (!canBack.value) return
  const next = history.value.slice(0, -1)
  const target = next[next.length - 1]
  if (!target) return
  history.value = next
  router.go(target)
}

function goComponent(item: MenuItem) {
  panel.value = null
  if (item.link === currentLink.value) return
  router.go(item.link)
}

/* ---------------- 示例菜单（当前页） ---------------- */
const activeTitle = computed(() => stageActiveItem.value?.title || currentName.value || '当前示例')

function pickDemo(id: string) {
  panel.value = null
  activateDemo(id, true)
}

async function toggle(next: Exclude<Panel, null>) {
  if (panel.value === next) {
    panel.value = null
    return
  }
  panel.value = next

  // 长列表（全部组件）打开时定位到当前项
  await nextTick()
  const wrap = menuRef.value
  const current = wrap?.querySelector<HTMLElement>('.stage__option.is-active')
  if (!wrap || !current) return
  wrap.scrollTop = current.offsetTop - wrap.clientHeight / 2 + current.offsetHeight / 2
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') panel.value = null
}

watch(stageActiveId, () => {
  panel.value = null
})

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div v-if="stageWide && stageActiveItem" class="stage">
    <div class="stage__nav">
      <button
        type="button"
        class="stage__icon"
        :disabled="!canBack"
        title="返回上一个组件"
        aria-label="返回上一个组件"
        @click="goBack"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path
            d="M15 5 8 12l7 7"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <button
        type="button"
        class="stage__picker"
        :class="{ 'is-open': panel === 'components' }"
        :aria-expanded="panel === 'components'"
        title="切换组件"
        @click="toggle('components')"
      >
        <span class="stage__title">{{ currentName }}</span>
        <svg class="stage__caret" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
          <path
            d="m6 9 6 6 6-6"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <button
        v-if="stagePosition.total > 1"
        type="button"
        class="stage__demos"
        :class="{ 'is-open': panel === 'demos' }"
        :aria-expanded="panel === 'demos'"
        title="切换本页示例"
        @click="toggle('demos')"
      >
        {{ stagePosition.index }}/{{ stagePosition.total }}
      </button>
    </div>

    <!-- 全部组件：按分组列出 -->
    <Transition name="stage-menu">
      <div v-if="panel === 'components'" ref="menuRef" class="stage__menu">
        <div v-for="group in groups" :key="group.text" class="stage__group">
          <p class="stage__group-title">{{ group.text }}</p>
          <button
            v-for="item in group.items"
            :key="item.link"
            type="button"
            class="stage__option"
            :class="{ 'is-active': item.link === currentLink }"
            @click="goComponent(item)"
          >
            <span class="stage__option-title">{{ item.text }}</span>
            <svg
              v-if="item.link === currentLink"
              viewBox="0 0 24 24"
              width="15"
              height="15"
              aria-hidden="true"
            >
              <path
                d="m5 12.5 4.5 4.5L19 7"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </Transition>

    <!-- 本页示例 -->
    <Transition name="stage-menu">
      <div v-if="panel === 'demos'" ref="menuRef" class="stage__menu">
        <button
          v-for="(item, i) in stageItems"
          :key="item.id"
          type="button"
          class="stage__option"
          :class="{ 'is-active': item.id === stageActiveId }"
          @click="pickDemo(item.id)"
        >
          <span class="stage__option-index">{{ i + 1 }}</span>
          <span class="stage__option-title">{{ item.title || `示例 ${i + 1}` }}</span>
          <svg
            v-if="item.id === stageActiveId"
            viewBox="0 0 24 24"
            width="15"
            height="15"
            aria-hidden="true"
          >
            <path
              d="m5 12.5 4.5 4.5L19 7"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </Transition>

    <div v-if="panel" class="stage__scrim" @click="panel = null" />

    <!-- 当前示例说明 -->
    <div class="stage__caption">
      <span class="stage__dot" aria-hidden="true" />
      <span class="stage__caption-text">{{ activeTitle }}</span>
    </div>

    <!-- 手机铺满剩余空间 -->
    <div class="stage__body">
      <MobilePreview
        stage
        :padding="stageActiveItem.padding"
        :background="stageActiveItem.background"
      />
    </div>
  </div>
</template>

<style scoped>
.stage {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 10px 12px 12px;
  overflow: hidden;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  box-shadow: 0 12px 32px rgba(16, 18, 26, 0.06);
}

/* ---------- 导航栏 ---------- */
.stage__nav {
  display: flex;
  flex: none;
  gap: 6px;
  align-items: center;
  padding: 0 2px 8px;
}

.stage__icon,
.stage__demos {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  height: 28px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 9px;
  transition: color 0.2s, border-color 0.2s, background 0.2s;
}

.stage__icon {
  width: 28px;
}

.stage__demos {
  min-width: 40px;
  padding: 0 7px;
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}

.stage__icon:hover:not(:disabled),
.stage__demos:hover,
.stage__demos.is-open {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  border-color: var(--vp-c-brand-2);
}

.stage__icon:disabled {
  color: var(--vp-c-text-3);
  cursor: default;
  opacity: 0.45;
}

.stage__picker {
  display: flex;
  flex: 1;
  gap: 5px;
  align-items: center;
  justify-content: center;
  min-width: 0;
  height: 28px;
  padding: 0 10px;
  font-size: 12.5px;
  color: var(--vp-c-text-1);
  cursor: pointer;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 9px;
  transition: color 0.2s, border-color 0.2s;
}

.stage__picker:hover,
.stage__picker.is-open {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-2);
}

.stage__title {
  flex: 0 1 auto;
  overflow: hidden;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stage__caret {
  flex: none;
  color: var(--vp-c-text-3);
  transition: transform 0.2s;
}

.stage__picker.is-open .stage__caret {
  transform: rotate(180deg);
}

/* ---------- 菜单 ---------- */
.stage__menu {
  position: absolute;
  top: 46px;
  right: 10px;
  left: 10px;
  z-index: 4;
  max-height: calc(100% - 64px);
  padding: 5px;
  overflow-y: auto;
  overscroll-behavior: contain;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow: 0 16px 32px rgba(16, 18, 26, 0.16);
}

.stage__group + .stage__group {
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px dashed var(--vp-c-divider);
}

.stage__group-title {
  padding: 4px 9px 2px;
  margin: 0;
  font-size: 11px;
  color: var(--vp-c-text-3);
}

.stage__option {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
  padding: 6px 9px;
  font-size: 12px;
  color: var(--vp-c-text-2);
  text-align: left;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 8px;
  transition: color 0.16s, background 0.16s;
}

.stage__option:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}

.stage__option.is-active {
  font-weight: 600;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.stage__option-index {
  flex: none;
  width: 16px;
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-3);
}

.stage__option.is-active .stage__option-index {
  color: var(--vp-c-brand-1);
}

.stage__option-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stage__option svg {
  flex: none;
}

/* 点击空白收起 */
.stage__scrim {
  position: absolute;
  inset: 44px 0 0;
  z-index: 3;
}

.stage-menu-enter-active,
.stage-menu-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.stage-menu-enter-from,
.stage-menu-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ---------- 当前示例说明 ---------- */
.stage__caption {
  display: flex;
  flex: none;
  gap: 7px;
  align-items: center;
  padding: 0 3px 8px;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.stage__dot {
  flex: none;
  width: 6px;
  height: 6px;
  background: var(--vp-c-brand-1);
  border-radius: 50%;
}

.stage__caption-text {
  overflow: hidden;
  font-weight: 500;
  color: var(--vp-c-text-2);
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ---------- 手机区域：铺满剩余空间 ---------- */
.stage__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

/* ---------- 固定到右侧 ---------- */
@media (min-width: 1280px) {
  .stage {
    position: fixed;
    top: calc(var(--vp-nav-height) + 20px);
    right: 20px;
    z-index: 25;
    width: clamp(320px, 27vw, 380px);
    height: calc(100vh - var(--vp-nav-height) - 40px);
  }
}
</style>
