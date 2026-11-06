<script setup lang="ts">
import { computed, inject, nextTick, ref, watch } from 'vue'
import { addUnit, createNamespace } from '../../utils'
import { FORM_ITEM_KEY } from '../form/context'
import { FORM_KEY } from '../form/context'
import VlIcon from '../icon/Icon.vue'

defineOptions({ name: 'VlField' })

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    label?: string
    labelWidth?: string | number
    labelAlign?: 'left' | 'center' | 'right'
    /** 输入框类型 */
    type?: 'text' | 'password' | 'number' | 'digit' | 'tel' | 'textarea'
    size?: 'normal' | 'large'
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    /** 是否可清空 */
    clearable?: boolean
    /** always：始终显示清空按钮；focus：聚焦时显示 */
    clearTrigger?: 'focus' | 'always'
    maxlength?: number | string
    leftIcon?: string
    rightIcon?: string
    /** 右侧文字按钮 */
    rightText?: string
    /** 手动错误提示 */
    error?: string
    /** 是否展示下边框 */
    border?: boolean
    inputAlign?: 'left' | 'center' | 'right'
    autofocus?: boolean
    rows?: number | string
    /** 文本域自适应高度，可传最大高度 */
    autosize?: boolean | { maxHeight?: number | string }
    showWordLimit?: boolean
    required?: boolean
    name?: string
  }>(),
  {
    type: 'text',
    size: 'normal',
    clearTrigger: 'focus',
    border: true,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  input: [value: string]
  change: [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  clear: []
  'click-input': [event: MouseEvent]
  'click-right-icon': [event: MouseEvent]
  'click-right-text': []
  enter: [event: KeyboardEvent]
}>()

const { bem } = createNamespace('field')
const form = inject(FORM_KEY, null)
const formItem = inject(FORM_ITEM_KEY, null)

const inputRef = ref<HTMLInputElement>()
const textareaRef = ref<HTMLTextAreaElement>()
const focused = ref(false)

const isTextarea = computed(() => props.type === 'textarea')
const disabled = computed(() => props.disabled || !!form?.disabled)
const value = computed(() => (props.modelValue === undefined || props.modelValue === null ? '' : String(props.modelValue)))

const nativeType = computed(() => {
  if (props.type === 'password') return 'password'
  if (props.type === 'tel') return 'tel'
  return 'text'
})

const inputMode = computed(() => {
  if (props.type === 'number') return 'numeric'
  if (props.type === 'digit') return 'decimal'
  return undefined
})

const showClear = computed(
  () =>
    props.clearable &&
    !disabled.value &&
    !props.readonly &&
    !!value.value &&
    (props.clearTrigger === 'always' || focused.value),
)

const classes = computed(() => [
  bem(),
  props.size === 'large' ? bem('', 'large') : '',
  {
    [bem('', 'textarea')]: isTextarea.value,
    [bem('', 'error')]: !!(props.error || formItem?.hasError()),
    [bem('', 'disabled')]: disabled.value,
    [bem('', 'borderless')]: !props.border,
  },
])

const labelStyle = computed(() => ({
  width: addUnit(props.labelWidth ?? form?.labelWidth),
  textAlign: props.labelAlign || form?.labelAlign || 'left',
}))

const sanitize = (input: string) => {
  if (props.type === 'number') return input.replace(/\D/g, '')
  if (props.type === 'digit') {
    const cleaned = input.replace(/[^\d.]/g, '')
    const parts = cleaned.split('.')
    return parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : cleaned
  }
  if (props.maxlength !== undefined) return input.slice(0, Number(props.maxlength))
  return input
}

const resizeTextarea = () => {
  if (!isTextarea.value || !props.autosize) return
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  const maxHeight =
    typeof props.autosize === 'object' && props.autosize.maxHeight
      ? parseFloat(addUnit(props.autosize.maxHeight) || '0')
      : Infinity
  const height = Math.min(el.scrollHeight, maxHeight)
  el.style.height = `${height}px`
  el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden'
}

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const next = sanitize(target.value)
  if (next !== target.value) target.value = next
  emit('update:modelValue', next)
  emit('input', next)
  if (isTextarea.value) resizeTextarea()
  if (formItem) formItem.validate('change').catch(() => undefined)
}

const onFocus = (event: FocusEvent) => {
  focused.value = true
  emit('focus', event)
}

const onBlur = (event: FocusEvent) => {
  focused.value = false
  emit('blur', event)
  emit('change', value.value)
  if (formItem) formItem.validate('blur').catch(() => undefined)
}

const onClear = () => {
  emit('update:modelValue', '')
  emit('input', '')
  emit('clear')
  if (formItem) formItem.validate('change').catch(() => undefined)
  inputRef.value?.focus()
}

