# Cascader 级联选择

面板式级联选择器，左侧一级、右侧一级逐层展开，支持单选与多选。与 [Picker](/components/picker) 的滚轮交互不同，Cascader 更适合层级多、需要同时看到上下级的场景。

## 单选

单选时 `v-model` 绑定完整路径的 value 数组，点击叶子节点触发 `finish`。下面直接使用内置的省市区数据。

<DemoBlock title="省市区级联" description="点击逐级展开，选到区县即完成" :code="code">
  <CascaderBasic />
</DemoBlock>

```vue
<x-cascader v-model="value" :options="options" title="选择地区" @finish="onFinish" />
```

## 多选

设置 `multiple` 后每一行出现复选框：

- 勾选父节点会把整棵子树标记为选中（`v-model` 中只保留父节点路径）
- 只选中部分子节点时，父节点显示为半选状态
- `max` 可以限制最多选择的叶子数量

`v-model` 在多选时为**二维数组**，每一项都是一条完整路径，方便直接提交后端。

<DemoBlock title="多选级联" description="父子联动、半选态与确定按钮" :code="code2">
  <CascaderMultiple />
</DemoBlock>

## 使用提示

- 面板固定展示「当前层 + 上一层」两列，既能看到上下文，又不会因为层级过深而挤压列宽。
- 顶部面包屑展示当前路径，点击任意一级可以快速回退重新选择。
- 数据量较大时，未展开的分支不会渲染，滚动性能更好。
- 需要弹层时，把它放进 [Popup](/components/popup) 即可。

```vue
<x-popup v-model:show="show" position="bottom" round>
  <x-cascader :options="options" multiple @finish="onFinish" />
</x-popup>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| options | 级联数据 | `PickerOption[]` | `[]` |
| modelValue | 单选为路径数组，多选为路径数组的数组，支持 `v-model` | `(string \| number)[] \| (string \| number)[][]` | `[]` |
| multiple | 是否多选 | `boolean` | `false` |
| title | 标题 | `string` | - |
| closeable | 是否显示关闭按钮 | `boolean` | `true` |
| max | 多选时最多选中的叶子数量 | `number` | - |
| emptyText | 空数据文案 | `string` | `'暂无数据'` |

### Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 选中值变化 | `value` |
| change | 选中节点变化 | `(value, node)` |
| finish | 单选选中叶子 / 多选点击确定 | `value` |
| close | 点击关闭按钮 | - |

<script setup>
import CascaderBasic from '@demos/cascader/basic.vue'
import CascaderMultiple from '@demos/cascader/multiple.vue'
import code from '@demos/cascader/basic.vue?raw'
import code2 from '@demos/cascader/multiple.vue?raw'
</script>
