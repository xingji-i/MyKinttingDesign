import React from "react";
import { Cell, Selection } from "../../App";
import GridCell from "./GridCell";
import "./grid.css";

export type GridProps = {
  grid: Cell[][];
  selected: Selection;
  onSelect: (selection: Selection) => void;
  onChange: (row: number, col: number, value: string) => void;
  cellSize?: number;
  onPaste?: (row: number, col: number, text: string) => void;
  zoom?: number;
  onZoomChange?: (value: number) => void;
};

const Grid = ({ grid, selected, onSelect, onChange, onPaste, onZoomChange, zoom = 1, cellSize = 36 }: GridProps) => {
  const columnCount = grid[0]?.length ?? 0;
  const scaledSize = Math.max(18, Math.round(cellSize * zoom));

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (event) => {
    if (!event.ctrlKey && !event.metaKey) return;
    if (!onZoomChange) return;
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.05 : 0.05;
    onZoomChange(zoom + delta);
  };

  return (
    <div className="grid-wrapper" onWheel={handleWheel}>
      <div className="grid-viewport">
        <table className="grid-table">
          <thead>
            <tr>
              <th className="corner-cell" style={{ width: scaledSize, minWidth: scaledSize }} />
              {Array.from({ length: columnCount }).map((_, idx) => (
                <th
                  key={`col-head-${idx}`}
                  className="col-head"
                  style={{ width: scaledSize, minWidth: scaledSize }}
                >
                  {idx + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                <th
                  className="row-head"
                  style={{ height: scaledSize, minHeight: scaledSize, width: scaledSize, minWidth: scaledSize }}
                >
                  {rowIndex + 1}
                </th>
                {row.map((cell, colIndex) => (
                  <td key={`cell-${rowIndex}-${colIndex}`} style={{ width: scaledSize, height: scaledSize }}>
                    <GridCell
                      cell={cell}
                      rowIndex={rowIndex}
                      colIndex={colIndex}
                      selected={selected}
                      onSelect={onSelect}
                      onChange={onChange}
                      onPaste={onPaste}
                      size={scaledSize}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Grid;
