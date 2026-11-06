<script setup lang="ts">
import { computed, getCurrentInstance, inject, onBeforeUnmount, onMounted, provide, ref } from 'vue'
import { addUnit, createNamespace } from '../../utils'
import { FORM_ITEM_KEY, FORM_KEY, type FormItemInstance } from './context'
import { getValueByPath, runRules, type FieldRule, type ValidateTrigger } from './types'

defineOptions({ name: 'XFormItem' })

const props = defineProps<{
  /** 字段名，与 Form 的 model / rules 对应 */
  name?: string
  label?: string
  /** 局部校验规则，优先于 Form 的 rules */
  rules?: FieldRule[]
  required?: boolean
  labelWidth?: string | number
  labelAlign?: 'left' | 'center' | 'right'
  starPosition?: 'left' | 'right'
  /** 手动指定的错误信息 */
  error?: string
  showError?: boolean
  /** 触发校验的时机 */
  validateTrigger?: ValidateTrigger
}>()

const form = inject(FORM_KEY, null)
const { bem } = createNamespace('form-item')
const uid = getCurrentInstance()!.uid

const innerError = ref('')

const rules = computed<FieldRule[]>(
  () => props.rules || (props.name && form?.rules?.[props.name]) || [],
)

const isRequired = computed(() => props.required ?? rules.value.some((rule) => rule.required))

const errorMessage = computed(() => props.error || innerError.value)

const shouldShowError = computed(() => (props.showError ?? form?.showError ?? true) && !!errorMessage.value)

const labelStyle = computed(() => {
  const width = props.labelWidth ?? form?.labelWidth
  return {
    width: addUnit(width),
    textAlign: props.labelAlign || form?.labelAlign || 'left',
  }
})

const starOnLeft = computed(() => (props.starPosition || form?.starPosition || 'left') === 'left')

const pickRules = (trigger: ValidateTrigger) => {
  if (trigger === 'submit') return rules.value
  return rules.value.filter((rule) => {
    if (!rule.trigger) return trigger === (props.validateTrigger || 'change')
    const triggers = Array.isArray(rule.trigger) ? rule.trigger : [rule.trigger]
    return triggers.includes(trigger)
  })
}

const validate = async (trigger: ValidateTrigger = 'submit') => {
  const applicable = pickRules(trigger)
  if (!applicable.length) {
    innerError.value = ''
    return
  }
  const value = getValueByPath(form?.model, props.name)
  const message = await runRules(value, applicable, props.label || props.name)
  innerError.value = message
  if (message) throw new Error(message)
}

const reset = () => {
  innerError.value = ''
}

const instance: FormItemInstance = {
  uid,
  get name() {
    return props.name
  },
  validate,
  reset,
  clearValidate: reset,
  hasError: () => !!innerError.value,
}

provide(FORM_ITEM_KEY, instance)

onMounted(() => form?.register(instance))
onBeforeUnmount(() => form?.unregister(uid))

defineExpose({ validate, reset })
</script>

<template>
  <div :class="[bem(), { [bem('', 'error')]: shouldShowError }]">
    <div
      v-if="label || $slots.label"
      :class="bem('label')"
      :style="labelStyle"
    >
      <slot name="label">
        <span v-if="starOnLeft && isRequired" :class="bem('star')">*</span>
        {{ label }}
      </slot>
    </div>
    <div :class="bem('body')">
      <slot />
      <div v-if="shouldShowError" :class="bem('error-message')">{{ errorMessage }}</div>
      <div v-else-if="$slots.help" :class="bem('help')">
        <slot name="help" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.x-form-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  padding: var(--x-cell-padding);
  background: var(--x-background-2);

  &::after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    content: '';
    background: var(--x-border-color);
    transform: scaleY(0.5);
    transform-origin: 0 100%;
  }

  &__label {
    flex: none;
    padding-right: 12px;
    font-size: var(--x-cell-font-size);
    line-height: 24px;
    color: var(--x-text-color);
  }

  &__star {
    margin-right: 2px;
    color: var(--x-danger);
  }

  &__body {
    flex: 1;
    min-width: 0;
  }

  &__error-message {
    margin-top: 4px;
    font-size: var(--x-font-size-sm);
    line-height: 18px;
    color: var(--x-danger);
  }

  &__help {
    margin-top: 4px;
    font-size: var(--x-font-size-sm);
    line-height: 18px;
    color: var(--x-text-color-3);
  }
}
</style>
