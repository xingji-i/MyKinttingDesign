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
};

const DEFAULT_ROWS = 12;
const DEFAULT_COLS = 12;
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

  const metrics = useMemo(
    () => ({ rows: grid.length, cols: grid[0]?.length ?? 0 }),
    [grid]
  );

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1 className="app-title">编织图纸原型 · MVP</h1>
          <p className="app-subtitle">最小可编辑网格 + 字体加载 + 符号面板</p>
        </div>
        <div className="meta">
          <span className="badge">行 {metrics.rows}</span>
          <span className="badge">列 {metrics.cols}</span>
          <span className="badge">{fontsReady ? "字体已就绪" : "加载字体中"}</span>
        </div>
      </header>

      <div className="info-banner">
        字体来自 public/fonts，已通过 @font-face 注册。若看到方块或空白，请确认字体文件是否完整加载。
      </div>

      <div className="app-body">
        <div className="card">
          <h2>画布</h2>
          <Grid
            grid={grid}
            selected={selected}
            onSelect={setSelected}
            onChange={handleCellChange}
          />
        </div>

        <div className="card">
          <h2>符号面板</h2>
          <SymbolPanel
            symbols={symbols as SymbolDefinition[]}
            onPick={handleSymbolPick}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
