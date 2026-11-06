import { computed, reactive, readonly, ref } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'auto'
export type BrandName = 'default' | 'ocean' | 'emerald' | 'violet' | 'sunset' | 'graphite'

export interface ThemeConfig {
  /** 明暗模式，auto 表示跟随系统 */
  mode: ThemeMode
  /** 品牌配色 */
  brand: BrandName
}

export interface InitThemeOptions {
  /** 默认配置，缺省为 light + default */
  defaultTheme?: Partial<ThemeConfig>
  /** 是否读取 / 写入 localStorage，默认 true */
  storage?: boolean
  /** 是否跟随系统变化，默认 true */
  followSystem?: boolean
}

export const THEME_STORAGE_KEY = 'vela-ui-theme'

/** 内置品牌配色 */
export const brandOptions = [
  { name: 'default' as BrandName, label: '曜石蓝', hue: 217, saturation: '88%' },
  { name: 'ocean' as BrandName, label: '海松青', hue: 195, saturation: '88%' },
  { name: 'emerald' as BrandName, label: '翡翠绿', hue: 158, saturation: '82%' },
  { name: 'violet' as BrandName, label: '紫罗兰', hue: 262, saturation: '85%' },
  { name: 'sunset' as BrandName, label: '落日橘', hue: 12, saturation: '88%' },
  { name: 'graphite' as BrandName, label: '石墨灰', hue: 218, saturation: '12%' },
]

export const themeModes: { name: ThemeMode; label: string }[] = [
  { name: 'light', label: '浅色' },
  { name: 'dark', label: '深色' },
  { name: 'auto', label: '跟随系统' },
]

const state = reactive<ThemeConfig>({ mode: 'light', brand: 'default' })
const systemDark = ref(false)
let mediaQuery: MediaQueryList | null = null
let storageEnabled = true
let initialized = false

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

const persist = () => {
  if (!isBrowser || !storageEnabled) return
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ mode: state.mode, brand: state.brand }))
  } catch {
    /* 隐私模式下忽略 */
  }
}

const applyToDom = () => {
  if (!isBrowser) return
  const root = document.documentElement
  const mode = state.mode === 'auto' ? (systemDark.value ? 'dark' : 'light') : state.mode
  root.dataset.theme = mode
  root.dataset.brand = state.brand
  root.style.colorScheme = mode
}

const syncSystem = () => {
  if (!isBrowser) return
  if (!mediaQuery) {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    systemDark.value = mediaQuery.matches
    mediaQuery.addEventListener('change', (event) => {
      systemDark.value = event.matches
      if (state.mode === 'auto') applyToDom()
    })
  } else {
    systemDark.value = mediaQuery.matches
  }
}

/**
 * 初始化主题：读取本地存储 → 应用默认值。
 * 由 VelaUI 插件在 app.use() 时自动调用，一般无需手动执行。
 */
export function initTheme(options: InitThemeOptions = {}) {
  if (!isBrowser) return
  const { defaultTheme, storage = true, followSystem = true } = options
  storageEnabled = storage
  if (followSystem) syncSystem()

  let stored: Partial<ThemeConfig> | null = null
  if (storage) {
    try {
      const raw = localStorage.getItem(THEME_STORAGE_KEY)
      if (raw) stored = JSON.parse(raw)
    } catch {
      stored = null
    }
  }

  state.mode = stored?.mode || defaultTheme?.mode || 'light'
  state.brand = stored?.brand || defaultTheme?.brand || 'default'
  applyToDom()
  initialized = true
}

/** 切换明暗模式 */
export function setMode(mode: ThemeMode) {
  state.mode = mode
  applyToDom()
  persist()
}

/** 切换品牌配色 */
export function setBrand(brand: BrandName) {
  state.brand = brand
  applyToDom()
  persist()
}

/** 一次性设置主题 */
export function setTheme(config: Partial<ThemeConfig>) {
  if (config.mode) state.mode = config.mode
  if (config.brand) state.brand = config.brand
  applyToDom()
  persist()
}

/** 在浅色 / 深色之间切换（auto 视为当前解析结果取反） */
export function toggleMode() {
  const current = state.mode === 'auto' ? (systemDark.value ? 'dark' : 'light') : state.mode
  setMode(current === 'dark' ? 'light' : 'dark')
}

/** 恢复默认主题 */
export function resetTheme() {
  setTheme({ mode: 'light', brand: 'default' })
}

/** 当前解析后的明暗模式（auto 会被解析为具体值） */
export const resolvedMode = computed<'light' | 'dark'>(() => {
  if (state.mode === 'auto') return systemDark.value ? 'dark' : 'light'
  return state.mode
})

export const isDark = computed(() => resolvedMode.value === 'dark')

/** 组合式用法：const { mode, brand, setBrand } = useTheme() */
export function useTheme() {
  if (isBrowser && !initialized) initTheme()
  return {
    state: readonly(state) as Readonly<ThemeConfig>,
    mode: computed(() => state.mode),
    brand: computed(() => state.brand),
    resolvedMode,
    isDark,
    brandOptions,
    themeModes,
    setMode,
    setBrand,
    setTheme,
    toggleMode,
    resetTheme,
  }
}
