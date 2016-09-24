import { createStore, compose, applyMiddleware } from 'redux'
import portfolioReducer from './reducer'

const store = createStore(portfolioReducer, compose(
	applyMiddleware(),
	window.devToolsExtension ? window.devToolsExtension() : f => f
))

export default store
