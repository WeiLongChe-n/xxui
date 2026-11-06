# Row 栅格布局

24 栅格系统，用于把一行拆成任意比例的多列，支持间距、偏移、排序与对齐。与 [Grid 宫格](/components/grid) 的区别是：Grid 只能等分且带宫格样式，Row/Col 是纯布局容器，列宽比例自由。

## 基础用法

一行被划分为 24 份，`span` 表示一列占据的份数；同一行内 `span` 之和不超过 24 即可并排显示，超出会自动换行。

<DemoBlock title="24 栅格" description="span 24 / 12+12 / 8×3 / 6×4 的常见组合" :code="code">
  <RowBasic />
</DemoBlock>

```vue
<vl-row>
  <vl-col :span="12">左</vl-col>
  <vl-col :span="12">右</vl-col>
</vl-row>

<vl-row>
  <vl-col v-for="n in 3" :key="n" :span="8">{{ n }}</vl-col>
</vl-row>
```

## 列间距

`gutter` 同时作用于列的水平与垂直方向上的间距；传入数组 `[水平, 垂直]` 可以分别设置。间距通过列的内边距实现，不会破坏栅格比例。

<DemoBlock title="gutter" description="gutter=12 与 gutter=[16, 12] 的对比" :code="code2">
  <RowGutter />
</DemoBlock>

```vue
<vl-row :gutter="12">...</vl-row>
<vl-row :gutter="[16, 12]">...</vl-row>
```

## 偏移与排序

`offset` 让一列向右空出指定份数；`order` 只改变渲染顺序，不改变栅格占比；`width` 可以用任意百分比覆盖 `span`。

<DemoBlock title="offset / order / width" description="偏移、顺序与自定义宽度" :code="code3">
  <RowOffset />
</DemoBlock>

```vue
<vl-row>
  <vl-col :span="8">A</vl-col>
  <vl-col :span="8" :offset="8">B</vl-col>
</vl-row>

<vl-col :span="12" order="2" />
<vl-col width="40%" />
```

## 对齐

`justify` 控制主轴（水平）方向的剩余空间分配，`align` 控制交叉轴（垂直）方向。列自身还可以用 `align` 单独覆盖行级对齐。

<DemoBlock title="justify / align" description="居中、两端对齐、垂直居中与底部对齐" :code="code4">
  <RowAlign />
</DemoBlock>

## 嵌套

`vl-col` 内部可以继续放 `vl-row`，内层栅格同样以 24 份计算，用于卡片内部的二级分栏。

<DemoBlock title="嵌套栅格" description="16 + 8 分栏，左侧再拆成两个 12" :code="code5">
  <RowNest />
</DemoBlock>

## 使用提示

- 栅格是**百分比宽度**，行容器需要有明确宽度；放在没有宽度的 flex 子项里时记得给父级 `flex: 1` 或 `width`。
- 一行的 `span` 之和超过 24 时会按 `wrap` 自动换行，可以利用这一点做「N 列自动折行」。
- 需要等宽宫格（带图标、角标、描边）时用 [Grid](/components/grid) 更合适。

## API

### Row Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| gutter | 列间距，数组形式为 `[水平, 垂直]` | `number \| string \| [number \| string, number \| string]` | `0` |
| justify | 主轴对齐方式 | `'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between' \| 'space-evenly'` | `'start'` |
| align | 交叉轴对齐方式 | `'top' \| 'middle' \| 'bottom' \| 'stretch'` | `'top'` |
| wrap | 是否允许换行 | `boolean` | `true` |
| tag | 行渲染的标签名 | `string` | `'div'` |

### Col Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| span | 占据的栅格数，共 24 份 | `number` | `24` |
| offset | 向右偏移的栅格数 | `number` | `0` |
| order | 排序权重 | `number \| string` | - |
| width | 自定义宽度，设置后覆盖 `span` | `string \| number` | - |
| align | 自身在交叉轴上的对齐方式 | `'top' \| 'middle' \| 'bottom' \| 'stretch'` | - |
| tag | 列渲染的标签名 | `string` | `'div'` |

### 插槽

| 组件 | 插槽 | 说明 |
| --- | --- | --- |
| Row | default | 行内容，通常是若干 `vl-col` |
| Col | default | 列内容，可嵌套 `vl-row` |

<script setup>
import RowBasic from '@demos/row/basic.vue'
import RowGutter from '@demos/row/gutter.vue'
import RowOffset from '@demos/row/offset.vue'
import RowAlign from '@demos/row/align.vue'
import RowNest from '@demos/row/nest.vue'
import code from '@demos/row/basic.vue?raw'
import code2 from '@demos/row/gutter.vue?raw'
import code3 from '@demos/row/offset.vue?raw'
import code4 from '@demos/row/align.vue?raw'
import code5 from '@demos/row/nest.vue?raw'
</script>
