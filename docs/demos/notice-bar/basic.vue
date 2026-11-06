<template>
  <div class="demo-col">
    <vl-notice-bar text="本月会员日全场 8 折，满 199 减 30，活动截止至月底" />

    <vl-notice-bar
      text="这是一条可以选择换行展示的长通知，适合需要完整阅读的场景"
      wrapable
      mode="closeable"
    />

    <vl-notice-bar
      text="自定义颜色与图标"
      color="#8b4ef5"
      background="rgba(139,78,245,.12)"
      left-icon="gift"
      mode="link"
    />

    <vl-notice-bar text="不显示图标、不可操作" :show-icon="false" mode="none" />
  </div>
</template>

<style scoped>
.demo-col {
  gap: 12px;
}

.demo-col :deep(.vl-notice-bar) {
  border-radius: 8px;
}
</style>
