# Switch 开关

用于在两个互斥状态间切换，常用于设置项。

## 基础用法

<DemoBlock title="开关形态" description="支持自定义尺寸、文字、颜色、加载与禁用状态" :code="code">
  <SwitchBasic />
</DemoBlock>

## 尺寸

`size` 以 `px` 为单位设置开关整体高度，宽度自动按比例计算（默认 26px 高）。

```vue
<x-switch v-model="value" size="32" />
```

## 文字

```vue
<x-switch v-model="value" active-text="开" inactive-text="关" />
```

文字会占用额外宽度，开关整体会随文字长度自适应。

## 自定义值

默认 `true / false`，可以改成字符串或数字，便于直接绑定后端枚举：

```vue
<x-switch v-model="status" active-value="on" inactive-value="off" />
```

## 加载与禁用

`loading` 会显示加载图标且阻止点击，适合异步提交场景；`disabled` 则整体置灰。

```vue
<x-switch v-model="value" loading />
<x-switch v-model="value" disabled />
```

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 开关值 | `any` | `false` |
| activeValue | 打开时的值 | `any` | `true` |
| inactiveValue | 关闭时的值 | `any` | `false` |
| size | 尺寸（px） | `string \| number` | `26` |
| activeColor | 打开时背景色 | `string` | `--x-primary` |
| inactiveColor | 关闭时背景色 | `string` | `--x-text-color-4` |
| activeText | 打开时文字 | `string` | - |
| inactiveText | 关闭时文字 | `string` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| loading | 是否加载中 | `boolean` | `false` |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 值变化 | `value: any` |
| change | 值变化 | `value: any` |
| click | 点击 | `event: MouseEvent` |

<script setup>
import SwitchBasic from '@demos/switch/basic.vue'
import code from '@demos/switch/basic.vue?raw'
</script>
