import { useMemo } from "react";
import { SymbolDefinition } from "../../App";
import "./symbol-panel.css";

export type SymbolPanelProps = {
  symbols: SymbolDefinition[];
  onPick: (char: string, fontFamily: string) => void;
};

const SymbolPanel = ({ symbols, onPick }: SymbolPanelProps) => {
  const grouped = useMemo(() => {
    const map = new Map<string, SymbolDefinition[]>();
    symbols.forEach((symbol) => {
      const key = symbol.category || "other";
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)?.push(symbol);
    });
    return map;
  }, [symbols]);

  return (
    <div className="symbol-panel">
      {[...grouped.entries()].map(([category, list]) => (
        <div className="symbol-group" key={category}>
          <div className="symbol-group-title">{category}</div>
          <div className="symbol-grid">
            {list.map((symbol) => (
              <button
                type="button"
                key={symbol.id}
                className="symbol-button"
                onClick={() => onPick(symbol.char, symbol.fontFamily)}
              >
                <span className="symbol-char" style={{ fontFamily: symbol.fontFamily }}>
                  {symbol.char || "\u00A0"}
                </span>
                <span className="symbol-label">{symbol.label}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SymbolPanel;
