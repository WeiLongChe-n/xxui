# Badge 徽标

徽标用于展示未读数量或状态提示，可以独立使用，也可以包裹任意元素（图标、头像）。

## 基础用法

<DemoBlock title="数字与红点" description="超过 max 会显示 99+；dot 用于只表达「有新内容」的场景" :code="code">
  <BadgeBasic />
</DemoBlock>

## 独立展示

加 `standalone` 后不参与包裹定位，可直接放在文字或按钮旁。

```vue
<x-badge :content="5" standalone />
<x-badge dot standalone />
```

## 包裹元素

不加 `standalone` 时，徽标会定位在子元素的右上角。

```vue
<x-badge :content="3">
  <x-icon name="bell" :size="24" />
</x-badge>
```

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 徽标内容 | `string \| number` | - |
| dot | 是否只显示红点 | `boolean` | `false` |
| max | 最大值，超出显示 `max+` | `number` | `99` |
| color | 背景色 | `string` | `--x-danger` |
| show-zero | 内容为 0 时是否显示 | `boolean` | `false` |
| standalone | 是否独立展示 | `boolean` | `false` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 被包裹的元素 |

<script setup>
import BadgeBasic from '@demos/badge/basic.vue'
import code from '@demos/badge/basic.vue?raw'
</script>
