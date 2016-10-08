import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import * as reducers from './reducers'

const initialState = {
	realPortfolio: {},
	hypoPortfolio: {}
}

const reducer = combineReducers(reducers)

const store = createStore(reducer, initialState, compose(
	applyMiddleware(),
	window.devToolsExtension ? window.devToolsExtension() : f => f
))

export default store
