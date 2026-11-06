# Picker 滚轮选择

底部弹出的滚轮选择器，支持单列、多列以及带 `children` 的级联列，常用于城市、日期、规格等场景。

## 基础用法

`v-model` 绑定的是**每一列选中值的数组**，`v-model:show` 控制弹层显隐，`confirm` 事件返回完整的选项对象。

<DemoBlock title="单列选择" description="滚动或点击选项，右下角确认后回填" :code="code" background="page">
  <PickerBasic />
</DemoBlock>

```vue
<vl-picker v-model:show="show" v-model="value" :columns="columns" title="选择城市" @confirm="onConfirm" />
```

## 多列

`columns` 传入二维数组即为多列，每一列各自独立滚动。下面的例子把年、月、日拆成三列。

<DemoBlock title="年月日" description="三列独立滚动，互不影响" :code="code2" background="page">
  <PickerMultipleColumns />
</DemoBlock>

## 级联列

当某个选项带有 `children` 时，选中它会自动在右侧生成下一列；若选中项没有子节点，则其后的列会被移除。

```ts
const columns = [
  {
    text: '浙江省',
    value: '330000',
    children: [
      { text: '杭州市', value: '330100', children: [{ text: '西湖区', value: '330106' }] },
    ],
  },
]
```

省市区三级联动的完整实现见 [Area 省市区](/components/area)。

## 使用提示

- `v-model` 的数组长度与当前列数保持一致，通过 `confirm` 回写最稳妥。
- 每次打开弹层都会按当前 `modelValue` 重新定位，不会保留上次的滚动位置。
- 选项较多时建议控制单列数量，滚轮适合 10~30 项的快速选择。

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| show | 是否显示，支持 `v-model:show` | `boolean` | `false` |
| columns | 选项数据，含 `children` 时为级联 | `PickerOption[]` | `[]` |
| modelValue | 每列选中的值，支持 `v-model` | `(string \| number)[]` | `[]` |
| title | 标题 | `string` | - |
| cancelText | 取消按钮文案 | `string` | `'取消'` |
| confirmText | 确认按钮文案 | `string` | `'确认'` |
| showToolbar | 是否显示顶部工具栏 | `boolean` | `true` |
| optionHeight | 单行高度（px） | `number` | `44` |
| visibleOptionNum | 可见行数 | `number` | `5` |
| closeOnClickOverlay | 点击遮罩是否关闭 | `boolean` | `true` |
| loading | 是否显示加载中 | `boolean` | `false` |

### Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:show | 显隐变化 | `value: boolean` |
| update:modelValue | 选中值变化 | `values: (string \| number)[]` |
| change | 滚动选中项变化 | `{ selectedValues, selectedOptions }` |
| confirm | 点击确认 | `{ selectedValues, selectedOptions }` |
| cancel | 点击取消 | - |

### 类型

```ts
interface PickerOption {
  text: string
  value: string | number
  children?: PickerOption[]
  disabled?: boolean
}
```

<script setup>
import PickerBasic from '@demos/picker/basic.vue'
import PickerMultipleColumns from '@demos/picker/multiple-columns.vue'
import code from '@demos/picker/basic.vue?raw'
import code2 from '@demos/picker/multiple-columns.vue?raw'
</script>
