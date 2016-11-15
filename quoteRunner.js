var yahooFinance = require('yahoo-finance')
yahooFinance.historical({
  symbols: [
    'AAPL'
  ],
  from: '2011-06-5',
  to: '2014-6-14',
  period: 'v'
}, function (err, quotes) {
  process.stdout.write(JSON.stringify(quotes))
})
