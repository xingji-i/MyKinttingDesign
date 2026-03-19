import { Cell, Selection } from "../../App";

export type GridCellProps = {
  cell: Cell;
  rowIndex: number;
  colIndex: number;
  selected: Selection;
  onSelect: (selection: Selection) => void;
  onChange: (row: number, col: number, value: string) => void;
  onPaste?: (row: number, col: number, text: string) => void;
  size: number;
};

const GridCell = ({
  cell,
  rowIndex,
  colIndex,
  selected,
  onSelect,
  onChange,
  onPaste,
  size
}: GridCellProps) => {
  const isSelected = selected.row === rowIndex && selected.col === colIndex;

  const handleChange = (value: string) => {
    const next = value ? value.slice(-1) : "";
    onChange(rowIndex, colIndex, next);
  };

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <input
        className={`grid-cell-input${isSelected ? " selected" : ""}`}
        value={cell.char}
        onChange={(event) => handleChange(event.target.value)}
        onFocus={() => onSelect({ row: rowIndex, col: colIndex })}
        onPaste={(event) => {
          if (onPaste) {
            event.preventDefault();
            const text = event.clipboardData.getData("text");
            onPaste(rowIndex, colIndex, text);
          }
        }}
        style={{
          width: "100%",
          height: "100%",
          fontFamily: cell.fontFamily,
          backgroundColor: cell.bg,
          border: "none",
          padding: 0,
          textAlign: "center"
        }}
        maxLength={2}
        aria-label={`Row ${rowIndex + 1} Column ${colIndex + 1}`}
      />
      {isSelected && (
        <button
          className="cell-arrow-btn"
          onClick={(e) => {
            e.preventDefault();
            alert("展开快捷针法选择面板 (多选复制功能已在粘贴功能中支持)");
          }}
          style={{
            position: "absolute",
            bottom: "-6px",
            right: "-6px",
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            background: "#0ea5e9",
            color: "white",
            border: "none",
            fontSize: "10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            zIndex: 10
          }}
          title="快捷选择针法"
        >
          ▼
        </button>
      )}
    </div>
  );
};

export default GridCell;
