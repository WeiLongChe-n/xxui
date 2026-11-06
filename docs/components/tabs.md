# Tabs 标签页

标签页用于在同一区域切换不同内容视图，支持下划线、胶囊卡片两种风格，以及吸顶、懒加载与自定义导航扩展。

## 基础用法

<DemoBlock title="标签页形态" description="下划线风格、卡片风格、自定义选中色与右侧扩展区" :code="code">
  <TabsBasic />
</DemoBlock>

## 基本结构

```vue
<vl-tabs v-model="active">
  <vl-tab name="a" title="商品详情">内容 A</vl-tab>
  <vl-tab name="b" title="规格参数">内容 B</vl-tab>
</vl-tabs>
```

`<vl-tab>` 的 `name` 与 `Tabs` 的 `v-model` 对应；不传 `name` 时使用索引。

## 卡片风格

```vue
<vl-tabs v-model="active" type="card">...</vl-tabs>
```

卡片风格会把每个标签渲染为胶囊按钮，选中项使用主色背景，适合二级筛选。

## 吸顶

```vue
<vl-sticky>
  <vl-tabs v-model="active" sticky :offset-top="46">
    ...
  </vl-tabs>
</vl-sticky>
```

- `sticky`：Tabs 自带的吸顶能力；
- 如果需要与导航栏联动，建议外层再包一层 [Sticky](/components/sticky) 并设置 `offset-top`。

## 懒加载

`lazy-render` 默认开启，只有首次切换到某个 Tab 时才渲染其内容，适合每个 Tab 都较重的页面。关闭后所有内容在首次渲染时全部挂载。

## 导航扩展

```vue
<vl-tabs v-model="active">
  <vl-tab name="a" title="推荐">...</vl-tab>
  <template #nav-right>
    <vl-icon name="filter" />
  </template>
</vl-tabs>
```

## 徽标

```vue
<vl-tab name="comment" title="评价" :badge="12" />
<vl-tab name="notice" title="通知" dot />
```

## API

### Tabs Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 当前激活的 name | `string \| number` | - |
| type | 风格 | `line \| card` | `line` |
| color | 选中主色 | `string` | `--vl-primary` |
| background | 导航背景色 | `string` | - |
| titleActiveColor | 选中文字颜色 | `string` | `color` |
| titleInactiveColor | 未选中文字颜色 | `string` | `--vl-text-color-2` |
| lineWidth | 下划线宽度 | `number \| string` | 标题宽度的 60% |
| lineHeight | 下划线高度 | `number \| string` | `3` |
| sticky | 是否吸顶 | `boolean` | `false` |
| offsetTop | 吸顶距离 | `number \| string` | `0` |
| shrink | 标题是否等宽收缩 | `boolean` | `true` |
| lazyRender | 是否懒加载内容 | `boolean` | `true` |
| duration | 指示器动画时长（秒） | `number` | `0.3` |

### Tabs Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 激活项变化 | `key` |
| change | 激活项变化 | `key` |
| click-tab | 点击标签（含已选中） | `(key, title)` |

### Tabs Slots

| 名称 | 说明 |
| --- | --- |
| default | Tab 列表 |
| nav-right | 导航栏右侧扩展区 |

### Tab Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题 | `string` | - |
| name | 标识 | `string \| number` | 索引 |
| disabled | 是否禁用 | `boolean` | `false` |
| badge | 徽标内容 | `string \| number` | - |
| dot | 是否显示红点 | `boolean` | `false` |

### Tab Slots

| 名称 | 说明 |
| --- | --- |
| default | 面板内容 |
| title | 自定义导航标题 |

<script setup>
import TabsBasic from '@demos/tabs/basic.vue'
import code from '@demos/tabs/basic.vue?raw'
</script>
