import { createStore, compose, applyMiddleware } from 'redux'
import createLogger from 'redux-logger'
import _map from 'lodash.map'
// const moment = require('moment')
// import Converter = require('csvtojson').Converter
import seedData from '../assets/seedData.json'

const BUY = 'BUY'
const SELL = 'SELL'

function buyStock(payload) {
	return {
		type: BUY,
		payload
	}
}

function sellStock(payload) {
	return {
		type: SELL,
		payload
	}
}

function calculateWorth(state) {
	return _map(state, element =>
		element.shares * element.price
	)
	.reduce((previous, current) =>
		previous + current
	)
}

function portfolioReducer(state = {}, action) {
	if(action.payload) {
		const symbol = Object.keys(action.payload)[0]
		switch(action.type) {
			case BUY:
				if(Object.keys(state).includes(symbol)) {
					return Object.assign({}, state, {
						[symbol]: {
							shares: state[symbol].shares + action.payload[symbol].shares,
							price: action.payload[symbol].price
						}
					})
				}
				return Object.assign({}, state, action.payload)
			case SELL:
				return state
			default:
				return state
		}
	}
	return state
}

const logger = createLogger()
const store = createStore(portfolioReducer, compose(
	applyMiddleware(logger),
	window.devToolsExtension ? window.devToolsExtension() : f => f
))

// const portfolio = {}

// const readCSV = () => {
// 	const converter = new Converter({})
// 	converter.fromFile('./seedData.csv', (error, result) => {
// 		result.forEach(element => {
// 			portfolio[element.SYMBOL] = {
// 				SHARES: 0
// 			}
// 		})
// 		_.map(portfolio, (objElement, key) =>
// 			result.forEach(arrayElement => {
// 				if(key === arrayElement.SYMBOL) {
// 					objElement.SHARES += arrayElement.SHARES
// 				}
// 			})
// 		)
// 	})
// }

// readCSV()

seedData.forEach(element => {
	if(element.TRANSACTION === 'BUY') {
		store.dispatch(buyStock({
			[element.SYMBOL]: {
				price: element.PRICE,
				shares: element.SHARES
			}
		}))
	}
})

calculateWorth(store.getState())
