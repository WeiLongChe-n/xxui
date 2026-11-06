# Grid 宫格

宫格用于在有限空间内平铺入口，常用于首页金刚区。

## 基础用法

<DemoBlock title="宫格布局" description="默认 4 列；支持自定列数、描边、间距、正方形与角标" :code="code" background="page">
  <GridBasic />
</DemoBlock>

## 列数

`columns` 控制每行个数，内部使用 CSS Grid 实现，因此最后一行不足时会自动留空，不会拉伸变形。

```vue
<x-grid :columns="3">
  <x-grid-item icon="coupon" text="优惠券" />
</x-grid>
```

## 描边与间距

`border` 会在格子之间绘制 1px 分割线（默认开启）；关闭后可用 `gap` 设置间距，此时格子之间会露出容器背景。

```vue
<x-grid :columns="4" :gap="10" :border="false" />
```

## 正方形与点击反馈

`square` 会强制每个格子为 1:1；`clickable` 会为所有子项开启按下反馈。

```vue
<x-grid square clickable @click="onClick">
  <x-grid-item icon="phone" text="话费充值" />
</x-grid>
```

## 角标

```vue
<x-grid-item icon="cart" text="购物车" :badge="12" />
<x-grid-item icon="gift" text="积分商城" dot />
```

## API

### Grid Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 每行个数 | `number` | `4` |
| gap | 格子间距 | `number \| string` | `0` |
| border | 是否显示格子描边 | `boolean` | `true` |
| square | 格子是否固定为正方形 | `boolean` | `false` |
| clickable | 子项是否开启点击反馈 | `boolean` | `false` |

### Grid Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击任意格子（冒泡） | `event: MouseEvent` |

### GridItem Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| text | 文字 | `string` | - |
| icon | 图标名称 | `string` | - |
| badge | 角标内容 | `string \| number` | - |
| dot | 是否显示红点 | `boolean` | `false` |

### GridItem Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击格子 | `event: MouseEvent` |

<script setup>
import GridBasic from '@demos/grid/basic.vue'
import code from '@demos/grid/basic.vue?raw'
</script>
