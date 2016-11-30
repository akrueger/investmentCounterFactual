import store from '../store'
import * as actionCreators from '../actionCreators'
import {binarySearch} from './utility'
import {getPrice} from './lastPriceCache'

export default function calculateValues(date, quotes, hypoSymbol) {
	const currentRealSymbols = Object.keys(store.getState().realSecurities)
	store.dispatch(actionCreators.calculateRealWorth({
		// calculateRealValue is passing all real symbols instead of active ones
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
		try {
			return shares * getPrice(element)
		}
		catch(error) {
			return error
		}
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
