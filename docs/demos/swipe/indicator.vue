<template>
  <div class="demo-col">
    <!-- 插槽：整块指示器换成可点击的胶囊页码 -->
    <x-swipe :autoplay="false" height="120">
      <x-swipe-item v-for="(item, i) in slides" :key="i">
        <div class="slide" :style="{ background: item.background }">
          <p class="slide__title">{{ item.title }}</p>
        </div>
      </x-swipe-item>

      <template #indicator="{ active, total, to }">
        <div class="pager">
          <button
            v-for="i in total"
            :key="i"
            type="button"
            class="pager__dot"
            :class="{ 'is-on': i - 1 === active }"
            :aria-label="`第 ${i} 张`"
            @click="to(i - 1)"
          />
        </div>
      </template>
    </x-swipe>

    <!-- 只改颜色与尺寸：不写一行样式也能换一套观感 -->
    <x-swipe
      :autoplay="false"
      height="100"
      indicator-color="rgba(255, 255, 255, 0.35)"
      indicator-active-color="#ffffff"
      style="
        --x-swipe-indicator-size: 6px;
        --x-swipe-indicator-active-width: 24px;
        --x-swipe-indicator-radius: 3px;
        --x-swipe-indicator-gap: 6px;
      "
    >
      <x-swipe-item v-for="(item, i) in slides" :key="i">
        <div class="slide" :style="{ background: item.background }">
          <p class="slide__title">{{ item.title }}</p>
        </div>
      </x-swipe-item>
    </x-swipe>
  </div>
</template>

<script setup lang="ts">
const slides = [
  { title: '插槽自定义', background: 'linear-gradient(135deg, #6366f1, #a855f7)' },
  { title: '颜色可覆盖', background: 'linear-gradient(135deg, #0ea5e9, #22d3ee)' },
  { title: '尺寸可调', background: 'linear-gradient(135deg, #10b981, #84cc16)' },
]
</script>

<style scoped>
.slide {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.slide__title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
}

.pager {
  display: flex;
  gap: 6px;
  align-items: center;
}

.pager__dot {
  width: 8px;
  height: 8px;
  padding: 0;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.4);
  border: 0;
  border-radius: 999px;
  transition: width 0.2s, background 0.2s;
}

.pager__dot.is-on {
  width: 20px;
  background: #fff;
}
</style>
