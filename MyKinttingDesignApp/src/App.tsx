import { useEffect, useMemo, useState } from "react";
import Grid from "./components/Grid/Grid";
import SymbolPanel from "./components/SymbolPanel/SymbolPanel";
import symbols from "./data/symbols.json";

export type Cell = {
  char: string;
  bg: string;
  fontFamily: string;
};

export type Selection = {
  row: number;
  col: number;
};

export type SymbolDefinition = {
  id: string;
  char: string;
  label: string;
  category: string;
  fontFamily: string;
  mode?: "knit" | "crochet" | "both";
};

const DEFAULT_ROWS = 40;
const DEFAULT_COLS = 40;
const DEFAULT_FONT = "StitchMasteryDash";

const fontFamilies = [
  "StitchMasteryDash",
  "StitchMasteryDashCable",
  "StitchMasteryDashCableEH",
  "StitchMasteryDot",
  "StitchMasteryDotCable",
  "StitchMasteryDotCableEH"
];

const createInitialGrid = (rows = DEFAULT_ROWS, cols = DEFAULT_COLS) =>
  Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      char: "",
      bg: "#ffffff",
      fontFamily: DEFAULT_FONT
    }))
  );

function App() {
  const [grid, setGrid] = useState<Cell[][]>(() => createInitialGrid());
  const [selected, setSelected] = useState<Selection>({ row: 0, col: 0 });
  const [fontsReady, setFontsReady] = useState(false);
  const [mode, setMode] = useState<"knit" | "crochet">("knit");
  const [zoom, setZoom] = useState(0.9);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [sidebarPosition, setSidebarPosition] = useState<"left" | "right">("right");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const clampZoom = (value: number) => Math.min(1.6, Math.max(0.6, value));
  const updateZoom = (value: number) => setZoom(clampZoom(value));

  useEffect(() => {
    const fontSet = (document as unknown as { fonts?: FontFaceSet }).fonts;
    if (!fontSet) {
      setFontsReady(true);
      return;
    }

    Promise.all(fontFamilies.map((name) => fontSet.load(`16px "${name}"`)))
      .then(() => setFontsReady(true))
      .catch(() => setFontsReady(true));
  }, []);

  useEffect(() => {
    const seen = window.localStorage.getItem("mkd_onboarding_seen");
    if (!seen) {
      setShowOnboarding(true);
      window.localStorage.setItem("mkd_onboarding_seen", "1");
    }
  }, []);

  const handleCellChange = (row: number, col: number, char: string) => {
    setGrid((prev) =>
      prev.map((rowCells, rowIndex) =>
        rowCells.map((cell, colIndex) =>
          rowIndex === row && colIndex === col
            ? { ...cell, char }
            : cell
        )
      )
    );
  };

  const handlePaste = (row: number, col: number, text: string) => {
    const normalized = text.replace(/\r/g, "");
    const lines = normalized.split("\n").filter((line) => line.length > 0);
    if (!lines.length) return;

    setGrid((prev) => {
      const next = prev.map((r) => r.map((cell) => ({ ...cell })));
      const baseFont = prev[row]?.[col]?.fontFamily ?? DEFAULT_FONT;

      lines.forEach((line, rIdx) => {
        const chars = line.split("");
        const effectiveChars = chars.length ? chars : [""];
        effectiveChars.forEach((ch, cIdx) => {
          const targetRow = row + rIdx;
          const targetCol = col + cIdx;
          if (next[targetRow] && next[targetRow][targetCol]) {
            const glyph = ch.slice(-1);
            next[targetRow][targetCol] = {
              ...next[targetRow][targetCol],
              char: glyph,
              fontFamily: baseFont
            };
          }
        });
        if (chars.length === 1 && lines.length > 1) {
          const targetRow = row + rIdx;
          if (next[targetRow] && next[targetRow][col]) {
            next[targetRow][col] = {
              ...next[targetRow][col],
              char: chars[0],
              fontFamily: baseFont
            };
          }
        }
      });

      return next;
    });
  };

  const handleSymbolPick = (char: string, fontFamily: string) => {
    setGrid((prev) =>
      prev.map((rowCells, rowIndex) =>
        rowCells.map((cell, colIndex) =>
          rowIndex === selected.row && colIndex === selected.col
            ? { ...cell, char, fontFamily: fontFamily || cell.fontFamily }
            : cell
        )
      )
    );
  };

  const filteredSymbols = useMemo(() => {
    return (symbols as SymbolDefinition[]).filter((item) => {
      if (!item.mode || item.mode === "both") return true;
      return item.mode === mode;
    });
  }, [mode]);

  const closeOnboarding = () => setShowOnboarding(false);

  return (
    <div className="app-shell">
      <header className="top-toolbar">
        <div className="toolbar-group">
          <h1 style={{ fontSize: "16px", margin: 0, color: "#0ea5e9" }}>KnitDesign</h1>
          <span className="badge">{fontsReady ? "字体就绪" : "加载字体中"}</span>
        </div>
        
        <div className="toolbar-group">
          <button
            className={`btn-tool ${mode === "knit" ? "btn-primary" : ""}`}
            onClick={() => setMode("knit")}
          >
            棒针模式
          </button>
          <button
            className={`btn-tool ${mode === "crochet" ? "btn-primary" : ""}`}
            onClick={() => setMode("crochet")}
          >
            钩针模式
          </button>
        </div>

        <div className="toolbar-group">
          <button className="btn-tool" onClick={() => alert("功能开发中：根据已有小样/图解换算目标尺码针数")}>针数换算</button>
          <button className="btn-tool" onClick={() => alert("功能开发中：一键将棒针转换为钩针图解")}>AI 转换</button>
        </div>

        <div className="toolbar-group">
          <button className="btn-tool" onClick={() => alert("功能开发中：上传图片/PDF提取图解")}>识别图解 (AI)</button>
          <button className="btn-tool" onClick={() => alert("功能开发中：输入款式文字描述生成对应图解")}>生成图解 (AI)</button>
          <button className="btn-tool" onClick={() => alert("功能开发中：根据当前图解生成实物效果图")}>生成效果图 (AI)</button>
        </div>

        <div className="toolbar-group">
          <button className="btn-tool" onClick={() => window.print()}>导出 PDF</button>
        </div>

        <div className="toolbar-group" style={{ marginLeft: "auto", borderRight: "none" }}>
          <button className="btn-tool" onClick={() => setSidebarPosition(prev => prev === "left" ? "right" : "left")}>
            侧边栏{sidebarPosition === "left" ? "居右" : "居左"}
          </button>
          <button className="btn-tool" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? "收起面板" : "展开面板"}
          </button>
        </div>
      </header>

      <div className={`app-body ${sidebarPosition === "left" ? "sidebar-left" : ""}`}>
        <div className="main-content">
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0", display: "flex", gap: "16px", alignItems: "center", background: "#f8fafc" }}>
            <span style={{ fontWeight: "bold", fontSize: "14px", color: "#334155" }}>画布工作区</span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <label style={{ fontSize: "13px", color: "#64748b" }}>缩放</label>
              <input
                type="range"
                min={0.6}
                max={1.6}
                step={0.05}
                value={zoom}
                onChange={(event) => updateZoom(Number(event.target.value))}
                style={{ width: "100px" }}
              />
              <span style={{ fontSize: "12px", color: "#64748b" }}>{Math.round(zoom * 100)}%</span>
            </div>
          </div>
          <div style={{ flex: 1, overflow: "auto", background: "#f1f5f9" }}>
            <Grid
              grid={grid}
              selected={selected}
              onSelect={setSelected}
              onChange={handleCellChange}
              onPaste={handlePaste}
              zoom={zoom}
              onZoomChange={updateZoom}
            />
          </div>
        </div>

        <div className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
          <div className="sidebar-header">
            <h2 style={{ margin: 0, fontSize: "14px", color: "#334155" }}>
              {mode === "knit" ? "棒针针法" : "钩针针法"}面板
            </h2>
            <button className="btn-tool" style={{ padding: "4px 8px" }} onClick={() => setSidebarOpen(false)}>
              ✕
            </button>
          </div>
          <div className="sidebar-content">
            <SymbolPanel
              symbols={filteredSymbols}
              onPick={handleSymbolPick}
            />
          </div>
        </div>
      </div>

      {showOnboarding && (
        <div className="modal-mask" role="dialog" aria-modal="true">
          <div className="modal">
            <h3>快速上手</h3>
            <ul>
              <li>点击画布格子后，键盘输入或从右侧面板点击符号即可写入。</li>
              <li>支持粘贴多行字符，或同一个符号的多行粘贴。</li>
              <li>左上角切换“棒针/钩针”模式以加载对应符号列表。</li>
              <li>拖动缩放条放大或缩小画布，默认提供大号画布，可滚动查看。</li>
            </ul>
            <button type="button" className="primary" onClick={closeOnboarding}>
              我知道了
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
