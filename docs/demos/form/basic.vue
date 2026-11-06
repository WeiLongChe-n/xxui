<template>
  <x-form ref="formRef" :model="form" :rules="rules" label-width="76" @submit="onSubmit">
    <x-cell-group inset title="收货信息">
      <x-form-item label="收货人" name="name">
        <x-field v-model="form.name" placeholder="请输入收货人姓名" />
      </x-form-item>

      <x-form-item label="手机号" name="phone">
        <x-field v-model="form.phone" type="tel" placeholder="请输入手机号" />
      </x-form-item>

      <x-form-item label="所在地区" name="region">
        <x-field v-model="form.region" placeholder="请选择省 / 市 / 区" readonly right-icon="arrow-right" />
      </x-form-item>

      <x-form-item label="详细地址" name="address">
        <x-field v-model="form.address" type="textarea" placeholder="街道、门牌号" autosize />
      </x-form-item>
    </x-cell-group>

    <x-cell-group inset title="其他">
      <x-form-item label="发票" name="invoice">
        <x-radio-group v-model="form.invoice">
          <x-radio name="none">不需要</x-radio>
          <x-radio name="personal">个人</x-radio>
          <x-radio name="company">企业</x-radio>
        </x-radio-group>
      </x-form-item>

      <x-form-item
        label=""
        name="agree"
        :rules="[{ validator: (value) => value === true || '请先同意服务协议' }]"
      >
        <x-checkbox v-model="form.agree">我已阅读并同意《服务协议》</x-checkbox>
      </x-form-item>
    </x-cell-group>

    <div class="form-actions">
      <x-button block @click="onReset">重置</x-button>
      <x-button type="primary" block native-type="submit">提交</x-button>
    </div>
  </x-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Toast, type FieldRule } from 'xxui-mobile'

const formRef = ref<{ validate: () => Promise<boolean>; resetFields: () => void }>()

const form = reactive({
  name: '',
  phone: '',
  region: '',
  address: '',
  invoice: 'none',
  agree: false,
})

const rules: Record<string, FieldRule[]> = {
  name: [
    { required: true, message: '请填写收货人姓名' },
    { min: 2, message: '姓名至少 2 个字' },
  ],
  phone: [
    { required: true, message: '请填写手机号' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
  ],
  region: [{ required: true, message: '请选择所在地区' }],
  address: [{ required: true, message: '请填写详细地址' }],
}

const onSubmit = async () => {
  try {
    await formRef.value?.validate()
    Toast.success('校验通过，已提交')
  } catch (error) {
    Toast.fail((error as Error).message)
  }
}

const onReset = () => {
  formRef.value?.resetFields()
  Toast('已清除校验状态')
}
</script>

<style scoped>
.form-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 16px;
}
</style>
