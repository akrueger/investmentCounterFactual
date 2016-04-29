var portfolio = [
	'PRHSX',
	'VHT',
	'VWO',
	'VGT',
	'VEA',
	'VTI',
	'VDE',
	'VNQ',
	'VPU',
	'VAW'
],

	stocks = '';

portfolio.forEach(function(value, index, array) {
		stocks = stocks + value + '%2C';
	});

stocks.substring(0, stocks.length - 3);

	getPrice = function(stock, index) {
	var http = require("http"),
			https = require("https"),
			options = {
  			host: 'query.yahooapis.com',
			  port: 80,
			  path: '/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D%27http%3A%2F%2Fdownload.finance.yahoo.com%2Fd%2Fquotes.csv%3Fs%3D' + stocks + '%26f%3Dsl1d1t1c1ohgv%26e%3D.csv%27%20and%20columns%3D%27symbol%2Cprice%2Cdate%2Ctime%2Cchange%2Ccol1%2Chigh%2Clow%2Ccol2%27&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys',
			  method: 'GET',
			  headers: {
			        'Content-Type': 'application/json'
			    }
				},
			price,
			req = https.request(options, function(res) {
			  console.log('STATUS: ' + res.statusCode);
			  console.log('HEADERS: ' + JSON.stringify(res.headers));
			  res.setEncoding('utf8');
			  res.on('data', function (chunk) {
			    console.log('BODY: ' + chunk);
			    //price = JSON.parse(chunk.substring(11, chunk.length - 1));
			   	//portfolio[index]['price'] = price;
			  });
			});

// write data to request body
req.write('data\n');
req.write('data\n');
req.end();

};

// portfolio.forEach(function(value, index, array){
// 	array[index] = {
// 		shares: null,
// 		price: null
// 	}
// 	getPrice(value, index);
// });

// portfolio.forEach(function(value, index, array){
// 	console.log(array[index]['price']);
// });