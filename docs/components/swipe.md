# Swipe 轮播

轮播用于展示广告位或卡片流，支持自动播放、循环、手势拖拽与指示点。

## 基础用法

<DemoBlock title="轮播" description="第一组自动播放，第二组手动滑动并可通过实例方法控制" :code="code">
  <SwipeBasic />
</DemoBlock>

## 基本结构

```vue
<x-swipe :autoplay="3000" height="160">
  <x-swipe-item>第一屏</x-swipe-item>
  <x-swipe-item>第二屏</x-swipe-item>
</x-swipe>
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

默认是底部居中的小圆点，当前项拉长。

<DemoBlock
  title="自定义指示点"
  description="上：用 indicator 插槽换成可点击的胶囊页码；下：只调颜色与 CSS 变量"
  :code="indicatorCode"
>
  <SwipeIndicator />
</DemoBlock>

只改颜色：

```vue
<x-swipe indicator-color="#3b82f6" indicator-active-color="#ffffff" />
```

也可以用 CSS 变量调尺寸、间距、圆角，不影响其它组件：

```vue
<x-swipe style="--x-swipe-indicator-size: 6px; --x-swipe-indicator-gap: 6px; --x-swipe-indicator-radius: 2px" />
```

| CSS 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--x-swipe-indicator-size` | 圆点尺寸 | `5px` |
| `--x-swipe-indicator-active-width` | 当前项宽度 | `14px` |
| `--x-swipe-indicator-gap` | 圆点间距 | `4px` |
| `--x-swipe-indicator-radius` | 圆角 | `999px` |

要完全自定义（数字页码、缩略图、条形进度等）时用 `indicator` 插槽，它替换整块指示器区域：

```vue
<x-swipe>
  <x-swipe-item>...</x-swipe-item>
  <template #indicator="{ active, total, to }">
    <div class="my-dots">
      <span
        v-for="i in total"
        :key="i"
        :class="{ on: i - 1 === active }"
        @click="to(i - 1)"
      />
    </div>
  </template>
</x-swipe>
```

插槽参数：`active`（当前索引）、`total`（总数）、`to(index)`（跳转方法）。

不想要指示点时直接 `:show-indicators="false"`。

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
| indicatorActiveColor | 当前指示点颜色，不传则与 `indicatorColor` 相同（仅靠不透明度区分） | `string` | - |
| touchable | 是否允许手势 | `boolean` | `true` |

## Slots

| 名称 | 说明 | 插槽参数 |
| --- | --- | --- |
| default | 轮播内容（`x-swipe-item`） | - |
| indicator | 完全自定义指示器 | `active`、`total`、`to(index)` |

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
import SwipeIndicator from '@demos/swipe/indicator.vue'
import indicatorCode from '@demos/swipe/indicator.vue?raw'
</script>
