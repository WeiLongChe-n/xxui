<script setup lang="ts">
import { computed, getCurrentInstance, inject, onBeforeUnmount, ref, watch } from 'vue'
import { createNamespace } from '../../utils'
import { TABS_KEY, type TabItem, type TabsKey } from './context'

defineOptions({ name: 'VlTab' })

const props = defineProps<{
  /** 标题，也可使用 #title 插槽 */
  title?: string
  /** 标识，与 Tabs 的 v-model 对应；缺省时使用索引 */
  name?: TabsKey
  disabled?: boolean
  dot?: boolean
  badge?: string | number
}>()

const parent = inject(TABS_KEY, null)
if (!parent) {
  throw new Error('[Vela UI] <vl-tab> 必须放在 <vl-tabs> 内部使用')
}

const { bem } = createNamespace('tab')
const instance = getCurrentInstance()!

const index = ref(0)

const item: TabItem = {
  uid: instance.uid,
  get index() {
    return index.value
  },
  set index(value: number) {
    index.value = value
  },
  get name() {
    return props.name
  },
  get title() {
    return props.title
  },
  get disabled() {
    return props.disabled
  },
  get dot() {
    return props.dot
  },
  get badge() {
    return props.badge
  },
  slots: instance.slots,
}

parent.register(item)
onBeforeUnmount(() => parent.unregister(instance.uid))

const key = computed(() => props.name ?? index.value)
const isActive = computed(() => parent.activeKey.value === key.value)

const rendered = ref(false)
watch(
  isActive,
  (value) => {
    if (value) rendered.value = true
  },
  { immediate: true },
)
</script>

<template>
  <div
    v-if="rendered || !parent.lazyRender.value"
    v-show="isActive"
    :class="bem()"
    role="tabpanel"
  >
    <slot />
  </div>
</template>

<style lang="scss">
.vl-tab {
  width: 100%;
}
</style>
