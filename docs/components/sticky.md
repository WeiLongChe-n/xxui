# Sticky 粘性布局

粘性布局让元素在滚动到指定位置后固定，常用于吸顶导航、吸底操作栏。

## 基础用法

<DemoBlock title="容器内吸顶" description="在上方容器中滚动，标签栏会吸附在容器顶部" :code="code">
  <StickyBasic />
</DemoBlock>

## 基本用法

```vue
<x-sticky :offset-top="0">
  <div class="bar">吸顶内容</div>
</x-sticky>
```

- `offset-top`：距离视口（或容器）顶部的固定距离，常与导航栏高度配合，如 `:offset-top="46"`；
- `position="bottom"` 时改为吸底，配合 `offset-bottom` 使用。

## 限制在容器内

传入 `container` 后，吸顶元素不会超出容器范围，滚出容器时会被「推走」：

```vue
<div ref="host" class="scroll-container">
  <x-sticky :container="host" :offset-top="0">
    <div class="bar">容器内吸顶</div>
  </x-sticky>
  ...
</div>
```

## 事件

```vue
<x-sticky @change="(fixed) => console.log('是否固定', fixed)">
```

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| offsetTop | 吸顶距离 | `number \| string` | `0` |
| offsetBottom | 吸底距离 | `number \| string` | `0` |
| position | 吸附方向 | `top \| bottom` | `top` |
| zIndex | 层级 | `number` | `99` |
| container | 限定容器元素 | `HTMLElement` | - |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 固定状态变化 | `fixed: boolean` |

<script setup>
import StickyBasic from '@demos/sticky/basic.vue'
import code from '@demos/sticky/basic.vue?raw'
</script>
