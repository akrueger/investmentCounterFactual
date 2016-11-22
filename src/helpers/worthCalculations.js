import store from '../store'
import * as actionCreators from '../actionCreators'
import {binarySearch} from './utility'

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
		const currentPrice = binarySearch(quotes[element], date).close
		return store.getState().realSecurities[element].shares * currentPrice
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
