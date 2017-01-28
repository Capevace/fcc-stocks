import React from 'react';
import fetchJsonp from 'fetch-jsonp';
import socket from '../socket';

import StockChart from './StockChart';
import StockCodeEditor from './StockCodeEditor';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.endDate = new Date();
    this.startDate = new Date();
    this.startDate.setYear(new Date().getFullYear() - 1);

    this.colors = [
      '#1abc9c',
      '#3498db',
      '#9b59b6',
      '#f1c40f',
      '#2ecc71',
      '#e74c3c',
      '#ecf0f1',
      '#95a5a6',
      '#e67e22'
    ];

    this.onStocksUpdate = this.onStocksUpdate.bind(this);

    this.state = {
      stockCodes: [],
      stockData: []
    };
  }

  componentDidMount() {
    socket.on('stocks-updated', this.onStocksUpdate);
    socket.emit('request-stocks');
  }

  componentWillUnmount() {
    socket.removeListener('stocks-updated', this.onStocksUpdate);
  }

  onStocksUpdate(payload) {
    console.log(this);
    let newStocks = payload.newStocks
      .filter(stock => !this.state.stockCodes.includes(stock));

    console.log(newStocks);

    const urlData = {
      Normalized: false,
      StartDate: new Date().toISOString(),
      NumberOfDays: 365,
      DataPeriod: "Day",
      Elements: newStocks.map(stock => ({
        Symbol: stock,
        Type: "price",
        Params: [
          "c"
        ]
      }))
    };

    const url = 'http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/jsonp?parameters='
      + JSON.stringify(urlData);

    fetchJsonp(url)
      .then((response) => response.json())
      .then(json => {
        if (json.ExceptionType || !json.Elements || json.Elements.length === 0) {
          // Error
          console.error(json);
          return;
        }

        let stockData = this.state.stockData;

        if (stockData.length === 0) {
          stockData = json.Dates.map(date => {
            const d = new Date(date);
            return {
              name: date
            };
          });
        }

        stockData = stockData.map((stock, index) => {
          json.Elements.forEach(element => {
            stock[element.Symbol] = element.DataSeries.close.values[index];
          });

          return stock;
        });

        this.setState({
          stockData
        }, () => console.log(this.state));
      }).catch(function(ex) {
        console.log('parsing failed', ex)
      });

    this.setState({ stockCodes: payload.newStocks });
  }

  render() {
    return (
      <div className="app">
        <h1 className="title">Stock-Lookup</h1>
        <div className="stock-container">
          <StockChart
            data={this.state.stockData}
            codes={this.state.stockCodes}
            colors={this.colors}
            style={{
              width: '80%'
            }} />
          <StockCodeEditor
            codes={this.state.stockCodes}
            onAdd={stock => socket.emit('pushed-stock', { stock })}
            onRemove={stock => socket.emit('removed-stock', { stock })}
            colors={this.colors} />

          <p style={{ display: 'inline-block', marginTop: '20px'}}>
            Made by Lukas von Mateffy (
              <a href="https://twitter">@Capevace</a>
            )
          </p>
        </div>
      </div>
    );
  }
}

export default App;
