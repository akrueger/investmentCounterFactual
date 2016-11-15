import Papa from 'papaparse'
import store from './store'
import * as actionCreators from './actionCreators'
import {getSplits, getQuotes, processDividends} from './helpers/retrieve'
import {sortByDate, removeStrings, lowerCase, formatDate, binarySearch, } from './helpers/utility'

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
	// REFACTOR -- too much going on
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
	combinedTransactions.forEach(transactionElement => {
		switch(true) {
			case (transactionElement.transaction === 'buy' || 'sell'): {
				const quotesHypoElement = binarySearch(quotes[hypoSymbol], transactionElement.date)
				dispatchActions({
					quotes,
					type: transactionElement.transaction,
					date: transactionElement.date,
					real: {
						symbol: transactionElement.symbol,
						shares: transactionElement.shares,
						price: transactionElement.price
					},
					hypo: {
						symbol: hypoSymbol,
						shares: (transactionElement.shares * transactionElement.price) / quotesHypoElement.close,
						price: quotesHypoElement.close
					}
				})
				break
			}
			case (transactionElement.transaction === 'dividend'):
				dispatchActions({
					quotes,
					date: transactionElement.date,
					type: transactionElement.transaction,
					hypo: {
						symbol: hypoSymbol
					},
					dividend: {
						symbol: transactionElement.symbol,
						dividendYield: transactionElement.dividendYield,
						price: transactionElement.price
					}
				})
				break
			case (transactionElement.transaction === 'split'):
				break
			default:
				throw new Error('Invalid transaction')
		}
	})
}

function dispatchActions({date, quotes, type, real, hypo, dividend}) {
	switch(type) {
		case 'buy':
			store.dispatch(actionCreators.buyRealStock({
				[real.symbol]: {
					date,
					shares: real.shares,
					price: real.price
				}
			}))
			store.dispatch(actionCreators.buyHypoStock({
				[hypo.symbol]: {
					date,
					shares: hypo.shares,
					price: hypo.price
				}
			}))
			break
		case 'sell':
			store.dispatch(actionCreators.sellRealStock({
				[real.symbol]: {
					date,
					shares: real.shares,
					price: real.price
				}
			}))
			store.dispatch(actionCreators.sellHypoStock({
				[hypo.symbol]: {
					date,
					shares: hypo.shares,
					price: hypo.price
				}
			}))
			break
		case 'dividend':
			if(dividend.symbol === hypo.symbol) {
				store.dispatch(actionCreators.dividendHypoStock({
					[dividend.symbol]: {
						date: dividend.date,
						price: dividend.price,
						dividendYield: dividend.dividendYield
					}
				}))
			}
			else {
				store.dispatch(actionCreators.dividendRealStock({
					[dividend.symbol]: {
						date: dividend.date,
						price: dividend.price,
						dividendYield: dividend.dividendYield
					}
				}))
			}
			break
		default:
			throw new Error('Invalid transaction')
	}
	calculateValues({type, date, quotes, hypo})
}

function calculateValues({date, quotes, hypo}) {
	const currentRealSymbols = Object.keys(store.getState().realSecurities)
	const currentHypoSymbol = store.getState().hypoSecurities[hypo.symbol]
	const currentAllSymbols = currentRealSymbols.concat(currentHypoSymbol)
	if(date) {
		store.dispatch(actionCreators.calculateRealWorth({
			worth: parseInt(calculateRealValue({date, quotes, currentRealSymbols}).toFixed(0), 10)
		}))
		store.dispatch(actionCreators.calculateHypoWorth({
			worth: calculateHypoValue(hypo)
		}))
	}
}

function calculateRealValue({date, quotes, currentRealSymbols}) {
	return currentRealSymbols.map(element => {
		const currentPrice = binarySearch(quotes[element], date).close
		return store.getState().realSecurities[element].shares * currentPrice
	})
	.reduce((previous, current) =>
		previous + current
	)
}

function calculateHypoValue(hypo) {
	const currentShares = store.getState().hypoSecurities[hypo.symbol].shares
	const currentPrice = hypo.price
	const worth = currentShares * currentPrice
	return parseInt(worth.toFixed(0), 10)
}
