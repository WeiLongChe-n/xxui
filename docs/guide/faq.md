# 常见问题

## 主题相关

### 切换主题后组件没变化？

1. 确认调用的是组件库导出的方法（`setTheme` / `setBrand` / `useTheme`），而不是自己改 `document` 属性后又被打断；
2. 如果组件在 `<iframe>` 或 Shadow DOM 中，主题属性需要设置在对应的根节点上；
3. 检查是否有样式写死了颜色值（如 `#3b82f6`），请改用 `var(--x-primary)`。

### Toast / Dialog 不跟随局部主题？

函数式组件挂载在 `document.body`，只响应 `html` 上的全局主题。需要在局部主题里使用弹层时，请使用组件形式的 `<x-toast>` / `<x-dialog>`。

### 换肤后自定义页面的颜色没变？

只有使用了 CSS 变量的地方才会跟随。建议为业务样式定义语义变量：

```css
.my-card {
  color: var(--x-text-color);
  background: var(--x-background-2);
  border: 1px solid var(--x-border-color);
}
```

### 如何让主题在刷新后保持？

默认已持久化到 `localStorage`（键名 `xxui-theme`）。如果使用了自定义存储策略，可以关闭内置持久化：

```ts
initTheme({ storage: false })
```

## 组件使用

### 弹层被其他元素遮挡？

弹层默认使用自增 `z-index`（从 2000 起）。如果页面中存在更高层级的元素（如第三方地图、视频控件），可以显式指定：

```vue
<x-popup v-model:show="show" :z-index="5000" />
```

### 页面滚动了但弹层没锁住？

`lock-scroll` 默认开启。若自定义了弹层容器或使用了 `position: fixed` 的布局，可能需要在打开时手动调用：

```ts
import { lockScroll, unlockScroll } from 'xxui-mobile'
```

（当前版本该工具未作为公共 API 导出，可参考源码 `utils/index.ts` 实现。）

### 表单校验不触发？

1. `FormItem` 必须有 `name`，且 `Form` 的 `model` 中存在该字段；
2. 输入组件需要放在 `FormItem` 的默认插槽内；
3. 自定义组件不会自动触发校验，需要手动调用 `formRef.value.validate()`。

### Stepper 数量减不到 0？

`min` 默认是 `1`，请显式传 `:min="0"`。

### Tabs 下划线位置不对？

下划线依赖导航项的 `offsetLeft`。如果 Tabs 初始处于 `display: none` 的容器中（如未激活的 Tab、弹层内），测量结果会是 0。解决办法：

- 在容器显示后调用 `resize` 或重新挂载；
- 或使用 `type="card"` 避开下划线测量。

### List 一直触发 load？

`immediate-check` 会在挂载时检查一次；如果内容不足一屏，会连续触发加载。请在 `load` 中正确设置 `loading`，并在数据加载完后设置 `finished`。

### 手势组件在桌面上没反应？

Slider、Swipe、PullRefresh 依赖触摸 / 指针事件。Slider 使用 Pointer Events 因此在桌面上也可拖动；Swipe 与 PullRefresh 仅响应 `touch` 事件，请在移动端或浏览器设备模拟器中测试。

## 工程化

### TypeScript 报 `Cannot find module 'xxui-mobile'`？

确认 `tsconfig.json` 中的 `moduleResolution` 为 `bundler` 或 `node16`，并且已经安装依赖。

### 样式重复打包？

如果同时引入 `xxui-mobile` 与 `xxui-mobile/style.css`，请确认没有在多个入口重复引入 CSS。构建工具通常会去重，但多页应用需要注意。

### Node 版本不满足导致安装或启动失败？

本项目要求 **Node.js >= 18**，推荐 20 / 22 LTS。低于该版本时常见两类报错：

- `npm install` 阶段：`EBADENGINE` 或 `Unsupported engine`，因为根 `package.json` 与 `packages/mobile-ui/package.json` 都声明了 `engines.node`；
- `npm run dev` / `npm run docs:build` 阶段：Vite 6 内部使用 `node:` 前缀模块与较新的语法，在 Node 16 及以下会直接抛错。

处理方式：升级 Node 到 18 以上，或直接使用仓库根目录的 `.nvmrc`：

```bash
nvm use          # 读取 .nvmrc，切到 22.22.2
node -v          # 确认版本
npm install
```

注意这只影响**本仓库的开发与文档站构建**。`xxui-mobile` 作为依赖被安装到业务项目时不需要 Node，构建产物是纯 ESM / UMD。

### SSR 报 `document is not defined`？

主题初始化、手势与弹层相关逻辑都做了环境判断，但 `Toast` / `Dialog` 在模块加载时不访问 DOM，只有调用时才挂载。若仍报错，请检查是否在 `setup` 顶层直接调用了 `Toast()`。

## 其他

### 支持 Vue 2 吗？

不支持。XXUI 基于 Vue 3 的 Composition API 与 Teleport 实现。

### 可以商用吗？

可以，基于 MIT 协议发布。
