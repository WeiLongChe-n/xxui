# Collapse 折叠面板

折叠面板用于收纳次要内容，支持手风琴模式与禁用项。

## 基础用法

<DemoBlock title="折叠面板" description="多个面板可同时展开；手风琴模式下只保留一个展开项" :code="code">
  <CollapseBasic />
</DemoBlock>

## 基本结构

```vue
<vl-collapse v-model="active">
  <vl-collapse-item name="1" title="标题一">内容一</vl-collapse-item>
  <vl-collapse-item name="2" title="标题二">内容二</vl-collapse-item>
</vl-collapse>
```

`v-model` 为展开项 `name` 的数组。

## 手风琴模式

开启 `accordion` 后 `v-model` 变为单个值（字符串或数字），再次点击当前项会收起。

```vue
<vl-collapse v-model="active" accordion>
  <vl-collapse-item name="a" title="标题 A">内容 A</vl-collapse-item>
</vl-collapse>
```

## 右侧内容

```vue
<vl-collapse-item name="a" title="订单管理" value="12 条" />
```

## API

### Collapse Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 展开项 | `string \| number \| array` | `[]` |
| accordion | 是否手风琴模式 | `boolean` | `false` |
| border | 是否显示分割线 | `boolean` | `true` |

### Collapse Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 展开项变化 | 展开项 |
| change | 同上 | 展开项 |

### CollapseItem Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 标识 | `string \| number` | - |
| title | 标题 | `string` | - |
| value | 右侧内容 | `string` | - |
| icon | 标题左侧图标 | `string` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| isLink | 是否显示右侧箭头 | `boolean` | `true` |
| border | 是否显示分割线 | `boolean` | `true` |

### CollapseItem Events

| 事件 | 说明 |
| --- | --- |
| open / close | 展开 / 收起 |
| click | 点击标题 |

### CollapseItem Slots

| 名称 | 说明 |
| --- | --- |
| default | 面板内容 |
| title | 自定义标题 |
| value | 自定义右侧内容 |

<script setup>
import CollapseBasic from '@demos/collapse/basic.vue'
import code from '@demos/collapse/basic.vue?raw'
</script>
