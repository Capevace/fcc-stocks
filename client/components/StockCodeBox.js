import React from 'react';

function StockCodeBox({ code, children, onRemove, color }) {
  return (
    <div className="stock-code-box" style={{ background: color }}>
      {code}
      <button onClick={onRemove}>X</button>
    </div>
  );
}

export default StockCodeBox;
