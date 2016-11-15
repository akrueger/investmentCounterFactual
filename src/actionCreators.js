import { buyHypo, sellHypo, buyReal, sellReal, dividendReal, dividendHypo, realWorth, hypoWorth } from './actionTypes'

export function buyHypoStock(payload) {
	return {
		type: buyHypo,
		payload
	}
}

export function sellHypoStock(payload) {
	return {
		type: sellHypo,
		payload
	}
}

export function buyRealStock(payload) {
	return {
		type: buyReal,
		payload
	}
}

export function sellRealStock(payload) {
	return {
		type: sellReal,
		payload
	}
}

export function dividendRealStock(payload) {
	return {
		type: dividendReal,
		payload
	}
}

export function dividendHypoStock(payload) {
	return {
		type: dividendHypo,
		payload
	}
}

export function calculateRealWorth(payload) {
	return {
		type: realWorth,
		payload
	}
}

export function calculateHypoWorth(payload) {
	return {
		type: hypoWorth,
		payload
	}
}
