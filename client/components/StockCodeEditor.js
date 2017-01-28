import React from 'react';

import socket from '../socket';
import StockCodeBox from './StockCodeBox';

class StockCodeEditor extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onInvalidStock = this.onInvalidStock.bind(this);

    socket.on('invalid-stock', this.onInvalidStock);

    this.state = {
      stockCodeInput: ''
    };
  }

  onSubmit(event) {
    event.preventDefault();

    if (this.props.onAdd)
      this.props.onAdd(this.state.stockCodeInput);

    this.setState({ stockCodeInput: '' });
  }

  onRemove(code) {
    if (this.props.onRemove)
      this.props.onRemove(code);
  }

  onInvalidStock() {
    this.setState({ invalidStock: true });

    setTimeout(() => {
      this.setState({ invalidStock: false });
    }, 2000);
  }

  render() {
    return (
      <div className="stock-code-editor">
        <div className="stock-code-editor-form">
          <form onSubmit={this.onSubmit}>
            <input
              type="text"
              className="editor-input"
              value={this.state.stockCodeInput}
              placeholder="Enter Stock Code (e.g. GOOGL)"
              onChange={e => this.setState({ stockCodeInput: e.target.value })} />
            <button
              className="editor-input editor-button"
              type="submit">
              Add
            </button>
            {this.state.invalidStock &&
              <span className="error-label">Invalid Stock</span>
            }

          </form>
        </div>
        <div className="stock-code-list">
          {this.props.codes.map((code, index) =>
            <StockCodeBox
              code={code}
              onRemove={() => this.onRemove(code)}
              color={this.props.colors[index % this.props.colors.length]}
              key={index} />
          )}
        </div>
      </div>
    );
  }
}

export default StockCodeEditor;
