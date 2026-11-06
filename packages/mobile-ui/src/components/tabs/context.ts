import type { ComputedRef, InjectionKey, Slots } from 'vue'

export type TabsKey = string | number

export interface TabItem {
  uid: number
  index: number
  name?: TabsKey
  title?: string
  disabled?: boolean
  dot?: boolean
  badge?: string | number
  slots: Slots
}

export interface TabsContext {
  activeKey: ComputedRef<TabsKey | undefined>
  lazyRender: ComputedRef<boolean>;
  setActive: (key: TabsKey) => void
  register: (item: TabItem) => void
  unregister: (uid: number) => void
}

export const TABS_KEY: InjectionKey<TabsContext> = Symbol('vl-tabs')
