<script setup lang="ts">
import { computed } from 'vue'
import { addUnit, createNamespace } from '../../utils'
import VlIcon from '../icon/Icon.vue'

defineOptions({ name: 'VlEmpty' })

const props = withDefaults(
  defineProps<{
    /** 预设插图 */
    image?: 'default' | 'error' | 'search' | 'network' | 'cart'
    description?: string
    imageSize?: string | number
  }>(),
  { image: 'default', imageSize: 110 },
)

const { bem } = createNamespace('empty')

const iconMap: Record<string, string> = {
  error: 'fail',
  search: 'search',
  network: 'exchange',
  cart: 'cart',
}

const iconName = computed(() => iconMap[props.image])
</script>

<template>
  <div :class="bem()">
    <div :class="bem('image')" :style="{ width: addUnit(imageSize) }">
      <slot name="image">
        <VlIcon v-if="iconName" :name="iconName" :class="bem('icon')" />
        <svg v-else :class="bem('svg')" viewBox="0 0 120 96" fill="none">
          <ellipse cx="60" cy="86" rx="38" ry="5" fill="currentColor" opacity="0.06" />
          <rect x="26" y="24" width="68" height="52" rx="10" fill="currentColor" opacity="0.08" />
          <path
            d="M26 44h18a4 4 0 0 1 3.6 2.3l1.8 3.4A4 4 0 0 0 53 52h14a4 4 0 0 0 3.6-2.3l1.8-3.4A4 4 0 0 1 76 44h18"
            stroke="currentColor"
            stroke-opacity="0.35"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path d="M48 34h24" stroke="currentColor" stroke-opacity="0.25" stroke-width="2" stroke-linecap="round" />
          <circle cx="60" cy="18" r="4" fill="currentColor" opacity="0.15" />
        </svg>
      </slot>
    </div>
    <div :class="bem('description')">
      <slot name="description">{{ description || '暂无数据' }}</slot>
    </div>
    <div v-if="$slots.default" :class="bem('bottom')">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.vl-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: var(--vl-text-color-4);

  &__image {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__svg {
    width: 100%;
    height: auto;
  }

  &__icon {
    font-size: 64px;
    color: var(--vl-text-color-4);
  }

  &__description {
    margin-top: 14px;
    font-size: var(--vl-font-size);
    color: var(--vl-text-color-3);
    text-align: center;
  }

  &__bottom {
    margin-top: 18px;
  }
}
</style>
