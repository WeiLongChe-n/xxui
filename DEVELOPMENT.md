# 开发辅助脚本

`scripts/` 下有两类脚本：一类是**构建与发布流水线**（`build-docs.mjs`、`release-tag.mjs`、`publish-npm.mjs`），由 `npm scripts` 调用；另一类是**开发期自检脚本**，用来做视觉回归、控制台巡检和产物校验。

本文件只讲第二类。它们在 npm scripts 之外，按需直接 `node` 运行。

## 前置条件

- 依赖 `puppeteer-core` 与本机已安装的 Chrome，浏览器路径写在脚本顶部的 `CHROME` 常量里，换机器时改这一处即可；
- 除 `verify-static.mjs` 与 `serve-static.mjs` 外，其余脚本需要文档站正在运行（`npm run dev`，默认 5173）；
- 这些脚本只在本地开发时使用，不参与 `build` 与 `docs:build`，不影响发布产物。

## 脚本清单

| 脚本 | 用法 | 作用 |
| --- | --- | --- |
| `shot.mjs` | `PAGES='[["/","home"]]' node scripts/shot.mjs` | 批量截图页面，并汇总控制台报错；支持 `FULL=1` 整页、`MOBILE=1` 移动视口、`DARK=1` 暗色 |
| `clip.mjs` | `node scripts/clip.mjs <url> <selector> <out.png> [宽度]` | 截取单个元素并输出自身与子元素的尺寸、溢出情况，用于核对局部排版；`DARK=1` 走暗色 |
| `interact.mjs` | `node scripts/interact.mjs` | 自动打开 Dialog / ActionSheet / Popup / Toast 并截图，验证命令式组件 |
| `inspect2.mjs` | `node scripts/inspect2.mjs` | 通过主题切换器切到暗色，读取关键节点的计算样式，确认主题令牌真正生效 |
| `check404.mjs` | `node scripts/check404.mjs` | 从首页广度优先爬取全部站内链接，报告 >=400 的页面；`BASE=` 可指向预览服务 |
| `sandbox.mjs` | `node scripts/sandbox.mjs` | 沙箱自检：确认演示确实渲染在 iframe 内、指针拖拽在沙箱 window 上生效、换肤不影响文档站、`--vp-*` 未泄漏 |
| `verify-static.mjs` | `node scripts/verify-static.mjs <产物目录> <仓库名>` | 静态产物自检：确认 HTML 里所有带 base 前缀的绝对路径都能找到对应文件 |
| `serve-static.mjs` | `node scripts/serve-static.mjs <产物目录> <仓库名> [端口]` | 极简静态服务器，把产物挂到子路径下，模拟 GitHub Pages 的访问方式 |

## 典型用法

**上线前跑一遍全站巡检**——抓控制台报错与死链：

```bash
npm run dev &
node scripts/shot.mjs        # 截图 + 控制台报错汇总
node scripts/check404.mjs    # 站内死链
```

**核对某个组件的局部排版**——输出尺寸与溢出情况，比肉眼比对可靠：

```bash
node scripts/clip.mjs http://localhost:5173/components/tabs '.x-tabs' tabs.png
```

**验证线上产物的路径是否正确**——部署前排查，不依赖 Chrome：

```bash
npm run docs:build:pages
node scripts/verify-static.mjs docs/.vitepress/dist xxui
node scripts/serve-static.mjs docs/.vitepress/dist xxui 4180
# → http://localhost:4180/xxui/
```

## 新增脚本的约定

- 顶部统一导出 `CHROME` 常量，不要散落硬编码路径；
- 支持 `BASE` 环境变量覆盖默认地址，便于指向预览服务或线上站点；
- 只读不写：脚本可以截图、输出报告，但不修改仓库内文件；
- 输出用 `console.log` 打人类可读的结论，不要只留退出码。
