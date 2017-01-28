require('dotenv').config();

const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const axios = require('axios');

app.set('port', (process.env.PORT || 5000));

app.use('/public', express.static(path.resolve(__dirname, '../build/public')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../build/index.html'));
});

let stocks = [
  'AAPL',
  'GOOGL'
];

const updateSocketsWithStocks = newStocks => io.emit('stocks-updated', { newStocks });

io.on('connection', socket => {
  console.log('Socket connected.');

  updateSocketsWithStocks(stocks);

  socket.on('request-stocks', () => {
    updateSocketsWithStocks(stocks);
  });

  socket.on('pushed-stock', payload => {
    const stock = payload.stock.toUpperCase();

    if (!stocks.includes(stock)) {
      axios
        .get('http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=' + stock)
        .then(result => {
          console.log(result);
          if (result.data && result.data.length > 0) {
            if (!stocks.includes(result.data[0].Symbol)) {
              // We check again, because someone might have requested something at the same time
              stocks.push(result.data[0].Symbol)
              updateSocketsWithStocks(stocks);
            }
          } else {
            socket.emit('invalid-stock');
          }
        })
        .catch(error => console.error('Error looking up code', stock));
    }
  });

  socket.on('removed-stock', payload => {
    const stock = payload.stock.toUpperCase();

    if (stocks.includes(stock)) {
      stocks.splice(stocks.indexOf(stock), 1);
      updateSocketsWithStocks(stocks);
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected.');
  });
});

http.listen(app.get('port'), () => console.log('Listening on', app.get('port')));

// Yahoo url
// https://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.historicaldata where symbol = "AAPL" or symbol = "GOOGL" and startDate = "2012-09-11" and endDate = "2014-02-11"&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=
