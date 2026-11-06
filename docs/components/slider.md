# Slider 滑块

滑块用于在连续或离散区间内选择数值，支持自定义步长、颜色、尺寸与禁用状态。

## 基础用法

<DemoBlock title="滑块形态" description="支持拖拽与点击轨道定位，松手时触发 change" :code="code">
  <SliderBasic />
</DemoBlock>

## 范围与步长

```vue
<vl-slider v-model="value" :min="100" :max="1000" :step="100" />
```

数值会按 `step` 就近取整，并自动 clamp 到 `[min, max]`。

## 样式

```vue
<vl-slider v-model="value" :bar-height="8" :button-size="28" active-color="#8b4ef5" />
```

## 事件时机

- `update:modelValue`：拖拽过程中持续触发，适合实时联动（如显示当前价格）；
- `change`：仅在松手或点击轨道时触发，适合发起请求；
- `dragStart` / `dragEnd`：手势开始与结束。

```vue
<vl-slider v-model="price" @change="fetchList" @drag-end="onEnd" />
```

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 当前值 | `number` | `0` |
| min | 最小值 | `number` | `0` |
| max | 最大值 | `number` | `100` |
| step | 步长 | `number` | `1` |
| disabled | 是否禁用 | `boolean` | `false` |
| barHeight | 轨道高度 | `string \| number` | `4` |
| buttonSize | 滑块尺寸 | `string \| number` | `22` |
| activeColor | 已选中颜色 | `string` | `--vl-primary` |
| inactiveColor | 轨道颜色 | `string` | `--vl-background-3` |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 值变化（拖拽中持续触发） | `value: number` |
| change | 拖拽结束或点击轨道 | `value: number` |
| dragStart / dragEnd | 手势开始 / 结束 | - |

<script setup>
import SliderBasic from '@demos/slider/basic.vue'
import code from '@demos/slider/basic.vue?raw'
</script>
