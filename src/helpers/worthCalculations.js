import store from '../store'
import * as actionCreators from '../actionCreators'
import {binarySearch} from './utility'
import {getPrice} from './lastPriceCache'

export default function calculateValues(date, quotes, hypoSymbol) {
	const currentRealSymbols = Object.keys(store.getState().realSecurities)
	store.dispatch(actionCreators.calculateRealWorth({
		worth: parseInt(calculateRealValue(date, quotes, currentRealSymbols).toFixed(0), 10)
	}))
	store.dispatch(actionCreators.calculateHypoWorth({
		worth: calculateHypoValue(date, quotes, hypoSymbol)
	}))
}

function calculateRealValue(date, quotes, currentRealSymbols) {
	return currentRealSymbols.map(element => {
		const shares = store.getState().realSecurities[element].shares
		const quoteMatch = binarySearch(quotes[element], date)
		if(quoteMatch) {
			return shares * quoteMatch.close
		}
		return shares * getPrice(element)
	})
	.reduce((previous, current) =>
		previous + current
	)
}

function calculateHypoValue(date, quotes, hypoSymbol) {
	const currentShares = store.getState().hypoSecurities[hypoSymbol].shares
	const currentPrice = binarySearch(quotes[hypoSymbol], date).close
	const worth = currentShares * currentPrice
	return parseInt(worth.toFixed(0), 10)
}
