// Refactor
function portfolioReducer(state = {}, action) {
	if(action.payload) {
		const symbol = Object.keys(action.payload)[0]
		switch(action.type) {
			case 'BUY':
				if(Object.keys(state).includes(symbol)) {
					return Object.assign({}, state, {
						[symbol]: {
							shares: state[symbol].shares + action.payload[symbol].shares,
							price: action.payload[symbol].price
						}
					})
				}
				return Object.assign({}, state, action.payload)
			case 'SELL':
				if(Object.keys(state).includes(symbol)) {
					return Object.assign({}, state, {
						[symbol]: {
							shares: state[symbol].shares - action.payload[symbol].shares,
							price: action.payload[symbol].price
						}
					})
				}
				return Object.assign({}, state, action.payload)
			default:
				return state
		}
	}
	return state
}

export default portfolioReducer
