import { Cell, Selection } from "../../App";
import GridCell from "./GridCell";
import "./grid.css";

export type GridProps = {
  grid: Cell[][];
  selected: Selection;
  onSelect: (selection: Selection) => void;
  onChange: (row: number, col: number, value: string) => void;
  cellSize?: number;
};

const Grid = ({ grid, selected, onSelect, onChange, cellSize = 38 }: GridProps) => {
  return (
    <div className="grid-wrapper">
      <table className="grid-table">
        <tbody>
          {grid.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {row.map((cell, colIndex) => (
                <td key={`cell-${rowIndex}-${colIndex}`}>
                  <GridCell
                    cell={cell}
                    rowIndex={rowIndex}
                    colIndex={colIndex}
                    selected={selected}
                    onSelect={onSelect}
                    onChange={onChange}
                    size={cellSize}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Grid;
