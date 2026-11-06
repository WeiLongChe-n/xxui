<script setup lang="ts">
import { computed } from 'vue'
import { addUnit, createNamespace } from '../../utils'

defineOptions({ name: 'VlOverlay' })

const props = withDefaults(
  defineProps<{
    show?: boolean
    zIndex?: number
    duration?: number | string
    /** 自定义类名 */
    overlayClass?: string
  }>(),
  { show: true },
)

const emit = defineEmits<{ click: [event: MouseEvent] }>()

const { bem } = createNamespace('overlay')

const style = computed(() => ({
  zIndex: props.zIndex,
  animationDuration: addUnit(props.duration, 's'),
}))
</script>

<template>
  <Transition name="vl-fade">
    <div
      v-if="show"
      :class="[bem(), props.overlayClass]"
      :style="style"
      @click="emit('click', $event)"
    >
      <slot />
    </div>
  </Transition>
</template>

<style lang="scss">
.vl-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: var(--vl-overlay-bg);
  touch-action: none;
}
</style>
