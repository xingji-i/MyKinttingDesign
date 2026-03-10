# MyKinttingDesignApp

> 基于 Vite + React + TypeScript 的编织图纸 MVP：可编辑网格 + StitchMastery 字体加载 + 符号面板。

## 快速开始
- 要求：Node.js 18+，npm。
- 安装依赖并启动开发服务器：

```bash
npm install
npm run dev
```

浏览器访问 http://localhost:5173/。

## 当前能力（MVP）
- 12×12 可编辑网格，单元格选中后键入或从符号面板点击填入符号。
- StitchMastery 字体从 public/fonts 加载，@font-face 已注册并在 App 中检测。
- 符号面板按 category 分组，点击写入当前格子并带上对应 fontFamily。

## 目录结构
```
MyKinttingDesignApp/
  index.html
  package.json
  tsconfig.json
  tsconfig.node.json
  vite.config.ts
  public/
    fonts/                 # StitchMasteryDash/ DashCable/ Dot 等字体
  src/
    App.tsx                # 布局、网格 + 符号面板编排
    main.tsx               # React 入口
    styles/global.css      # 字体注册与基础样式
    data/symbols.json      # 首批符号清单模板
    components/
      Grid/                # 网格与单元格组件
      SymbolPanel/         # 符号面板组件
```

## 字体
- 已内置字体：StitchMasteryDash, StitchMasteryDashCable, StitchMasteryDashCableEH, StitchMasteryDot, StitchMasteryDotCable, StitchMasteryDotCableEH。
- 路径：public/fonts；若看到方块/空白，请检查字体文件是否完整和大小写是否一致。

## 符号数据
- 符号清单：见 [src/data/symbols.json](src/data/symbols.json)。字段：`id`、`char`、`label`、`category`、`fontFamily`。
- 面板分组依据 `category`，点击后写入当前选中格并应用 `fontFamily`。
- 后续可继续从 PDF 对照表追加/修正字符与类别。

## 网格数据模型（前端内存）
- `Cell`: `{ char: string; bg: string; fontFamily: string }`
- `Selection`: `{ row: number; col: number }`
- 默认行列：12×12，可在 App 内调整初始化逻辑。

## 与设计文档的对应
- 设计方案详见 [designSolution.md](../designSolution.md)。
- MVP 已覆盖：DOM 表格网格、字体加载检测、符号面板点击写入。
- 下一步建议：键盘方向键移动与批量填充、背景色编辑、JSON 导入/导出（阶段一补充清单）。

## 开发提示
- 若调整或新增字体，先放入 public/fonts，再在 styles/global.css 注册并在 App 的 fontFamilies 中列出以便加载检测。
- 符号模板调整后，刷新即可生效；如需快捷键映射，可新增一份 keymap 表并在 SymbolPanel 中扩展。
- 性能瓶颈出现时，可考虑虚拟化网格或切换 Canvas 路线（见设计文档中的 Canvas 方案评估）。
