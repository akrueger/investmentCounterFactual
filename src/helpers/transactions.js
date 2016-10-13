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
