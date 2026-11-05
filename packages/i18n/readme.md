# Toonflow 多语言

[返回项目首页](../../README.md) · [文档目录](../../docs/readme.md) · [开发与扩展指南](../../docs/development.md)

语言字典集中在 `src/locales/`，仅支持越南语（`vi`）和英语（`en`），默认越南语。中文业务源码继续作为消息键，文档与提示词保留原文。

## 使用

Web 设置和首次引导复用 `languageSelect.vue`，仅展示越南语与英语。支持方向键、Home/End 选择，手动选择保存在 `settings.ui.language`。未选择、旧版“跟随系统”或不支持的语言回退越南语，不再跟随浏览器语言。API 支持通过 Accept-Language 明确选择英语或越南语。

越南与美国两幅国旗统一来自 [flag-icons 7.3.2](https://github.com/lipis/flag-icons/tree/7.3.2/flags/4x3) 的现成 4:3 SVG，仅将根元素包装为本地 `languageFlags.svg` 的 symbol，保留原始路径、定义、比例和 MIT 授权声明。只收录组件实际引用的国家，不安装整套图库，运行时不请求 CDN；修改图案时应更新对应上游资源，不再手绘。

Element Plus 使用 `src/elementPlus/` 中的越南语和英语 JSON；Day.js 只额外注册越南语，英语使用内置包。TDesign 使用英语基底，聊天控件由应用字典补齐；Zod 校验提示支持英语和越南语。

Web 静态文本和明确的展示属性由 `@toonflow/i18n/vite` 在 Vue 编译前转换，业务源码继续写中文。转换仅作用于 `apps/web/src`；编译器只处理已知显示位置，不遍历 DOM，不调用在线翻译，不关闭 Vue 静态优化，也不通过重新挂载页面切换语言。

动态文案可以使用原生 JavaScript 标签模板，无需 Babel 宏：

```ts
import { t, msg, translate } from "@toonflow/i18n/vue";

// 操作发生时显示当前语言。
ElMessage.success(t`文件 ${fileName} 已保存`);

// 配置保存消息描述，显示时翻译；参数会在创建描述时取值。
const saveLabel = msg`保存`;
const label = computed(() => translate(saveLabel));

// 动态参数在响应式作用域内求值。
const countLabel = computed(() => t`已选择 ${selectedCount.value} 个节点`);
```

`msg` 保留模板与参数，`t` 立即翻译。Vue 入口中的翻译函数读取响应式语言；模块初始化或 setup 中一次性得到的普通字符串不会自动更新。参数原样插入，不被当成新模板解析；花括号与引号由标签模板转义。需要复数时，译文可使用 ICU MessageFormat 的 `plural`，不要把句子拆开拼接。

后端使用 `apps/server/src/lib/i18n.ts` 的请求上下文。`success/error` 兼容旧中文字符串和消息描述；动态错误使用该模块的 `t`。FFmpeg 服务端错误可用 `@toonflow/i18n/errors` 的 `messageError`，传入 `msg` 标签模板生成的描述，保存原文和参数，到系统错误出口再翻译。后端不要调用 core 的 `setLocale` 切换全局语言。

语言来源按每个请求的 `Accept-Language`（含 q 权重）隔离；无支持的请求语言时使用保存的应用语言或系统语言。Zod 使用一次注册、按请求读取的语言分派器。SSE、MCP 和 FFmpeg 仅处理已识别的系统错误，模型正文、工具成功结果、供应商未知错误、用户内容和日志详情保持原样。

供应商、tools、nodes 子包和节点脚手架不接入多语言，也不参与文案抽取。插件名称和插件自身文案使用原值；Web 中的插件管理菜单、安装操作和配置校验提示仍属于应用界面。节点构建和宿主之间不提供语言运行时接口。

## 更新文案

在仓库根目录执行：

```sh
bun run --cwd packages/i18n extract
```

此命令只更新 `src/messageSources.json`（消息来源索引），不会生成中文语言包或覆盖译文。补齐越南语和英语文件中新增的键，保留 `{0}` 等参数；变更中文原文后要同步调整译文。相同中文需要不同语义时，应明确拆分消息，不能通过翻译后的文字判断业务状态。

Element Plus JSON 独立于应用文案抽取维护，基于 2.14.5 的完整 142 项组件文案，保留上游 MIT 授权于 `src/elementPlus/license.txt`。升级 Element Plus 时对照其英语包核对所有键与数组结构，再补齐英语与越南语两份 JSON。组件模板保留 `{total}`、`{pager}`、`{column}` 等原始命名参数，不使用应用字典的 ICU 语法；`name` 必须匹配已注册的 Day.js 语言名。类型检查会检查语言覆盖及相对于本地英语包的结构，但不能代替与升级后上游的核对或译文校对。

校对时沿来源索引追到按钮事件、状态分支和接口实际行为，确认操作对象、影响范围及完成条件。例如收藏分类与“添加收藏”是不同语义，关闭弹窗与“不使用高亮颜色”也应分别翻译；音频裁剪区间、表格行、版本说明和消费金额须按所在功能理解。

未支持的显示代码应在显示边界显式调用 `translate/t`，不要扩大规则到任意 `message`、`label` 或所有中文字符串。`data`、`inputs`、`outputs` 等用户数据不属于自动翻译范围。已有 `[aria-label="中文"]` 逻辑定位应改为稳定的 `data-*` 标识。

字典随应用打包，运行时不依赖翻译服务。历史版本的译文字典已完成 AI 辅助的全量逐条语义校对，并对术语、否定条件、操作对象、数字和模板参数进行复核；这不等同于各语言母语人员的出版级审校。供应商、tools、nodes 子包、第三方网站与安装器不在本次翻译范围。

历史版本验证过程见 [回归记录](./regression.md)。
