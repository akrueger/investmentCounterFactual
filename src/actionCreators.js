import { buyHypo, sellHypo, buyReal, sellReal } from './actionTypes.js'

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
