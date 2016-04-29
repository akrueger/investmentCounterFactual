var yahooFinance = require('yahoo-finance');
	
yahooFinance.dividendhistory({
  symbol: 'VTI',
  from: '2012-12-31',
  to: '2012-12-31',
  // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only) 
}, function (err, data) {
  handleResponse(data);
});

var handleResponse = function(response) {
	console.log(response)
  // VTI = {
  //   date: response[0].date,
  //   price: response[0].close
  // }

  // console.log(VTI);
};