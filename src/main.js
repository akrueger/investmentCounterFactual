import _map from 'lodash.map'
import moment from 'moment'
import Papa from 'papaparse'
import store from './store.js'
import * as actionCreators from './actionCreators.js'

const hypoInput = document.getElementById('textInput')

// const calculateButton = document.getElementById('calculateButton')
// calculateButton.addEventListener('click', handleCalculation, false)

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

function fetchHypo({beginDate, endDate, period, symbols, realShares, realPrice}) {
	return fetch(`/api?beginDate=${beginDate}&endDate=${endDate}&symbols=${symbols}&period=${period}`)
		.then(response =>
			response.json()
				.then(quote =>
					createHypoActionObject(quote, beginDate, endDate, symbols, realShares, realPrice)
				)
		)
		.catch(error => {
			// different error?
			console.log(error)
		})
}

// function handleCalculation() {
// 	calculate()
// }

function parseCSV(csvTransactions) {
	const options = {
		header: true
	}
	const jsonTransactions = Papa.parse(csvTransactions, options)
	processData(jsonTransactions.data, jsonTransactions.meta.fields)
}

function processData(transactions, fields) {
	dispatchActions(
		sortByDate(
			lowerCase(transactions, fields)
		)
	)
}

function lowerCase(transactions, fields) {
	return transactions.map(element => {
		// Refactor
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

function dispatchActions(transactions) {
	// DRY refactor
	transactions.forEach(element => {
		if(element.transaction === 'buy') {
			store.dispatch(actionCreators.buyRealStock(createRealActionObject(element)))
			fetchHypo({
				beginDate: element.date,
				endDate: element.date,
				period: 'd',
				symbols: hypoInput.value.toUpperCase(),
				realShares: parseFloat(element.shares),
				realPrice: parseFloat(element.price)
			})
		}
		else if(element.transaction === 'sell') {
			store.dispatch(actionCreators.sellRealStock(createRealActionObject(element)))
			store.dispatch(actionCreators.sellHypoStock(fetchHypo({
				beginDate: element.date,
				endDate: element.date,
				period: 'd',
				symbols: hypoInput.value.toUpperCase(),
				realShares: parseFloat(element.shares),
				realPrice: parseFloat(element.price)
			})))
		}
		else {
			// error invalid transaction type
			console.log('Transaction type is invalid')
		}
	})
}

function createRealActionObject(element) {
	return {
		[element.symbol]: {
			date: element.date,
			shares: parseFloat(element.shares),
			price: parseFloat(element.price)
		}
	}
}

function createHypoActionObject(quote, beginDate, endDate, symbols, realShares, realPrice) {
	const closePrice = quote[symbols][0].close
	// Do we want a dispatch action here?
	store.dispatch(actionCreators.buyHypoStock({
		[symbols]: {
			date: beginDate,
			shares: (realShares * realPrice) / closePrice,
			price: closePrice
		}
	}))
}

// function calculate() {
// 	_map(store.getState(), element =>
// 		element.shares * element.price
// 	)
// 	.reduce((previous, current) =>
// 		previous + current
// 	)
// }
