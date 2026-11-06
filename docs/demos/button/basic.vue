<template>
  <div class="demo-col">
    <div class="demo-row">
      <vl-button type="primary">主要按钮</vl-button>
      <vl-button type="success">成功按钮</vl-button>
      <vl-button type="warning">警告按钮</vl-button>
      <vl-button type="danger">危险按钮</vl-button>
      <vl-button>默认按钮</vl-button>
    </div>

    <div class="demo-row">
      <vl-button type="primary" plain>主要按钮</vl-button>
      <vl-button type="success" plain>成功按钮</vl-button>
      <vl-button type="warning" plain>警告按钮</vl-button>
      <vl-button type="danger" plain>危险按钮</vl-button>
      <vl-button plain>默认按钮</vl-button>
    </div>

    <div class="demo-row">
      <vl-button type="primary" size="large">大号按钮</vl-button>
    </div>

    <div class="demo-row">
      <vl-button type="primary" size="small">小号按钮</vl-button>
      <vl-button type="primary" size="mini">迷你按钮</vl-button>
      <vl-button type="primary" round>圆角按钮</vl-button>
      <vl-button type="primary" square>直角按钮</vl-button>
    </div>

    <div class="demo-row">
      <vl-button type="primary" icon="plus">新建</vl-button>
      <vl-button icon="share" icon-position="right">分享</vl-button>
      <vl-button type="primary" loading loading-text="提交中" />
      <vl-button disabled>禁用</vl-button>
    </div>

    <div class="demo-row">
      <vl-button type="primary" color="linear-gradient(135deg, #6a5cff, #3b82f6)">渐变按钮</vl-button>
      <vl-button type="primary" hairline plain>细边框</vl-button>
    </div>
  </div>
</template>
