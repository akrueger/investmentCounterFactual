import * as transactions from './helpers/transactions'

export function realSecurities(state = {}, action) {
	switch(action.type) {
		case 'buyReal':
			return transactions.buyStock(state, action)
		case 'sellReal':
			return transactions.sellStock(state, action)
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
		default:
			return state
	}
}

export function realWorth(state = {}, action) {
	return {...state,
		worth: action.payload
	}
}

export function hypoWorth(state = {}, action) {
	return {...state,
		worth: action.payload
	}
}
