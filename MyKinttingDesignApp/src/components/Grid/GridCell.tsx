import { Cell, Selection } from "../../App";

export type GridCellProps = {
  cell: Cell;
  rowIndex: number;
  colIndex: number;
  selected: Selection;
  onSelect: (selection: Selection) => void;
  onChange: (row: number, col: number, value: string) => void;
  size: number;
};

const GridCell = ({
  cell,
  rowIndex,
  colIndex,
  selected,
  onSelect,
  onChange,
  size
}: GridCellProps) => {
  const isSelected = selected.row === rowIndex && selected.col === colIndex;

  const handleChange = (value: string) => {
    const next = value ? value.slice(-1) : "";
    onChange(rowIndex, colIndex, next);
  };

  return (
    <input
      className={`grid-cell-input${isSelected ? " selected" : ""}`}
      value={cell.char}
      onChange={(event) => handleChange(event.target.value)}
      onFocus={() => onSelect({ row: rowIndex, col: colIndex })}
      style={{
        width: size,
        height: size,
        fontFamily: cell.fontFamily,
        backgroundColor: cell.bg
      }}
      maxLength={2}
      aria-label={`Row ${rowIndex + 1} Column ${colIndex + 1}`}
    />
  );
};

export default GridCell;
