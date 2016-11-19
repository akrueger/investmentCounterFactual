import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import createLogger from 'redux-logger'
import * as reducers from './reducers'

const initialState = {
	realSecurities: {},
	hypoSecurities: {},
	realWorth: {},
	hypoWorth: {}
}

const logger = createLogger()

const reducer = combineReducers(reducers)

const store = createStore(reducer, initialState, compose(
	applyMiddleware(logger),
	window.devToolsExtension ? window.devToolsExtension() : f => f
))

export default store
