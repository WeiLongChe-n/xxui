<script setup lang="ts">
import { computed } from 'vue'
import { createNamespace } from '../../utils'
import XIcon from '../icon/Icon.vue'

defineOptions({ name: 'XNavBar' })

const props = withDefaults(
  defineProps<{
    title?: string
    leftText?: string
    rightText?: string
    /** 左侧返回箭头 */
    leftArrow?: boolean
    /** 固定在顶部 */
    fixed?: boolean
    /** 固定时生成占位元素 */
    placeholder?: boolean
    /** 适配顶部安全区 */
    safeAreaInsetTop?: boolean
    border?: boolean
    zIndex?: number
    leftDisabled?: boolean
    rightDisabled?: boolean
  }>(),
  { leftArrow: true, border: true, zIndex: 100 },
)

const emit = defineEmits<{ 'click-left': []; 'click-right': [] }>()

const { bem } = createNamespace('nav-bar')

const classes = computed(() => [
  bem(),
  {
    [bem('', 'fixed')]: props.fixed,
    [bem('', 'borderless')]: !props.border,
  },
])

const style = computed(() => ({ zIndex: props.zIndex }))
</script>

<template>
  <div
    v-if="fixed && placeholder"
    :class="[bem('placeholder'), safeAreaInsetTop && bem('placeholder', 'safe-top')]"
  />
  <div :class="classes" :style="style">
    <div :class="[bem('inner'), safeAreaInsetTop && bem('inner', 'safe-top')]">
      <div :class="bem('left')" @click="!leftDisabled && emit('click-left')">
        <slot name="left">
          <XIcon v-if="leftArrow" name="arrow-left" :class="bem('arrow')" />
          <span v-if="leftText" :class="bem('text')">{{ leftText }}</span>
        </slot>
      </div>
      <div :class="bem('title')">
        <slot name="title">{{ title }}</slot>
      </div>
      <div :class="bem('right')" @click="!rightDisabled && emit('click-right')">
        <slot name="right">{{ rightText }}</slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use '../../styles/mixins' as *;

.x-nav-bar {
  position: relative;
  width: 100%;
  background: var(--x-background-2);

  @include hairline(bottom);

  &--borderless::after {
    display: none;
  }

  &--fixed {
    position: fixed;
    top: 0;
    left: 0;
  }

  &__placeholder {
    height: var(--x-navbar-height);

    &--safe-top {
      height: calc(var(--x-navbar-height) + var(--x-safe-top));
    }
  }

  &__inner {
    display: flex;
    align-items: center;
    height: var(--x-navbar-height);
    padding: 0 12px;

    &--safe-top {
      height: calc(var(--x-navbar-height) + var(--x-safe-top));
      padding-top: var(--x-safe-top);
    }
  }

  &__left,
  &__right {
    display: flex;
    align-items: center;
    min-width: 60px;
    font-size: 14px;
    color: var(--x-primary);
    cursor: pointer;
  }

  &__right {
    justify-content: flex-end;
  }

  &__arrow {
    margin-right: 2px;
    font-size: 18px;
  }

  &__title {
    flex: 1;
    overflow: hidden;
    font-size: 17px;
    font-weight: 600;
    color: var(--x-text-color);
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
