# Tabbar 标签栏

标签栏位于页面底部，用于在一级页面之间切换。

## 基础用法

<DemoBlock title="标签栏" description="支持图标、选中图标、角标、红点与自定义颜色" :code="code">
  <TabbarBasic />
</DemoBlock>

## 与路由配合

```vue
<vl-tabbar v-model="active" @change="router.push(routes[active])">
  <vl-tabbar-item name="home" icon="home" text="首页" />
  <vl-tabbar-item name="user" icon="user" text="我的" />
</vl-tabbar>
```

`v-model` 绑定当前激活项的 `name`（未设置 `name` 时使用索引），`change` 事件在切换时触发一次。

## 角标

```vue
<vl-tabbar-item icon="cart" text="购物车" :badge="3" />
<vl-tabbar-item icon="comment" text="消息" dot />
```

## 固定与安全区

默认 `fixed` 为 `true`，固定在视口底部；配合 `safe-area-inset-bottom`（默认开启）适配 iPhone 底部小黑条。若在文档或非全屏容器中使用，设置 `:fixed="false"`。

## API

### Tabbar Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 当前激活项 | `string \| number` | `0` |
| fixed | 是否固定底部 | `boolean` | `true` |
| placeholder | 固定时是否生成占位 | `boolean` | `false` |
| border | 是否显示上边框 | `boolean` | `true` |
| activeColor | 选中颜色 | `string` | `--vl-primary` |
| inactiveColor | 未选中颜色 | `string` | `--vl-text-color-3` |
| safeAreaInsetBottom | 适配底部安全区 | `boolean` | `true` |
| zIndex | 层级 | `number` | `100` |

### Tabbar Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 激活项变化 | `key` |
| change | 激活项变化 | `key` |

### TabbarItem Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 标识 | `string \| number` | 索引 |
| icon | 图标名称 | `string` | - |
| activeIcon | 选中时的图标 | `string` | `icon` |
| text | 文字 | `string` | - |
| badge | 角标内容 | `string \| number` | - |
| dot | 是否显示红点 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |

### TabbarItem Slots

| 名称 | 说明 |
| --- | --- |
| default | 自定义内容（替换图标与文字） |

<script setup>
import TabbarBasic from '@demos/tabbar/basic.vue'
import code from '@demos/tabbar/basic.vue?raw'
</script>
