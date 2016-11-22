var yahooFinance = require('yahoo-finance')
yahooFinance.historical({
  symbols: [
    'GNAT'
  ],
  from: '2016-11-10',
  to: '2016-11-20',
  period: 'd'
}, function (err, quotes) {
  process.stdout.write(JSON.stringify(quotes))
})
