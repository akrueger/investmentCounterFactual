// const fetchCurrentPrice = (uri, options) => {
// 	const url = `${uri}?s=${options.symbols.toString()}&f=${options.fields}`
// 	fetch(url, {mode: 'cors'}).then(response => {
// 		if(!response.ok) {
// 			throw Error(response.statusText)
// 		}
// 		console.log(response)
// 	}).catch(error => {
// 		console.log(error)
// 	})
// }

// const fetchDividends = options =>
// 	yahooFinance.historical(options, (error, data) => {
// 		console.log(data)
// 	})

// moment().format('YYYY-MM-DD')

// 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)

// const YAHOO_URI = 'http://finance.yahoo.com/d/quotes.csv'
