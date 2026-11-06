<script setup lang="ts">
import { inject } from 'vue'
import { createNamespace } from '../../utils'
import { SWIPE_KEY } from './context'

defineOptions({ name: 'XSwipeItem' })

const parent = inject(SWIPE_KEY, null)
if (!parent) {
  throw new Error('[XXUI] <x-swipe-item> 必须放在 <x-swipe> 内部使用')
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
.x-swipe-item {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
}
</style>
