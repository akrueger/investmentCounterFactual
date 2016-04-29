var https = require('https');

	var getData = function getData(requestType, symbol, startDate, endDate) {

		url1 = 'https://query.yahooapis.com/v1/public/yql?q=select',
		url2 = encodeURIComponent(' * from yahoo.finance.' + requestType + ' where symbol =' + ' "' + symbol + '" ' + 'and startDate =' + ' "' + startDate + '" ' + 'and endDate =' + ' "' + endDate + '"'),
		url3 = '&format=json&diagnostics=true&env=',
		url4 = encodeURIComponent('store://datatables.org/alltableswithkeys'),
		url5 = '&callback=';

		https.get(url1 + url2 + url3 + url4 + url5, function(res) {
  	//console.log("statusCode: ", res.statusCode);
	  //console.log("headers: ", res.headers);

	  res.on('data', function(d) {
	  	switch(requestType) {

	  		case 'historicaldata':
	  			console.log(JSON.parse(d).query.results.quote.Close);
	  		break;

	  		case 'dividendhistory':
	  			console.log(JSON.parse(d).query.results.quote);
	  		break;

	  		default:
	  			throw('Improper request type');
	  	}
	    
	  });

		}).on('error', function(e) {
		  console.error(e);
			});
	
	};

getData('historicaldata', 'VTI', '2012-12-31', '2013-12-31');

		

		



