<script setup lang="ts">
import { provide, ref } from 'vue'
import { createNamespace } from '../../utils'

defineOptions({ name: 'VlDropdownMenu' })

const props = withDefaults(
  defineProps<{
    /** 是否点击空白处关闭 */
    closeOnClickOutside?: boolean
    /** 遮罩层层级 */
    zIndex?: number
    /** 遮罩透明度 */
    overlayOpacity?: number
  }>(),
  { closeOnClickOutside: true, overlayOpacity: 0.35 },
)

const { bem } = createNamespace('dropdown-menu')

const activeKey = ref<number | null>(null)

const open = (key: number) => {
  activeKey.value = key
}
const close = () => {
  activeKey.value = null
}
const toggle = (key: number) => {
  activeKey.value = activeKey.value === key ? null : key
}

provide('vl-dropdown-menu', { activeKey, open, close, toggle })
</script>

<template>
  <div :class="bem()" :style="props.zIndex ? { zIndex: props.zIndex } : undefined">
    <div :class="bem('bar')">
      <slot />
    </div>

    <Transition name="vl-dropdown-overlay">
      <div
        v-if="activeKey !== null"
        :class="bem('overlay')"
        :style="{ background: `rgba(0, 0, 0, ${props.overlayOpacity})` }"
        @click="props.closeOnClickOutside && close()"
      />
    </Transition>
  </div>
</template>

<style lang="scss">
.vl-dropdown-menu {
  position: relative;
  z-index: 2200;
  background: var(--vl-background-2);

  &__bar {
    position: relative;
    z-index: 2;
    display: flex;
    background: var(--vl-background-2);
    box-shadow: inset 0 -1px 0 var(--vl-border-color);
  }

  &__overlay {
    position: fixed;
    inset: 0;
    z-index: 1;
  }
}

.vl-dropdown-overlay-enter-active,
.vl-dropdown-overlay-leave-active {
  transition: opacity var(--vl-duration-fast) var(--vl-ease);
}

.vl-dropdown-overlay-enter-from,
.vl-dropdown-overlay-leave-to {
  opacity: 0;
}
</style>
