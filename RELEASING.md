# 发布与部署速查

| 项 | 地址 |
| --- | --- |
| 源码仓库 | https://github.com/WeiLongChe-n/xxui |
| npm 包 | https://www.npmjs.com/package/xxui-mobile |
| 在线文档 | https://weilongche-n.github.io/xxui/ |
| 发布工作流 | `.github/workflows/publish.yml` |
| 文档工作流 | `.github/workflows/docs.yml` |
| 质量门禁 | `.github/workflows/ci.yml` |

---

## 一、常规发版（推荐）

```bash
npm run release:patch     # 0.3.1 → 0.3.2，修 bug 用
npm run release:minor     # 0.3.1 → 0.4.0，加功能用
npm run release           # 自动判断：有 feat 提交走 minor，否则 patch
```

这条命令只做四件事：同步 4 处版本号 → 提交 `chore(release): vX.Y.Z` → 打 `vX.Y.Z` tag → 推送。

推送后由 GitHub Actions 接手，全程无需 token、无需验证码：

```
类型检查 → 构建 → 产物完整性校验 → tag/版本一致性校验
        → OIDC 换取 npm 临时凭证 → npm publish（自动附带 provenance）
```

## 二、预演

```bash
npm run release:dry       # 只打印将要发生的事，不写文件、不提交、不推送
```

## 三、只验证流程、不发版

GitHub 仓库 → **Actions → publish → Run workflow**，可指定 `dist-tag`（latest / beta / next）。

版本已存在时会自动跳过发布，不会覆盖已上线版本。

## 四、本地应急发布（CI 不可用时）

新包首发必须在本地做，npm 对新包强制 2FA：

```bash
npm login --auth-type=web --registry https://registry.npmjs.org/
npm run publish:npm
```

`npm publish` 会打印 `https://www.npmjs.com/auth/cli/...`，在浏览器（或手机）用 passkey 确认即可。

> 不要把 recovery code 塞进 `--otp`。

`scripts/publish-npm.mjs` 的本地流程：

```
git 工作区干净 → npm 登录态 → 包名可用性 → 类型检查
                → 构建 → 产物入口齐全 → npm pack 预检
```

任一步失败都会回滚版本号改动。可用参数：

| 参数 | 作用 |
| --- | --- |
| `--tag beta` | 指定 dist-tag（默认 `latest`） |
| `--yes` | 跳过交互确认 |
| `--skip-check` | 跳过类型检查与预检，谨慎使用 |
| `--no-git` | 不改动 git（不提交、不打 tag） |
| `--push` | 发布后推送提交与 tag |

### 包元数据约束

- 包名 `xxui-mobile` 不带 scope，发布后归当前 npm 账号所有；
- `publishConfig` 已固定 `access: public` 与官方 registry，本机镜像源不影响发布；
- `repository.url` 必须与 GitHub 仓库完全一致，npm 靠它校验 OIDC 身份。

## 五、Trusted Publisher 配置

当前已为本包配好：

| 字段 | 值 |
| --- | --- |
| Provider | GitHub Actions |
| Organization or user | `WeiLongChe-n`（**GitHub 用户名，不是 npm 账号 `chenwll`**） |
| Repository | `xxui` |
| Workflow filename | `publish.yml` |
| Environment | 留空 |
| Allowed actions | `npm publish` |

查现状：

```bash
npx --yes npm@latest trust list xxui-mobile --registry https://registry.npmjs.org/
```

重新创建（换仓库、改 workflow 文件名、配置失效时）：

```bash
npx --yes npm@latest trust github xxui-mobile --file publish.yml --repository WeiLongChe-n/xxui --allow-publish -y --registry https://registry.npmjs.org/
```

> **必须在真终端里跑。** npm 会检测 stdin/stdout 是否为 TTY，管道或 CI 环境里会直接抛 `EOTP` 退出，连授权链接都不给。
>
> 认证走 passkey，无法代劳、无法用密码或验证码替代。

## 六、校验发布结果

```bash
npm view xxui-mobile version                    # 最新版本号
npm view xxui-mobile dist-tags                  # latest 指向哪版
npm view xxui-mobile dist.attestations          # provenance 是否存在
```

注意 npm 发布后会有几分钟的元数据延迟，刚发完 `npm view` 可能还是旧版本。

## 七、常见报错对照

| 现象 | 原因与处理 |
| --- | --- |
| `404 .../oidc/token/exchange/package/xxui-mobile` + `ENEEDAUTH` | npm 上没有该包的 Trusted Publisher 记录，或字段与仓库不一致。用第五节重新创建 |
| `EOTP` | 本地命令缺 2FA。改用 `npm login --auth-type=web`，或在真终端里跑 |
| `EALLOWREMOTE` | `package-lock.json` 里有非官方源的 tarball 地址（如 npmmirror），全部改成 `registry.npmjs.org` |
| `tag X 与 packages/mobile-ui/package.json 的版本 Y 不一致` | tag 必须等于包版本，用 `npm run release` 系列命令定版本 |
| 发布成功但 `npm view` 看不到 | npm 元数据延迟，等几分钟；`dist-tags.latest` 才代表最新 |
| 文档站 404 | 检查产物是否带 `/xxui/` 前缀；Pages 的 Source 需为 GitHub Actions |

发布工作流失败时会自动把排查清单写进 job summary（Actions 运行页底部）。

## 八、文档站部署

推 `master` 且 `docs/`、`packages/mobile-ui/src/`、`scripts/` 有变化时自动部署，也可手动触发 `docs` 工作流。

本地预览线上效果：

```bash
npm run docs:build:pages
node scripts/serve-static.mjs docs/.vitepress/dist xxui 4180
# → http://localhost:4180/xxui/
```

## 九、CI 门禁

推 `master` / 提 PR 时跑（`.github/workflows/ci.yml`）：

- 类型检查（`vue-tsc`）
- 构建（ES + UMD + d.ts）
- 产物完整性：`package.json` 里每个入口指向的文件必须存在
- 冒烟测试：ESM 与 UMD 都能被加载，关键导出齐全
- `npm pack --dry-run`：核对真实发布内容（文件数、体积、必须包含的产物）
