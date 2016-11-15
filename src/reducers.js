import {buyStock, sellStock, reinvestDividend, splitStock} from './helpers/transactions'

export function realSecurities(state = {}, action) {
	switch(action.type) {
		case 'buyReal':
			return buyStock(state, action)
		case 'sellReal':
			return sellStock(state, action)
		case 'dividendReal':
			return reinvestDividend(state, action)
		case 'splitReal':
			return splitStock(state, action)
		default:
			return state
	}
}

export function hypoSecurities(state = {}, action) {
	switch(action.type) {
		case 'buyHypo':
			return buyStock(state, action)
		case 'sellHypo':
			return sellStock(state, action)
		case 'dividendHypo':
			return reinvestDividend(state, action)
		case 'splitHypo':
			return splitStock(state, action)
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
