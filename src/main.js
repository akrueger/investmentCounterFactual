import 'datejs'
import Papa from 'papaparse'
import moment from 'moment'
import store from './store'
import * as actionCreators from './actionCreators'
import {getSplits, getQuotes, processDividends} from './helpers/retrieve'
import {sortByDate, removeStrings, lowerCase, formatDate, findLastTradeDate, binarySearch} from './helpers/utility'
import calculateValues from './helpers/worthCalculations'

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
	mungeData(jsonTransactions.data, jsonTransactions.meta.fields)
}

function mungeData(transactions, fields) {
	const processedTransactions = sortByDate(removeStrings(lowerCase(transactions, fields)))
	const hypoSymbol = hypoInput.value.toUpperCase()
	const realSymbols = Array.from(new Set(processedTransactions.map(element => element.symbol)))
	const allSymbols = realSymbols.concat([hypoSymbol])
	const firstDate = processedTransactions[0].date
	const lastDate = processedTransactions[processedTransactions.length - 1].date

	const inputData = {
		allSymbols,
		firstDate,
		lastDate
	}

	getSplits(inputData)
		.then(processedSplits => {
			getQuotes(inputData, 'd') // daily price quotes
				.then(quotes => {
					getQuotes(inputData, 'v') // dividend quotes
						.then(dividends => {
							const processedDividends = processDividends(allSymbols, quotes, dividends)
							// Add price data
							processedTransactions.forEach(element => {
								element.price = binarySearch(quotes[element.symbol], formatDate(element.date)).close
							})
							const combinedTransactions = sortByDate(processedTransactions.concat(processedDividends).concat(processedSplits))
							processTransactions(combinedTransactions, quotes, hypoSymbol)
						})
				})
		})
}

function processTransactions(combinedTransactions, quotes, hypoSymbol) {
	const transactionsLength = combinedTransactions.length - 1
	combinedTransactions.forEach((transactionElement, index) => {
		switch(true) {
			case (transactionElement.transaction === 'buy' || transactionElement.transaction === 'sell'): {
				const quotesHypoElement = binarySearch(quotes[hypoSymbol], transactionElement.date)
				dispatchActions({
					hypoSymbol,
					quotes,
					type: transactionElement.transaction,
					date: transactionElement.date,
					real: {
						symbol: transactionElement.symbol,
						shares: transactionElement.shares,
						price: transactionElement.price
					},
					hypo: {
						shares: (transactionElement.shares * transactionElement.price) / quotesHypoElement.close,
						price: quotesHypoElement.close
					}
				})
				break
			}
			case (transactionElement.transaction === 'dividend'): {
				const currentRealSymbols = Object.keys(store.getState().realSecurities)
				const currentAllSymbols = currentRealSymbols.concat([hypoSymbol])

				if(currentAllSymbols.includes(transactionElement.symbol)) {
					dispatchActions({
						hypoSymbol,
						quotes,
						date: transactionElement.date,
						type: transactionElement.transaction,
						symbol: transactionElement.symbol,
						dividendYield: transactionElement.dividendYield,
						price: transactionElement.price
					})
				}
			}
				break
			case (transactionElement.transaction === 'split'): {
				const currentRealSymbols = Object.keys(store.getState().realSecurities)
				const currentAllSymbols = currentRealSymbols.concat([hypoSymbol])

				if(currentAllSymbols.includes(transactionElement.symbol)) {
					const splitPrice = binarySearch(quotes[transactionElement.symbol], transactionElement.date)
					dispatchActions({
						hypoSymbol,
						quotes,
						date: transactionElement.date,
						type: transactionElement.transaction,
						symbol: transactionElement.symbol,
						splitRatio: transactionElement.splitRatio,
						price: splitPrice.close
					})
				}
			}
				break
			default:
				throw new Error(`Invalid transaction: ${JSON.stringify(transactionElement)}`)
		}
		if(index === transactionsLength) {
			// Add most recent trade date to quotes
			const currentRealSymbols = Object.keys(store.getState().realSecurities)
			const currentAllSymbols = currentRealSymbols.concat([hypoSymbol])
			const yesterday = moment().subtract(1, 'day')
			const lastTradeDate = findLastTradeDate(yesterday)
			getQuotes({
				allSymbols: currentAllSymbols,
				firstDate: lastTradeDate,
				lastDate: lastTradeDate
			}, 'd')
				.then(data => {
					Object.keys(data).forEach(element =>
						quotes[element].push(data[element][0])
					)
					calculateValues(lastTradeDate, quotes, hypoSymbol)
				})
		}
	})
}

function dispatchActions({date, quotes, type, real, hypo, symbol, hypoSymbol, price, dividendYield, splitRatio}) {
	switch(type) {
		case 'buy':
			store.dispatch(actionCreators.buyHypoStock({
				[hypoSymbol]: {
					date,
					shares: hypo.shares,
					price: hypo.price
				}
			}))
			store.dispatch(actionCreators.buyRealStock({
				[real.symbol]: {
					date,
					shares: real.shares,
					price: real.price
				}
			}))
			break
		case 'sell':
			store.dispatch(actionCreators.sellHypoStock({
				[hypoSymbol]: {
					date,
					shares: hypo.shares,
					price: hypo.price
				}
			}))
			store.dispatch(actionCreators.sellRealStock({
				[real.symbol]: {
					date,
					shares: real.shares,
					price: real.price
				}
			}))
			break
		case 'dividend': {
			const dividendObject = {
				[symbol]: {
					date,
					price,
					dividendYield
				}
			}
			if(symbol === hypoSymbol) {
				store.dispatch(actionCreators.dividendHypoStock(dividendObject))
			}
			else {
				store.dispatch(actionCreators.dividendRealStock(dividendObject))
			}
			break
		}
		case 'split': {
			const splitObject = {
				[symbol]: {
					date,
					price,
					splitRatio
				}
			}
			if(symbol === hypoSymbol) {
				store.dispatch(actionCreators.splitHypoStock(splitObject))
			}
			else {
				store.dispatch(actionCreators.splitRealStock(splitObject))
			}
			break
		}
		default:
			throw new Error('Invalid transaction')
	}
	calculateValues(date, quotes, hypoSymbol)
}
