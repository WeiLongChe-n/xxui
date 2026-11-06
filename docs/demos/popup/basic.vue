<template>
  <div class="demo-col">
    <div class="demo-row">
      <x-button size="small" type="primary" @click="open('bottom')">底部弹出</x-button>
      <x-button size="small" @click="open('top')">顶部弹出</x-button>
      <x-button size="small" @click="open('left')">左侧弹出</x-button>
      <x-button size="small" @click="open('right')">右侧弹出</x-button>
      <x-button size="small" @click="open('center')">居中弹出</x-button>
    </div>

    <x-popup v-model:show="visible" :position="position" round closeable :style="panelStyle">
      <div class="panel">
        <p class="panel__title">{{ position }} 弹出层</p>
        <p class="panel__text">
          弹出层自带遮罩、滚动锁定与过渡动效，可通过 position 控制出现方向，round 控制圆角。
        </p>
        <x-button type="primary" block @click="visible = false">关闭</x-button>
      </div>
    </x-popup>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type Position = 'bottom' | 'top' | 'left' | 'right' | 'center'

const visible = ref(false)
const position = ref<Position>('bottom')

const panelStyle = computed(() => {
  if (position.value === 'left' || position.value === 'right') return { width: '76%' }
  if (position.value === 'center') return { width: '80%' }
  return undefined
})

const open = (value: Position) => {
  position.value = value
  visible.value = true
}
</script>

<style scoped>
.demo-col {
  gap: 12px;
}

.panel {
  padding: 28px 20px 20px;
}

.panel__title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--x-text-color);
  text-transform: capitalize;
}

.panel__text {
  margin: 0 0 20px;
  font-size: 13px;
  line-height: 1.7;
  color: var(--x-text-color-2);
}
</style>
