# Tag 标签

用于标记事物的属性与状态，支持五种语义、三种尺寸、朴素与圆角形态。

## 基础用法

<DemoBlock title="标签形态" description="语义色来自主题变量，切换主题时会自动跟随" :code="code">
  <TagBasic />
</DemoBlock>

## 语义类型

```vue
<x-tag type="primary">主要</x-tag>
<x-tag type="success">成功</x-tag>
<x-tag type="warning">警告</x-tag>
<x-tag type="danger">危险</x-tag>
<x-tag>默认</x-tag>
```

## 朴素与尺寸

```vue
<x-tag type="primary" plain>朴素标签</x-tag>
<x-tag type="primary" size="small">小号</x-tag>
<x-tag type="primary" size="large">大号</x-tag>
```

## 圆角与标记

`round` 为全圆角，`mark` 为左侧直角的「书签」样式，适合列表左上角的角标。

```vue
<x-tag type="primary" round>圆角</x-tag>
<x-tag type="danger" mark>热卖</x-tag>
```

## 可关闭

```vue
<x-tag type="primary" closeable @close="onClose">可关闭</x-tag>
```

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 类型 | `primary \| success \| warning \| danger \| default` | `default` |
| size | 尺寸 | `small \| normal \| large` | `normal` |
| plain | 是否为朴素标签 | `boolean` | `false` |
| round | 是否为圆角 | `boolean` | `false` |
| mark | 是否为标记样式 | `boolean` | `false` |
| color | 自定义背景色 | `string` | - |
| text-color | 自定义文字颜色 | `string` | - |
| closeable | 是否可关闭 | `boolean` | `false` |

## Events

| 事件 | 说明 |
| --- | --- |
| close | 点击关闭图标 |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 标签内容 |

<script setup>
import TagBasic from '@demos/tag/basic.vue'
import code from '@demos/tag/basic.vue?raw'
</script>
