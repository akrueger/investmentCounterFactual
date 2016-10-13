import _map from 'lodash.map'
import moment from 'moment'
import Papa from 'papaparse'
import store from './store.js'
import * as actionCreators from './actionCreators.js'

const hypoInput = document.getElementById('textInput')

const portfolioInput = document.getElementById('fileInput')
portfolioInput.addEventListener('change', handleCSV, false)

function handleCSV() {
	const file = this.files[0]
	const reader = new FileReader()
	reader.onload = () => {
		parseCSV(reader.result.trim())
	}
	reader.onerror = () => {
		throw new Error('Error reading CSV file')
	}
	reader.readAsText(file)
}

function parseCSV(csvTransactions) {
	const options = {
		header: true
	}
	const jsonTransactions = Papa.parse(csvTransactions, options)
	processData(jsonTransactions.data, jsonTransactions.meta.fields)
}

function fetchQuotes({beginDate, endDate, period, symbols}) {
	return fetch(`/api?beginDate=${beginDate}&endDate=${endDate}&symbols=${symbols}&period=${period}`)
		.then(response =>
			response.json()
				.then(quotes =>
					quotes
				)
		)
		.catch(error => {
			throw new Error('Error fetching portfolio quote')
		})
}

function processData(transactions, fields) {
	// REFACTOR -- too much going on
	debugger
	const processedTransactions = sortByDate(removeStrings(lowerCase(transactions, fields)))
	const realSymbols = Array.from(new Set(processedTransactions.map(element => element.symbol)))
	const hypoSymbol = hypoInput.value.toUpperCase()
	fetchQuotes({
		beginDate: processedTransactions[0].date,
		endDate: processedTransactions[processedTransactions.length - 1].date,
		period: 'd',
		symbols: realSymbols.concat([hypoSymbol])
	}).then(quotes => {
		quotes[hypoSymbol].map(quotesElement =>
			processedTransactions.map(transactionElement => {
				if(moment(quotesElement.date).format('YYYY-MM-DD') === transactionElement.date) {
					dispatchActions({
						type: transactionElement.transaction,
						real: {
							symbol: transactionElement.symbol,
							date: transactionElement.date,
							shares: transactionElement.shares,
							price: transactionElement.price
						},
						hypo: {
							symbol: hypoSymbol,
							date: transactionElement.date,
							shares: (transactionElement.shares * transactionElement.price) / quotesElement.close,
							price: quotesElement.close
						}
					})
				}
				return undefined
			})
			)
	})
}

function removeStrings(transactions) {
	return transactions.map(element => (
		{
			date: element.date,
			price: parseFloat(element.price),
			shares: parseFloat(element.shares),
			symbol: element.symbol,
			transaction: element.transaction
		}
	))
}

function lowerCase(transactions, fields) {
	return transactions.map(element => {
		// REFACTOR -- can it be cleaner or more straightforward?
		const obj = {}
		fields.forEach(key => {
			if(key.toLowerCase() === 'transaction') {
				obj[key.toLowerCase()] = element[key].toLowerCase()
			}
			else if(key.toLowerCase() === 'symbol') {
				obj[key.toLowerCase()] = element[key].toUpperCase()
			}
			else {
				obj[key.toLowerCase()] = element[key]
			}
		})
		return obj
	})
}

function sortByDate(transactions) {
	return transactions.sort((a, b) =>
		moment(a.date).diff(b.date)
	)
}

function dispatchActions({type, real, hypo}) {
	if(type === 'buy') {
		store.dispatch(actionCreators.buyRealStock({
			[real.symbol]: {
				date: real.date,
				shares: real.shares,
				price: real.price
			}
		}))
		store.dispatch(actionCreators.buyHypoStock({
			[hypo.symbol]: {
				date: hypo.date,
				shares: hypo.shares,
				price: hypo.price
			}
		}))
		store.dispatch(actionCreators.calculateRealWorth({
			worth: calculateRealValue(real)
		}))
		store.dispatch(actionCreators.calculateHypoWorth({
			worth: calculateHypoValue(hypo)
		}))
	}
	else if(type === 'sell') {
		store.dispatch(actionCreators.sellRealStock({
			[real.symbol]: {
				date: real.date,
				shares: real.shares,
				price: real.price
			}
		}))
		store.dispatch(actionCreators.sellHypoStock({
			[hypo.symbol]: {
				date: hypo.date,
				shares: hypo.shares,
				price: hypo.price
			}
		}))
	}
	else {
		throw new Error('Invalid transaction')
	}
}

function calculateRealValue(real) {
	const currentSymbols = Object.keys(store.getState().realSecurities)
	const date = real.date
}

function calculateHypoValue(hypo) {
	const currentShares = store.getState().hypoSecurities[hypo.symbol].shares
	const currentPrice = hypo.price
	const worth = currentShares * currentPrice
	return parseInt(worth.toFixed(0), 10)
}

function calculate() {
	_map(store.getState(), element =>
		element.shares * element.price
	)
	.reduce((previous, current) =>
		previous + current
	)
}

// 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
