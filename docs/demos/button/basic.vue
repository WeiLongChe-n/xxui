<template>
  <div class="demo-col">
    <div class="demo-row">
      <x-button type="primary">主要按钮</x-button>
      <x-button type="success">成功按钮</x-button>
      <x-button type="warning">警告按钮</x-button>
      <x-button type="danger">危险按钮</x-button>
      <x-button>默认按钮</x-button>
    </div>

    <div class="demo-row">
      <x-button type="primary" plain>主要按钮</x-button>
      <x-button type="success" plain>成功按钮</x-button>
      <x-button type="warning" plain>警告按钮</x-button>
      <x-button type="danger" plain>危险按钮</x-button>
      <x-button plain>默认按钮</x-button>
    </div>

    <div class="demo-row">
      <x-button type="primary" size="large">大号按钮</x-button>
    </div>

    <div class="demo-row">
      <x-button type="primary" size="small">小号按钮</x-button>
      <x-button type="primary" size="mini">迷你按钮</x-button>
      <x-button type="primary" round>圆角按钮</x-button>
      <x-button type="primary" square>直角按钮</x-button>
    </div>

    <div class="demo-row">
      <x-button type="primary" icon="plus">新建</x-button>
      <x-button icon="share" icon-position="right">分享</x-button>
      <x-button type="primary" loading loading-text="提交中" />
      <x-button disabled>禁用</x-button>
    </div>

    <div class="demo-row">
      <x-button type="primary" color="linear-gradient(135deg, #6a5cff, #3b82f6)">渐变按钮</x-button>
      <x-button type="primary" hairline plain>细边框</x-button>
    </div>
  </div>
</template>
