import {flatten, formatDate, formSplitDate, binarySearch} from './utility'

export function getSplits({allSymbols, firstDate, lastDate}) {
	const splitPromises = []
	allSymbols.forEach(symbol => {
		splitPromises.push(fetchSplit(symbol)
			.then(splitData =>
				processSplits(symbol, splitData).filter(element =>
					element.date > firstDate && element.date < lastDate
				)
			))
	})
	return Promise.all(splitPromises)
		.then(splits =>
			flatten(splits)
		)
}

export function getQuotes({allSymbols, firstDate, lastDate}, period) {
	return fetchQuotes({
		beginDate: firstDate,
		endDate: lastDate,
		period,
		symbols: allSymbols
	})
}

function fetchSplit(symbol) {
	return fetch(`/api/split?symbol=${symbol}`)
		.then(response =>
			response.json()
				.then(splits =>
					splits
				)
		)
		.catch(error => {
			throw new Error('Error fetching portfolio splits')
		})
}

function fetchQuotes({beginDate, endDate, period, symbols}) {
	return fetch(`/api/quote?beginDate=${beginDate}&endDate=${endDate}&symbols=${symbols}&period=${period}`)
		.then(response =>
			response.json()
				.then(quotes =>
					quotes
				)
		)
		.catch(error => {
			throw new Error(`Error fetching quote: ${error}`)
		})
}

function processSplits(symbol, splitData) {
	const ratioRegEx = /\b\d*[:]\d*\b/
	return splitData.map(element => {
		const date = formSplitDate(element)
		const splitRatio = ratioRegEx.exec(element)[0]
		const numerator = parseInt(splitRatio.substr(0, 1), 10)
		const denominator = parseInt(splitRatio.substr(2, 2), 10)
		return ({
			date,
			symbol,
			transaction: 'split',
			splitRatio: (numerator / denominator)
		})
	})
}

export function processDividends(allSymbols, quotes, dividends) {
	return flatten(
					allSymbols.map(symbol =>
						dividends[symbol].map(element =>
							({
								date: formatDate(element.date),
								symbol: element.symbol,
								dividendYield: element.dividends,
								transaction: 'dividend',
								price: binarySearch(quotes[symbol], formatDate(element.date)).close
							})
						)
					)
				)
}
