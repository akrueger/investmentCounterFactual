import { BUY, SELL } from './actionTypes.js'

export function buyStock(payload) {
	return {
		type: BUY,
		payload
	}
}

export function sellStock(payload) {
	return {
		type: SELL,
		payload
	}
}
