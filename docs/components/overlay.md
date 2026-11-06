# Overlay 遮罩层

遮罩层是一个全屏半透明背景，通常用于自定义浮层、引导页或沉浸式内容。

## 基础用法

<DemoBlock title="遮罩层" description="点击遮罩可以关闭，也可以用它包裹自定义内容" :code="code">
  <OverlayBasic />
</DemoBlock>

## 使用方式

```vue
<x-overlay :show="visible" :z-index="3000" @click="visible = false" />
```

遮罩自身不处理层级之外的逻辑，需要配合 `z-index` 与内容层级一起使用。`Popup`、`Dialog` 等组件内部已封装好这部分。

## 颜色与动画

遮罩背景色来自主题变量 `--x-overlay-bg`，深色模式下会自动加深：

```css
:root {
  --x-overlay-bg: rgba(0, 0, 0, 0.7);
}
```

`duration` 控制淡入淡出时长（秒）。

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| show | 是否显示 | `boolean` | `true` |
| zIndex | 层级 | `number` | - |
| duration | 动画时长（秒） | `number \| string` | `0.3` |
| overlayClass | 自定义类名 | `string` | - |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击遮罩 | `event: MouseEvent` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 覆盖在遮罩之上的内容 |

<script setup>
import OverlayBasic from '@demos/overlay/basic.vue'
import code from '@demos/overlay/basic.vue?raw'
</script>
