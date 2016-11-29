const cache = {}

export function setPrice(symbol, price) {
	cache[symbol] = {
		price
	}
}

export function getPrice(symbol) {
	return cache[symbol].price
}
