<script setup lang="ts">
import { computed, provide, reactive } from 'vue'
import { createNamespace } from '../../utils'
import { FORM_KEY, type FormItemInstance } from './context'
import type { FieldRule } from './types'

defineOptions({ name: 'VlForm' })

const props = withDefaults(
  defineProps<{
    /** 表单数据对象 */
    model?: Record<string, any>
    /** 统一校验规则，key 为字段名 */
    rules?: Record<string, FieldRule[]>
    labelWidth?: string | number
    labelAlign?: 'left' | 'center' | 'right'
    starPosition?: 'left' | 'right'
    /** 是否在校验失败时展示错误信息 */
    showError?: boolean
    /** 是否禁用全部表单项 */
    disabled?: boolean
    /** 校验失败时是否滚动到第一个错误项 */
    scrollToError?: boolean
    /** 失去焦点时触发校验 */
    validateOnBlur?: boolean
  }>(),
  {
    labelAlign: 'left',
    starPosition: 'left',
    showError: true,
    disabled: false,
    scrollToError: true,
    validateOnBlur: true,
  },
)

const emit = defineEmits<{ submit: [values?: Record<string, any>]; failed: [errors: string[]] }>()

const { bem } = createNamespace('form')

const items = reactive<FormItemInstance[]>([])

const register = (item: FormItemInstance) => {
  items.push(item)
}

const unregister = (uid: number) => {
  const index = items.findIndex((item) => item.uid === uid)
  if (index > -1) items.splice(index, 1)
}

provide(FORM_KEY, {
  get model() {
    return props.model
  },
  get rules() {
    return props.rules
  },
  get labelWidth() {
    return props.labelWidth
  },
  get labelAlign() {
    return props.labelAlign
  },
  get starPosition() {
    return props.starPosition
  },
  get showError() {
    return props.showError
  },
  get disabled() {
    return props.disabled
  },
  register,
  unregister,
})

const scrollToError = () => {
  if (!props.scrollToError || typeof document === 'undefined') return
  requestAnimationFrame(() => {
    const el = document.querySelector('.vl-field--error')
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
}

/** 校验全部表单项 */
const validate = async (): Promise<boolean> => {
  const results = await Promise.allSettled(items.map((item) => item.validate('submit')))
  const errors = results
    .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
    .map((result) => (result.reason instanceof Error ? result.reason.message : String(result.reason)))

  if (errors.length) {
    emit('failed', errors)
    scrollToError()
    throw new Error(errors[0])
  }
  return true
}

/** 校验单个字段 */
const validateField = async (name: string) => {
  const item = items.find((it) => it.name === name)
  if (!item) return true
  await item.validate('submit')
  return true
}

const resetFields = () => items.forEach((item) => item.reset())
const clearValidate = () => items.forEach((item) => item.clearValidate())

defineExpose({ validate, validateField, resetFields, clearValidate })

const onSubmit = (event: Event) => {
  event.preventDefault()
  emit('submit', props.model)
}
</script>

<template>
  <form :class="bem()" @submit="onSubmit">
    <slot />
  </form>
</template>

<style lang="scss">
.vl-form {
  &--disabled {
    opacity: 0.6;
  }
}
</style>
