<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { createNamespace } from '../../utils'
import { TABBAR_KEY, type TabbarKey } from './context'

defineOptions({ name: 'XTabbar' })

const props = withDefaults(
  defineProps<{
    modelValue?: TabbarKey
    /** 固定在底部 */
    fixed?: boolean
    placeholder?: boolean
    border?: boolean
    activeColor?: string
    inactiveColor?: string
    safeAreaInsetBottom?: boolean
    zIndex?: number
  }>(),
  { fixed: true, border: true, safeAreaInsetBottom: true, zIndex: 100 },
)

const emit = defineEmits<{
  'update:modelValue': [key: TabbarKey]
  change: [key: TabbarKey]
}>()

const { bem } = createNamespace('tabbar')

let uid = 0
const currentKey = ref<TabbarKey>(props.modelValue ?? 0)

const activeKey = computed<TabbarKey>(() =>
  props.modelValue !== undefined && props.modelValue !== null ? props.modelValue : currentKey.value,
)

const setActive = (key: TabbarKey) => {
  currentKey.value = key
  emit('update:modelValue', key)
  emit('change', key)
}

provide(TABBAR_KEY, {
  activeKey,
  activeColor: computed(() => props.activeColor),
  inactiveColor: computed(() => props.inactiveColor),
  setActive,
  registerItem: () => uid++,
  border: computed(() => props.border),
})

const classes = computed(() => [
  bem(),
  {
    [bem('', 'fixed')]: props.fixed,
    [bem('', 'borderless')]: !props.border,
    [bem('', 'safe-bottom')]: props.safeAreaInsetBottom,
  },
])
</script>

<template>
  <div
    v-if="fixed && placeholder"
    :class="[bem('placeholder'), safeAreaInsetBottom && bem('placeholder', 'safe-bottom')]"
  />
  <div :class="classes" :style="{ zIndex }" role="tablist">
    <slot />
  </div>
</template>

<style lang="scss">
@use '../../styles/mixins' as *;

.x-tabbar {
  display: flex;
  height: var(--x-tabbar-height);
  background: var(--x-background-2);

  @include hairline(top);

  &--borderless::after {
    display: none;
  }

  &--fixed {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
  }

  &--safe-bottom {
    height: calc(var(--x-tabbar-height) + var(--x-safe-bottom));
    padding-bottom: var(--x-safe-bottom);
  }

  &__placeholder {
    height: var(--x-tabbar-height);

    &--safe-bottom {
      height: calc(var(--x-tabbar-height) + var(--x-safe-bottom));
    }
  }
}
</style>
