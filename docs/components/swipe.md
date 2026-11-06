# Swipe 轮播

轮播用于展示广告位或卡片流，支持自动播放、循环、手势拖拽与指示点。

## 基础用法

<DemoBlock title="轮播" description="第一组自动播放，第二组手动滑动并可通过实例方法控制" :code="code">
  <SwipeBasic />
</DemoBlock>

## 基本结构

```vue
<vl-swipe :autoplay="3000" height="160">
  <vl-swipe-item>第一屏</vl-swipe-item>
  <vl-swipe-item>第二屏</vl-swipe-item>
</vl-swipe>
```

- `height` 建议显式指定，避免内容高度不一致导致跳动；
- `autoplay` 为间隔毫秒数，传 `false` 关闭自动播放；
- `loop` 默认开启，最后一张之后回到第一张。

## 实例方法

```ts
const swipeRef = ref()

swipeRef.value.prev()      // 上一张
swipeRef.value.next()      // 下一张
swipeRef.value.swipeTo(2)  // 跳到索引 2
```

## 指示点

```vue
<vl-swipe indicator-color="#3b82f6" :show-indicators="false" />
```

## 手势

`touchable` 默认开启，支持左右拖拽与阈值判断（超过容器宽度的 1/4 才切换）。垂直方向的滑动会交还给页面滚动，因此不会影响页面上下滚动。

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| autoplay | 自动播放间隔（ms） | `number \| false` | `false` |
| loop | 是否循环 | `boolean` | `true` |
| duration | 切换动画时长（ms） | `number` | `500` |
| initialSwipe | 初始索引 | `number` | `0` |
| height | 高度 | `number \| string` | - |
| showIndicators | 是否显示指示点 | `boolean` | `true` |
| indicatorColor | 指示点颜色 | `string` | `#fff` |
| touchable | 是否允许手势 | `boolean` | `true` |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 切换完成 | `index: number` |

## Expose

| 方法 | 说明 |
| --- | --- |
| next / prev | 下一张 / 上一张 |
| swipeTo | 跳到指定索引 |

<script setup>
import SwipeBasic from '@demos/swipe/basic.vue'
import code from '@demos/swipe/basic.vue?raw'
</script>
