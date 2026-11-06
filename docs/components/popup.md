# Popup 弹出层

弹出层是 Dialog、ActionSheet 等组件的底座，负责遮罩、定位、过渡动效与滚动锁定。

## 基础用法

<DemoBlock title="五个方向" description="支持上、下、左、右、居中五个方向，可开启圆角与关闭按钮" :code="code">
  <PopupBasic />
</DemoBlock>

## 位置

| position | 说明 | 默认尺寸 |
| --- | --- | --- |
| `bottom` | 从底部滑入 | 宽度 100%，高度自适应 |
| `top` | 从顶部滑入 | 宽度 100%，高度自适应 |
| `left` | 从左侧滑入 | 高度 100%，宽度自适应 |
| `right` | 从右侧滑入 | 高度 100%，宽度自适应 |
| `center` | 居中缩放 | 内容决定，最大 100% |

```vue
<vl-popup v-model:show="show" position="bottom" round>
  <div class="content">内容</div>
</vl-popup>
```

## 圆角与关闭按钮

```vue
<vl-popup v-model:show="show" position="bottom" round closeable close-icon-position="top-right" />
```

`round` 只对贴近屏幕边缘的方向生效（bottom 圆上两角、top 圆下两角、left/right 圆内侧两角）。

## 点击遮罩关闭

默认点击遮罩不关闭，避免误触丢失表单内容；需要关闭时：

```vue
<vl-popup v-model:show="show" close-on-click-overlay />
```

## 滚动锁定

`lock-scroll` 默认开启，弹层出现时锁定页面滚动，并阻止遮罩上的滚动穿透。内部可滚动区域（`overflow: auto`）依然可以正常滚动。

## 生命周期

| 事件 | 触发时机 |
| --- | --- |
| open | `show` 变为 true |
| opened | 进入动画结束 |
| close | `show` 变为 false |
| closed | 离开动画结束 |

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| show | 是否显示（v-model:show） | `boolean` | `false` |
| position | 弹出位置 | `center \| top \| bottom \| left \| right` | `center` |
| round | 是否圆角 | `boolean` | `false` |
| closeable | 是否显示关闭图标 | `boolean` | `false` |
| closeIcon | 关闭图标名称 | `string` | `close` |
| closeIconPosition | 关闭图标位置 | `top-left \| top-right \| bottom-left \| bottom-right` | `top-right` |
| overlay | 是否显示遮罩 | `boolean` | `true` |
| overlayClass / overlayStyle | 遮罩自定义 | `string` / `object` | - |
| closeOnClickOverlay | 点击遮罩关闭 | `boolean` | `false` |
| lockScroll | 是否锁定滚动 | `boolean` | `true` |
| safeAreaInsetBottom | 适配底部安全区 | `boolean` | `false` |
| safeAreaInsetTop | 适配顶部安全区 | `boolean` | `false` |
| duration | 动画时长（秒） | `number \| string` | `0.3` |
| zIndex | 层级 | `number` | 自动递增 |
| teleport | 挂载节点，默认跟随上下文（见 `setDefaultTeleportTarget`） | `string \| HTMLElement` | `body` |
| beforeClose | 关闭前拦截 | `() => boolean \| Promise<boolean>` | - |

## Events

| 事件 | 说明 |
| --- | --- |
| update:show | 显隐变化 |
| open / opened | 打开前 / 打开动画结束 |
| close / closed | 关闭前 / 关闭动画结束 |
| click-overlay | 点击遮罩 |
| click-close-icon | 点击关闭图标 |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 弹层内容 |

<script setup>
import PopupBasic from '@demos/popup/basic.vue'
import code from '@demos/popup/basic.vue?raw'
</script>
