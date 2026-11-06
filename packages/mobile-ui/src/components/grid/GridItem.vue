<script setup lang="ts">
import { inject, type ComputedRef } from 'vue'
import { createNamespace } from '../../utils'
import VlIcon from '../icon/Icon.vue'
import VlBadge from '../badge/Badge.vue'

defineOptions({ name: 'VlGridItem' })

const props = defineProps<{
  text?: string
  icon?: string
  badge?: string | number
  dot?: boolean
}>()

const emit = defineEmits<{ click: [event: MouseEvent] }>()

const parent = inject<{
  clickable: ComputedRef<boolean>
} | null>('vl-grid', null)

const { bem } = createNamespace('grid-item')
</script>

<template>
  <div
    :class="[bem(), { [bem('', 'clickable')]: parent?.clickable.value }]"
    @click="emit('click', $event)"
  >
    <VlBadge v-if="badge !== undefined || dot" :content="badge" :dot="dot" :class="bem('icon-wrap')">
      <VlIcon v-if="icon" :name="icon" :class="bem('icon')" />
    </VlBadge>
    <VlIcon v-else-if="icon" :name="icon" :class="bem('icon')" />
    <span :class="bem('text')">
      <slot>{{ text }}</slot>
    </span>
  </div>
</template>

<style lang="scss">
.vl-grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 14px 4px;
  background: var(--vl-background-2);
  cursor: pointer;

  &__icon {
    font-size: 24px;
    color: var(--vl-text-color);
  }

  &__text {
    margin-top: 6px;
    font-size: 12px;
    line-height: 17px;
    color: var(--vl-text-color-2);
    text-align: center;
  }

  &--clickable:active {
    background: var(--vl-active-color);
  }
}
</style>
