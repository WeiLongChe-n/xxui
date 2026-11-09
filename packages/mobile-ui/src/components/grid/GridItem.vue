<script setup lang="ts">
import { inject, type ComputedRef } from 'vue'
import { createNamespace } from '../../utils'
import XIcon from '../icon/Icon.vue'
import XBadge from '../badge/Badge.vue'

defineOptions({ name: 'XGridItem' })

const props = defineProps<{
  text?: string
  icon?: string
  badge?: string | number
  dot?: boolean
}>()

const emit = defineEmits<{ click: [event: MouseEvent] }>()

const parent = inject<{
  clickable: ComputedRef<boolean>
} | null>('x-grid', null)

const { bem } = createNamespace('grid-item')
</script>

<template>
  <div
    :class="[bem(), { [bem('', 'clickable')]: parent?.clickable.value }]"
    @click="emit('click', $event)"
  >
    <XBadge v-if="badge !== undefined || dot" :content="badge" :dot="dot" :class="bem('icon-wrap')">
      <XIcon v-if="icon" :name="icon" :class="bem('icon')" />
    </XBadge>
    <XIcon v-else-if="icon" :name="icon" :class="bem('icon')" />
    <span :class="bem('text')">
      <slot>{{ text }}</slot>
    </span>
  </div>
</template>

<style lang="scss">
.x-grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 14px 4px;
  background: var(--x-background-2);
  cursor: pointer;

  &__icon {
    font-size: 24px;
    color: var(--x-text-color);
  }

  &__text {
    max-width: 100%;
    padding: 0 2px;
    margin-top: 6px;
    overflow: hidden;
    font-size: 12px;
    line-height: 17px;
    color: var(--x-text-color-2);
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &--clickable:active {
    background: var(--x-active-color);
  }
}
</style>
