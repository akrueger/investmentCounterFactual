import * as transactions from './helpers/transactions.js'

export function realPortfolio(state = {}, action) {
	switch(action.type) {
		case 'buyReal':
			return transactions.buyStock(state, action)
		case 'sellReal':
			return transactions.sellStock(state, action)
		default:
			return state
	}
}

export function hypoPortfolio(state = {}, action) {
	switch(action.type) {
		case 'buyHypo':
			return transactions.buyStock(state, action)
		case 'sellHypo':
			return transactions.sellStock(state, action)
		default:
			return state
	}
}
