<script setup lang="ts">
import { computed } from 'vue'
import { addUnit, createNamespace } from '../../utils'
import { iconPaths } from './icons'

defineOptions({ name: 'VlIcon' })

const props = defineProps<{
  /** 图标名称，见「图标」文档；也可传入图片 URL */
  name?: string
  /** 尺寸，默认继承字号 */
  size?: string | number
  color?: string
  /** 旋转动画（常用于 loading） */
  spin?: boolean
  /** 红点 */
  dot?: boolean
  /** 角标内容 */
  badge?: string | number
}>()

const { bem } = createNamespace('icon')

const isImage = computed(() => !!props.name && /^(https?:|data:|\/\/)/.test(props.name))
const paths = computed(() => (props.name ? iconPaths[props.name] || [] : []))

const style = computed(() => ({
  color: props.color,
  width: addUnit(props.size),
  height: addUnit(props.size),
  fontSize: addUnit(props.size),
}))
</script>

<template>
  <i :class="[bem(), spin && bem('', 'spin')]" :style="style">
    <img v-if="isImage" :src="name" :class="bem('image')" alt="" />
    <svg v-else-if="paths.length" :class="bem('svg')" viewBox="0 0 24 24" aria-hidden="true">
      <path v-for="(d, index) in paths" :key="index" :d="d" />
    </svg>
    <slot v-else />
    <span v-if="badge || dot" :class="[bem('badge'), dot && bem('badge', 'dot')]">
      {{ dot ? '' : badge }}
    </span>
  </i>
</template>

<style lang="scss">
.vl-icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  line-height: 1;
  vertical-align: middle;

  &__svg {
    width: 1em;
    height: 1em;
    overflow: visible;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  &__image {
    width: 1em;
    height: 1em;
    object-fit: cover;
  }

  &--spin {
    animation: vl-icon-spin 0.9s linear infinite;
  }

  &__badge {
    position: absolute;
    top: -4px;
    right: -6px;
    min-width: 15px;
    height: 15px;
    padding: 0 4px;
    font-size: 10px;
    font-style: normal;
    font-weight: 500;
    line-height: 14px;
    color: #fff;
    text-align: center;
    background: var(--vl-danger);
    border: 1px solid #fff;
    border-radius: 10px;
    transform: translate(50%, -20%);

    &--dot {
      top: 0;
      right: 0;
      min-width: 8px;
      width: 8px;
      height: 8px;
      padding: 0;
      border-radius: 50%;
    }
  }
}

@keyframes vl-icon-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
