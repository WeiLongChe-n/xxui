<template>
  <div class="demo-col">
    <div class="steps-host">
      <x-steps :active="active">
        <x-step title="已提交" description="11-05 10:20" />
        <x-step title="运输中" description="预计明日送达" />
        <x-step title="已完成" description="等待签收" />
      </x-steps>
      <div class="steps-actions">
        <x-button size="mini" @click="active = Math.max(active - 1, 0)">上一步</x-button>
        <x-button size="mini" type="primary" @click="active = Math.min(active + 1, 2)">下一步</x-button>
      </div>
    </div>

    <div class="steps-host">
      <x-steps direction="vertical" :active="1">
        <x-step title="提交申请" description="2026-11-05 09:12" />
        <x-step title="审核中" description="预计 1 个工作日内完成" />
        <x-step title="审核通过" description="待补充材料" />
        <x-step title="完成" />
      </x-steps>
    </div>

    <div class="steps-host">
      <x-steps :active="2" finish-icon="success" active-icon="clock">
        <x-step title="下单" />
        <x-step title="支付" />
        <x-step title="发货" />
        <x-step title="收货" />
      </x-steps>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const active = ref(1)
</script>

<style scoped>
.demo-col {
  gap: 18px;
}

.steps-host {
  overflow: hidden;
  background: var(--x-background-2);
  border: 1px solid var(--x-border-color);
  border-radius: 12px;
}

.steps-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
  padding: 0 12px 14px;
}
</style>
