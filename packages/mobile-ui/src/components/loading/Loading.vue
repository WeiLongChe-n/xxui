<script setup lang="ts">
import { computed } from 'vue'
import { addUnit, createNamespace } from '../../utils'

defineOptions({ name: 'VlLoading' })

const props = defineProps<{
  /** circular 圆环 / spinner 旋转线条 / dots 跳点 */
  type?: 'circular' | 'spinner' | 'dots'
  size?: string | number
  color?: string
  text?: string
  textSize?: string | number
  /** 文字在加载图标下方 */
  vertical?: boolean
}>()

const { bem } = createNamespace('loading')

const style = computed(() => ({
  color: props.color,
  fontSize: addUnit(props.size),
  width: addUnit(props.size),
  height: addUnit(props.size),
}))

const textStyle = computed(() => (props.textSize ? { fontSize: addUnit(props.textSize) } : undefined))
</script>

<template>
  <div :class="[bem(), bem('', type || 'circular'), vertical && bem('', 'vertical')]">
    <span :class="bem('icon')" :style="style">
      <template v-if="(type || 'circular') === 'dots'">
        <i v-for="i in 3" :key="i" :class="bem('dot')" />
      </template>
      <svg v-else-if="type === 'spinner'" viewBox="0 0 24 24" :class="bem('svg')">
        <circle cx="12" cy="12" r="9" :class="bem('track')" />
        <path d="M12 3a9 9 0 0 1 9 9" :class="bem('arc')" />
      </svg>
      <i v-else :class="bem('circular')" />
    </span>
    <span v-if="text" :class="bem('text')" :style="textStyle">{{ text }}</span>
  </div>
</template>

<style lang="scss">
.vl-loading {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--vl-primary);
  font-size: 20px;

  &--vertical {
    flex-direction: column;
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1em;
    height: 1em;
    font-size: inherit;
  }

  &__circular {
    width: 1em;
    height: 1em;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: vl-rotate 0.8s linear infinite;
    box-sizing: border-box;
  }

  &__svg {
    width: 1em;
    height: 1em;
    animation: vl-rotate 1s linear infinite;
  }

  &__track {
    fill: none;
    stroke: currentColor;
    stroke-width: 2.4;
    opacity: 0.18;
  }

  &__arc {
    fill: none;
    stroke: currentColor;
    stroke-width: 2.4;
    stroke-linecap: round;
  }

  &__dot {
    width: 0.32em;
    height: 0.32em;
    margin: 0 0.12em;
    background: currentColor;
    border-radius: 50%;
    animation: vl-dot 1s ease-in-out infinite;

    &:nth-child(2) {
      animation-delay: 0.15s;
    }

    &:nth-child(3) {
      animation-delay: 0.3s;
    }
  }

  &__text {
    margin-left: 8px;
    font-size: var(--vl-font-size);
    color: var(--vl-text-color-2);
  }

  &--vertical &__text {
    margin: 8px 0 0;
  }
}

@keyframes vl-rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes vl-dot {
  0%,
  80%,
  100% {
    opacity: 0.35;
    transform: scale(0.7);
  }

  40% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
