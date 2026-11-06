# Rate 评分

用于主观评价，支持半星、自定义数量与颜色，只读模式适合展示已有评分。

## 基础用法

<DemoBlock title="评分形态" description="支持半星、只读、自定义数量与颜色，也可直接放入表单" :code="code">
  <RateBasic />
</DemoBlock>

## 半星

开启 `allow-half` 后，点击星星左半边会得到 `x.5` 分（鼠标悬停时会预览）。

```vue
<x-rate v-model="score" allow-half />
```

## 只读

```vue
<x-rate :model-value="4.5" readonly :size="16" />
```

只读模式不会响应点击与悬停，通常用于商品详情页展示。

## 自定义

```vue
<x-rate v-model="score" :count="6" :size="26" color="#ef4444" />
```

`count` 为星星数量，`gutter` 为间距（px），`void-color` 为未选中的颜色。

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 当前分数 | `number` | `0` |
| count | 星星数量 | `number` | `5` |
| size | 星星尺寸 | `string \| number` | `20` |
| gutter | 星星间距 | `string \| number` | `4` |
| color | 选中颜色 | `string` | `#f59e0b` |
| voidColor | 未选中颜色 | `string` | `--x-text-color-4` |
| icon / voidIcon | 选中 / 未选中图标 | `string` | `star` |
| allowHalf | 是否允许半星 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |
| readonly | 是否只读 | `boolean` | `false` |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 分数变化 | `value: number` |
| change | 分数变化 | `value: number` |

<script setup>
import RateBasic from '@demos/rate/basic.vue'
import code from '@demos/rate/basic.vue?raw'
</script>
