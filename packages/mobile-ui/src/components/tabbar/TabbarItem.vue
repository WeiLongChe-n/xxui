<script setup lang="ts">
import { computed, inject } from 'vue'
import { createNamespace } from '../../utils'
import { TABBAR_KEY, type TabbarKey } from './context'
import XIcon from '../icon/Icon.vue'
import XBadge from '../badge/Badge.vue'

defineOptions({ name: 'XTabbarItem' })

const props = defineProps<{
  /** 匹配 Tabbar 的 v-model 值 */
  name?: TabbarKey
  icon?: string
  activeIcon?: string
  text?: string
  badge?: string | number
  dot?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{ click: [key: TabbarKey] }>()

const parent = inject(TABBAR_KEY, null)
if (!parent) {
  throw new Error('[XXUI] <x-tabbar-item> 必须放在 <x-tabbar> 内部使用')
}

const { bem } = createNamespace('tabbar-item')
const index = parent.registerItem()

const key = computed<TabbarKey>(() => (props.name !== undefined ? props.name : index))
const isActive = computed(() => parent.activeKey.value === key.value)
const color = computed(() =>
  isActive.value ? parent.activeColor.value || 'var(--x-primary)' : parent.inactiveColor.value || 'var(--x-text-color-3)',
)
const iconName = computed(() => (isActive.value ? props.activeIcon || props.icon : props.icon))

const onClick = () => {
  if (props.disabled) return
  parent.setActive(key.value)
  emit('click', key.value)
}
</script>

<template>
  <div
    :class="[bem(), { [bem('', 'active')]: isActive, [bem('', 'disabled')]: disabled }]"
    :style="{ color }"
    role="tab"
    :aria-selected="isActive"
    @click="onClick"
  >
    <XBadge v-if="badge !== undefined || dot" :content="badge" :dot="dot" :class="bem('icon-wrap')">
      <XIcon :name="iconName" :class="bem('icon')" />
    </XBadge>
    <XIcon v-else-if="icon" :name="iconName" :class="bem('icon')" />
    <slot>
      <span v-if="text" :class="bem('text')">{{ text }}</span>
    </slot>
  </div>
</template>

<style lang="scss">
.x-tabbar-item {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: var(--x-font-size-xs);
  cursor: pointer;
  transition: color var(--x-duration-fast);

  &__icon {
    font-size: 22px;
  }

  &__text {
    margin-top: 3px;
    line-height: 14px;
  }

  &--active &__icon {
    transform: scale(1.04);
  }

  &--disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}
</style>
