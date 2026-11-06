<template>
  <div class="demo-col">
    <div class="demo-row">
      <vl-button size="small" type="primary" @click="show = true">显示遮罩</vl-button>
      <vl-button size="small" @click="show = false">关闭遮罩</vl-button>
    </div>

    <div class="overlay-stage">
      <p>遮罩层固定定位在视口之上，用于强调浮层内容或阻断交互。</p>
    </div>

    <vl-overlay :show="show" :z-index="3000" @click="show = false" />

    <transition name="vl-fade">
      <div v-if="show" class="overlay-content">
        <p>点击遮罩关闭</p>
        <vl-button size="small" @click="show = false">知道了</vl-button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const show = ref(false)
</script>

<style scoped>
.demo-col {
  gap: 12px;
}

.overlay-stage {
  padding: 16px;
  font-size: 12px;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft);
  border-radius: 10px;
}

.overlay-stage p {
  margin: 0;
}

.overlay-content {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 3001;
  width: 220px;
  padding: 20px 24px;
  font-size: 13px;
  text-align: center;
  background: var(--vl-background-2);
  border-radius: 14px;
  transform: translate(-50%, -50%);
}

.overlay-content p {
  margin: 0 0 12px;
  color: var(--vl-text-color);
}
</style>
