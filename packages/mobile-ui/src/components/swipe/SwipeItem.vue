<script setup lang="ts">
import { inject } from 'vue'
import { createNamespace } from '../../utils'
import { SWIPE_KEY } from './context'

defineOptions({ name: 'VlSwipeItem' })

const parent = inject(SWIPE_KEY, null)
if (!parent) {
  throw new Error('[Vela UI] <vl-swipe-item> 必须放在 <vl-swipe> 内部使用')
}

parent.register()
const { bem } = createNamespace('swipe-item')
</script>

<template>
  <div :class="bem()">
    <slot />
  </div>
</template>

<style lang="scss">
.vl-swipe-item {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
}
</style>
