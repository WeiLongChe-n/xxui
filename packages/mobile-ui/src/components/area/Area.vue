<script setup lang="ts">
import { computed } from 'vue'
import VlPicker from '../picker/Picker.vue'
import type { PickerConfirmPayload, PickerValue } from '../picker/types'
import { areaData as builtinAreaData } from './area-data'
import { getAreaText } from './utils'
import type { AreaOption, AreaValue } from './types'

defineOptions({ name: 'VlArea' })

const props = withDefaults(
  defineProps<{
    /** 是否显示，支持 v-model:show */
    show?: boolean
    /** 省 / 市 / 区 的 value 数组，支持 v-model */
    modelValue?: AreaValue[]
    /** 地区数据，默认使用内置的全国数据 */
    data?: AreaOption[]
    title?: string
    cancelText?: string
    confirmText?: string
    loading?: boolean
    closeOnClickOverlay?: boolean
  }>(),
  {
    show: false,
    modelValue: () => [],
    data: () => builtinAreaData,
    title: '选择地区',
    cancelText: '取消',
    confirmText: '确认',
    loading: false,
    closeOnClickOverlay: true,
  },
)

const emit = defineEmits<{
  'update:show': [value: boolean]
  'update:modelValue': [values: PickerValue[]]
  change: [payload: PickerConfirmPayload & { selectedText: string }]
  confirm: [payload: PickerConfirmPayload & { selectedText: string }]
  cancel: []
}>()

/** 已选地区的可读文本，如「浙江省 杭州市 西湖区」 */
const selectedText = computed(() => getAreaText(props.modelValue, props.data))

const withText = (payload: PickerConfirmPayload) => ({
  ...payload,
  selectedText: payload.selectedOptions.map((option) => option.text).join(' '),
})

const onChange = (payload: PickerConfirmPayload) => emit('change', withText(payload))
const onConfirm = (payload: PickerConfirmPayload) => emit('confirm', withText(payload))
</script>

<template>
  <VlPicker
    :show="show"
    :columns="data"
    :model-value="modelValue"
    :title="title"
    :cancel-text="cancelText"
    :confirm-text="confirmText"
    :loading="loading"
    :close-on-click-overlay="closeOnClickOverlay"
    @update:show="(value: boolean) => emit('update:show', value)"
    @update:model-value="(values: PickerValue[]) => emit('update:modelValue', values)"
    @change="onChange"
    @confirm="onConfirm"
    @cancel="emit('cancel')"
  />
</template>
