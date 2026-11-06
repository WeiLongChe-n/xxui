<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData } from 'vitepress'
import { brandOptions, setMode, setBrand, useTheme } from 'xxui-mobile'

const { isDark } = useData()
const { mode, brand } = useTheme()

const open = ref(false)
const root = ref<HTMLElement>()

const currentBrand = computed(() => brandOptions.find((item) => item.name === brand.value) || brandOptions[0])

const swatch = (hue: number, saturation = '88%') => `hsl(${hue} ${saturation} 55%)`

const applyDocsBrand = (hue: number, saturation: string) => {
  const style = document.documentElement.style
  style.setProperty('--vp-c-brand-1', `hsl(${hue} ${saturation} 45%)`)
  style.setProperty('--vp-c-brand-2', `hsl(${hue} ${saturation} 52%)`)
  style.setProperty('--vp-c-brand-3', `hsl(${hue} ${saturation} 60%)`)
  style.setProperty('--vp-c-brand-soft', `hsl(${hue} ${saturation} 55% / 0.14)`)
  style.setProperty('--vp-c-brand-softer', `hsl(${hue} ${saturation} 55% / 0.08)`)
}

const applyVitePressAppearance = (dark: boolean) => {
  document.documentElement.classList.toggle('dark', dark)
  try {
    localStorage.setItem('vitepress-theme-appearance', dark ? 'dark' : 'light')
  } catch {
    /* ignore */
  }
}

const chooseMode = (value: 'light' | 'dark') => {
  setMode(value)
  applyVitePressAppearance(value === 'dark')
  open.value = false
}

const chooseBrand = (name: typeof brandOptions[number]['name']) => {
  setBrand(name)
  open.value = false
  const item = brandOptions.find((option) => option.name === name)
  if (item) applyDocsBrand(item.hue, item.saturation)
}

/* 与 VitePress 明暗切换保持同步 */
watch(isDark, (dark) => setMode(dark ? 'dark' : 'light'))

const onDocumentClick = (event: MouseEvent) => {
  if (!root.value?.contains(event.target as Node)) open.value = false
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') open.value = false
}

onMounted(() => {
  setMode(isDark.value ? 'dark' : 'light')
  const item = currentBrand.value
  applyDocsBrand(item.hue, item.saturation)
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div ref="root" class="theme-switcher">
    <button
      type="button"
      class="theme-switcher__trigger"
      :aria-expanded="open"
      aria-label="切换主题"
      @click.stop="open = !open"
    >
      <span class="theme-switcher__dot" :style="{ background: swatch(currentBrand.hue, currentBrand.saturation) }" />
      <span class="theme-switcher__label">主题</span>
    </button>

    <transition name="x-fade">
      <div v-if="open" class="theme-switcher__panel">
        <div class="theme-switcher__group">
          <p class="theme-switcher__caption">外观模式</p>
          <div class="theme-switcher__modes">
            <button
              type="button"
              :class="['theme-switcher__mode', { 'is-active': mode === 'light' }]"
              @click="chooseMode('light')"
            >
              浅色
            </button>
            <button
              type="button"
              :class="['theme-switcher__mode', { 'is-active': mode === 'dark' }]"
              @click="chooseMode('dark')"
            >
              深色
            </button>
          </div>
        </div>

        <div class="theme-switcher__group">
          <p class="theme-switcher__caption">品牌配色</p>
          <div class="theme-switcher__brands">
            <button
              v-for="item in brandOptions"
              :key="item.name"
              type="button"
              :class="['theme-switcher__brand', { 'is-active': brand === item.name }]"
              :title="item.label"
              @click="chooseBrand(item.name)"
            >
              <span :style="{ background: swatch(item.hue, item.saturation) }" />
              <em>{{ item.label }}</em>
            </button>
          </div>
        </div>

        <a class="theme-switcher__more" href="/guide/theme">查看主题定制文档 →</a>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.theme-switcher {
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 8px;
}

.theme-switcher__trigger {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 4px 10px;
  font-size: 13px;
  color: var(--vp-c-text-1);
  cursor: pointer;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  transition: border-color 0.2s, background 0.2s;
}

.theme-switcher__trigger:hover {
  border-color: var(--vp-c-brand-1);
}

.theme-switcher__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.theme-switcher__panel {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  z-index: 60;
  width: 258px;
  padding: 14px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  box-shadow: var(--vp-shadow-3);
}

.theme-switcher__group + .theme-switcher__group {
  margin-top: 12px;
}

.theme-switcher__caption {
  margin: 0 0 8px;
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-text-3);
  letter-spacing: 0.04em;
}

.theme-switcher__modes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.theme-switcher__mode {
  padding: 6px 0;
  font-size: 12px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  background: var(--vp-c-bg-soft);
  border: 1px solid transparent;
  border-radius: 8px;
}

.theme-switcher__mode.is-active {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
}

.theme-switcher__brands {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.theme-switcher__brand {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  padding: 6px 0;
  cursor: pointer;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
}

.theme-switcher__brand span {
  width: 18px;
  height: 18px;
  border-radius: 50%;
}

.theme-switcher__brand em {
  font-size: 10px;
  font-style: normal;
  color: var(--vp-c-text-3);
}

.theme-switcher__brand.is-active {
  border-color: var(--vp-c-brand-1);
}

.theme-switcher__more {
  display: block;
  padding-top: 12px;
  margin-top: 12px;
  font-size: 12px;
  color: var(--vp-c-brand-1);
  text-align: center;
  border-top: 1px solid var(--vp-c-divider);
}

@media (max-width: 640px) {
  .theme-switcher__label {
    display: none;
  }
}
</style>
