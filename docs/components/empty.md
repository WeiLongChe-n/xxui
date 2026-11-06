# Empty 空状态

空状态用于提示当前区域暂无内容，内置多种插图并支持自定义操作区。

## 基础用法

<DemoBlock title="空状态" description="默认插图、搜索无结果、网络异常与加载失败" :code="code">
  <EmptyBasic />
</DemoBlock>

## 预设插图

| image | 说明 |
| --- | --- |
| `default` | 默认空盒子插图 |
| `search` | 搜索无结果 |
| `network` | 网络异常 |
| `error` | 加载失败 |
| `cart` | 购物车为空 |

```vue
<vl-empty image="search" description="没有找到相关商品" />
```

## 自定义插图与操作

```vue
<vl-empty description="购物车还是空的">
  <vl-button type="primary" size="small">去逛逛</vl-button>
  <template #image>
    <img src="/empty.png" alt="" />
  </template>
</vl-empty>
```

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| image | 预设插图 | `default \| search \| network \| error \| cart` | `default` |
| description | 描述文字 | `string` | `暂无数据` |
| imageSize | 插图尺寸 | `string \| number` | `110` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 底部操作区 |
| image | 自定义插图 |
| description | 自定义描述 |

<script setup>
import EmptyBasic from '@demos/empty/basic.vue'
import code from '@demos/empty/basic.vue?raw'
</script>
