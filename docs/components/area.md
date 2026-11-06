# Area 省市区选择

基于 [Picker](/components/picker) 的三级联动地区选择器，内置全国 34 个省级行政区、3800+ 区县数据，适合收货地址、门店归属等场景。

## 基础用法

`v-model` 绑定省、市、区的行政区划代码数组。组件内置了数据，无需额外引入。

<DemoBlock title="三级联动" description="滚动选择省 / 市 / 区，确认后回填" :code="code" background="page">
  <AreaBasic />
</DemoBlock>

```vue
<x-area v-model:show="show" v-model="codes" title="选择地区" @confirm="onConfirm" />
```

## 回显已选地区

`getAreaText(codes, areaData)` 可以把代码数组转成可读文本，适合在单元格或表单中回显。

```ts
import { areaData, getAreaText } from 'xxui-mobile'

const text = getAreaText(['330000', '330100', '330106'], areaData)
// → 浙江省 杭州市 西湖区
```

## 自定义数据

如果只需要部分城市，或者数据来自后端，可以通过 `data` 传入同样结构的树：

```vue
<x-area :data="myRegionTree" v-model="codes" />
```

```ts
interface AreaOption {
  text: string
  value: string | number
  children?: AreaOption[]
  disabled?: boolean
}
```

## 数据说明

| 项目 | 说明 |
| --- | --- |
| 数据来源 | china-area-data v5（国家统计局行政区划） |
| 覆盖范围 | 34 个省级行政区 / 3806 个节点 |
| 体积 | 约 137 KB，gzip 后约 20 KB |
| 按需使用 | 通过 `import { areaData } from 'xxui-mobile'` 引用，未使用时会被 tree-shaking 移除 |

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| show | 是否显示，支持 `v-model:show` | `boolean` | `false` |
| modelValue | 省 / 市 / 区的 value 数组，支持 `v-model` | `(string \| number)[]` | `[]` |
| data | 地区数据 | `AreaOption[]` | 内置全国数据 |
| title | 标题 | `string` | `'选择地区'` |
| cancelText | 取消文案 | `string` | `'取消'` |
| confirmText | 确认文案 | `string` | `'确认'` |
| loading | 加载中状态 | `boolean` | `false` |
| closeOnClickOverlay | 点击遮罩关闭 | `boolean` | `true` |

### Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:show | 显隐变化 | `value: boolean` |
| update:modelValue | 选中值变化 | `values: (string \| number)[]` |
| change | 滚动变化 | `{ selectedValues, selectedOptions, selectedText }` |
| confirm | 确认选择 | `{ selectedValues, selectedOptions, selectedText }` |
| cancel | 取消 | - |

<script setup>
import AreaBasic from '@demos/area/basic.vue'
import code from '@demos/area/basic.vue?raw'
</script>
