# Steps 步骤条

步骤条展示任务进度，支持水平与垂直两种方向，可自定义图标与状态。

## 基础用法

<DemoBlock title="步骤条" description="水平、垂直排列，以及自定义完成/进行中的图标" :code="code">
  <StepsBasic />
</DemoBlock>

## 基本结构

```vue
<x-steps :active="1">
  <x-step title="已提交" description="11-05 10:20" />
  <x-step title="运输中" description="预计明日送达" />
  <x-step title="已完成" />
</x-steps>
```

`active` 是当前进行中的步骤索引（从 0 开始）：

- 索引小于 `active` 的步骤为「已完成」；
- 等于 `active` 的为「进行中」；
- 大于的为「未开始」。

## 垂直排列

```vue
<x-steps direction="vertical" :active="1">...</x-steps>
```

垂直模式适合物流信息、审批流程这类内容较多的场景。

## 自定义图标

```vue
<x-steps :active="2" finish-icon="success" active-icon="clock">...</x-steps>
```

也可以在单个步骤上用 `icon` 指定图标，或用 `#icon` 插槽完全自定义（此时不再显示序号）。

## 手动状态

```vue
<x-step title="审核失败" status="error" description="资料不完整" />
```

`status` 可覆盖自动推导的状态，取值为 `wait` / `process` / `finish` / `error`。

## API

### Steps Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| active | 当前步骤索引 | `number` | `0` |
| direction | 排列方向 | `horizontal \| vertical` | `horizontal` |
| activeColor | 激活颜色 | `string` | `--x-primary` |
| finishIcon | 已完成图标 | `string` | `check` |
| activeIcon | 进行中图标 | `string` | 序号 |
| inactiveIcon | 未开始图标 | `string` | 序号 |

### Step Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题 | `string` | - |
| description | 描述 | `string` | - |
| icon | 自定义图标 | `string` | - |
| status | 手动指定状态 | `wait \| process \| finish \| error` | 自动推导 |

### Step Slots

| 名称 | 说明 |
| --- | --- |
| title | 自定义标题 |
| description | 自定义描述 |
| icon | 自定义步骤图标 |

<script setup>
import StepsBasic from '@demos/steps/basic.vue'
import code from '@demos/steps/basic.vue?raw'
</script>
