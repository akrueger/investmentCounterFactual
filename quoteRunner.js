var yahooFinance = require('yahoo-finance')
yahooFinance.historical({
  symbols: [
    'gnat'
  ],
  from: '2016-09-20',
  to: '2016-09-30',
  period: 'd'
}, function (err, quotes) {
  process.stdout.write(JSON.stringify(quotes))
})
