import * as transactions from './helpers/transactions'

export function realSecurities(state = {}, action) {
	switch(action.type) {
		case 'buyReal':
			return transactions.buyStock(state, action)
		case 'sellReal':
			return transactions.sellStock(state, action)
		case 'dividendReal':
			return transactions.reinvestDividend(state, action)
		default:
			return state
	}
}

export function hypoSecurities(state = {}, action) {
	switch(action.type) {
		case 'buyHypo':
			return transactions.buyStock(state, action)
		case 'sellHypo':
			return transactions.sellStock(state, action)
		case 'dividendHypo':
			return transactions.reinvestDividend(state, action)
		default:
			return state
	}
}

export function realWorth(state = {}, action) {
	switch(action.type) {
		case 'realWorth':
			return {...state,
				worth: action.payload
			}
		default:
			return state
	}
}

export function hypoWorth(state = {}, action) {
	switch(action.type) {
		case 'hypoWorth':
			return {...state,
				worth: action.payload
			}
		default:
			return state
	}
}