const onClickRightText = () => emit('click-right-text')

const focus = () => (isTextarea.value ? textareaRef.value : inputRef.value)?.focus()
const blur = () => (isTextarea.value ? textareaRef.value : inputRef.value)?.blur()

defineExpose({ focus, blur })

watch(
  () => props.modelValue,
  () => nextTick(resizeTextarea),
)

watch(
  () => props.autofocus,
  (value) => value && nextTick(focus),
)
</script>

<template>
  <div :class="classes" @click="emit('click-input', $event)">
    <div v-if="label" :class="bem('label')" :style="labelStyle">
      <span v-if="required" :class="bem('required')">*</span>
      {{ label }}
    </div>
    <div :class="bem('body')">
      <div :class="bem('control')">
        <slot name="left-icon">
          <VlIcon v-if="leftIcon" :name="leftIcon" :class="bem('left-icon')" />
        </slot>
        <textarea
          v-if="isTextarea"
          ref="textareaRef"
          :class="[bem('input'), bem('textarea')]"
          :value="value"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :maxlength="maxlength"
          :rows="rows || 2"
          :style="{ textAlign: inputAlign }"
          @input="onInput"
          @focus="onFocus"
          @blur="onBlur"
          @keyup.enter="emit('enter', $event)"
        />
        <input
          v-else
          ref="inputRef"
          :class="bem('input')"
          :value="value"
          :type="nativeType"
          :inputmode="inputMode"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :maxlength="maxlength"
          :style="{ textAlign: inputAlign }"
          @input="onInput"
          @focus="onFocus"
          @blur="onBlur"
          @keyup.enter="emit('enter', $event)"
        />
        <VlIcon
          v-if="showClear"
          name="clear"
          :class="bem('clear')"
          @click.stop="onClear"
        />
        <span v-if="rightText" :class="bem('right-text')" @click.stop="onClickRightText">
          {{ rightText }}
        </span>
        <slot name="right-icon">
          <VlIcon
            v-if="rightIcon"
            :name="rightIcon"
            :class="bem('right-icon')"
            @click="emit('click-right-icon', $event)"
          />
        </slot>
        <slot name="button" />
      </div>
      <div v-if="showWordLimit && maxlength" :class="bem('word-limit')">
        {{ value.length }}/{{ maxlength }}
      </div>
      <div v-if="error" :class="bem('error-message')">{{ error }}</div>
    </div>
  </div>
</template>

<style lang="scss">
@use '../../styles/mixins' as *;

.vl-field {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  background: var(--vl-background-2);

  @include hairline(bottom);

  &--borderless::after {
    display: none;
  }

  &--large {
    padding: 18px 16px;
  }

  &__label {
    flex: none;
    padding-right: 12px;
    font-size: var(--vl-cell-font-size);
    line-height: 24px;
    color: var(--vl-text-color);
  }

  &__required {
    margin-right: 2px;
    color: var(--vl-danger);
  }

  &__body {
    flex: 1;
    min-width: 0;
  }

  &__control {
    display: flex;
    align-items: center;
    min-height: 24px;
  }

  &__input {
    flex: 1;
    width: 100%;
    min-width: 0;
    padding: 0;
    font-size: var(--vl-cell-font-size);
    line-height: 24px;
    color: var(--vl-text-color);
    background: transparent;
    border: 0;
    outline: none;
    appearance: none;

    &::placeholder {
      color: var(--vl-text-color-4);
    }

    &:disabled {
      color: var(--vl-text-color-3);
      cursor: not-allowed;
      -webkit-text-fill-color: var(--vl-text-color-3);
    }
  }

  &__textarea {
    min-height: 48px;
    line-height: 22px;
    resize: none;
  }

  &__left-icon,
  &__right-icon {
    flex: none;
    font-size: 18px;
    color: var(--vl-text-color-3);
  }

  &__left-icon {
    margin-right: 8px;
  }

  &__right-icon {
    margin-left: 8px;
  }

  &__clear {
    flex: none;
    margin-left: 6px;
    font-size: 16px;
    color: var(--vl-text-color-4);
    cursor: pointer;
  }

  &__right-text {
    flex: none;
    margin-left: 8px;
    font-size: 13px;
    color: var(--vl-primary);
    cursor: pointer;
  }

  &__word-limit {
    margin-top: 4px;
    font-size: var(--vl-font-size-sm);
    color: var(--vl-text-color-3);
    text-align: right;
  }

  &__error-message {
    margin-top: 4px;
    font-size: var(--vl-font-size-sm);
    color: var(--vl-danger);
  }

  &--error &__input::placeholder {
    color: var(--vl-danger);
  }
}
</style>
