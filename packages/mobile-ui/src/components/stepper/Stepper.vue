<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { addUnit, clamp, createNamespace } from '../../utils'

defineOptions({ name: 'VlStepper' })

const props = withDefaults(
  defineProps<{
    modelValue?: number
    min?: number
    max?: number
    step?: number
    integer?: boolean
    disabled?: boolean
    inputWidth?: string | number
    buttonSize?: string | number
    /** 小数位数，设置后自动四舍五入 */
    decimalLength?: number
    disableInput?: boolean
    disablePlus?: boolean
    disableMinus?: boolean
    /** 值变化前的拦截，返回 false 阻止 */
    beforeChange?: (value: number) => boolean | Promise<boolean>
  }>(),
  { min: 1, max: Infinity, step: 1, inputWidth: 32, buttonSize: 28 },
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
  change: [value: number, detail: 'plus' | 'minus' | 'input']
  overlimit: [type: 'plus' | 'minus']
  plus: []
  minus: []
}>()

const { bem } = createNamespace('stepper')

const format = (value: number) => {
  let next = clamp(value, props.min, props.max)
  if (props.integer) next = Math.round(next)
  if (props.decimalLength !== undefined) {
    next = Number(next.toFixed(props.decimalLength))
  }
  return next
}

const current = computed(() => format(Number(props.modelValue ?? props.min)))

const inputValue = ref(String(current.value))
watch(current, (value) => {
  inputValue.value = String(value)
})

const isMinusDisabled = computed(
  () => props.disabled || props.disableMinus || current.value <= props.min,
)
const isPlusDisabled = computed(
  () => props.disabled || props.disablePlus || current.value >= props.max,
)

const update = async (value: number, detail: 'plus' | 'minus' | 'input') => {
  const next = format(value)
  if (next === current.value) {
    inputValue.value = String(current.value)
    return
  }
  if (props.beforeChange) {
    const allow = await props.beforeChange(next)
    if (!allow) {
      inputValue.value = String(current.value)
      return
    }
  }
  emit('update:modelValue', next)
  emit('change', next, detail)
  inputValue.value = String(next)
}

const onMinus = () => {
  if (isMinusDisabled.value) {
    emit('overlimit', 'minus')
    return
  }
  emit('minus')
  update(current.value - props.step, 'minus')
}

const onPlus = () => {
  if (isPlusDisabled.value) {
    emit('overlimit', 'plus')
    return
  }
  emit('plus')
  update(current.value + props.step, 'plus')
}

const onInput = (event: Event) => {
  inputValue.value = (event.target as HTMLInputElement).value
}

const onBlur = () => {
  const parsed = Number(inputValue.value)
  if (Number.isNaN(parsed) || inputValue.value === '') {
    inputValue.value = String(current.value)
    return
  }
  update(parsed, 'input')
}
</script>

<template>
  <div :class="[bem(), { [bem('', 'disabled')]: disabled }]">
    <button
      type="button"
      :class="[bem('btn'), bem('btn', 'minus')]"
      :disabled="isMinusDisabled"
      :style="{ width: addUnit(buttonSize), height: addUnit(buttonSize) }"
      @click="onMinus"
    >
      <span :class="bem('symbol')">−</span>
    </button>
    <input
      v-if="!disableInput"
      :class="bem('input')"
      :value="inputValue"
      :style="{ width: addUnit(inputWidth) }"
      :disabled="disabled"
      inputmode="decimal"
      @input="onInput"
      @blur="onBlur"
    />
    <span v-else :class="bem('value')">{{ current }}</span>
    <button
      type="button"
      :class="[bem('btn'), bem('btn', 'plus')]"
      :disabled="isPlusDisabled"
      :style="{ width: addUnit(buttonSize), height: addUnit(buttonSize) }"
      @click="onPlus"
    >
      <span :class="bem('symbol')">+</span>
    </button>
  </div>
</template>

<style lang="scss">
@use '../../styles/mixins' as *;

.vl-stepper {
  display: inline-flex;
  align-items: center;
  overflow: hidden;
  background: var(--vl-background-3);
  border-radius: var(--vl-radius);

  &__btn {
    @include reset-button;

    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--vl-text-color);
    cursor: pointer;
    background: var(--vl-background-3);
    transition: background var(--vl-duration-fast);

    &:active:not(:disabled) {
      background: var(--vl-border-color);
    }

    &:disabled {
      color: var(--vl-text-color-4);
      cursor: not-allowed;
    }
  }

  &__symbol {
    font-size: 17px;
    line-height: 1;
  }

  &__input {
    width: 32px;
    height: 100%;
    padding: 0 2px;
    font-size: var(--vl-font-size);
    font-weight: 500;
    line-height: 28px;
    color: var(--vl-text-color);
    text-align: center;
    background: transparent;
    border: 0;
    border-right: 1px solid var(--vl-border-color);
    border-left: 1px solid var(--vl-border-color);
    outline: none;
  }

  &__value {
    min-width: 32px;
    padding: 0 6px;
    font-size: var(--vl-font-size);
    font-weight: 500;
    text-align: center;
  }

  &--disabled {
    opacity: 0.6;
  }
}
</style>
