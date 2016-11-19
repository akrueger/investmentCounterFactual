export function buyStock(state, action) {
	const symbol = Object.keys(action.payload)[0]
	if(Object.keys(state).includes(symbol)) {
		return {...state,
			[symbol]: {
				date: action.payload[symbol].date,
				shares: state[symbol].shares + action.payload[symbol].shares,
				price: action.payload[symbol].price
			}
		}
	}
	return Object.assign({}, state, action.payload)
}

export function sellStock(state, action) {
	const symbol = Object.keys(action.payload)[0]
	if(Object.keys(state).includes(symbol)) {
		return {...state,
			[symbol]: {
				date: action.payload[symbol].date,
				shares: state[symbol].shares - action.payload[symbol].shares,
				price: action.payload[symbol].price
			}
		}
	}
	return Object.assign({}, state, action.payload)
}

export function reinvestDividend(state, action) {
	const symbol = Object.keys(action.payload)[0]
	const dividendYield = action.payload[symbol].dividendYield
	const price = action.payload[symbol].price
	const currentShares = state[symbol].shares
	return {...state,
		[symbol]: {
			date: action.payload[symbol].date,
			shares: ((dividendYield * currentShares) / price) + currentShares,
			price
		}
	}
}

export function splitStock(state, action) {
	const symbol = Object.keys(action.payload)[0]
	const splitRatio = action.payload[symbol].splitRatio
	const price = action.payload[symbol].price
	const currentShares = state[symbol].shares
	return {...state,
		[symbol]: {
			date: action.payload[symbol].date,
			shares: currentShares * splitRatio,
			price
		}
	}
}
