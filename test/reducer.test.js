import test from 'ava'
import * as reducers from '../src/reducers.js'
import * as actionTypes from '../src/actionTypes'

test('empty action', t => {
	const expectedState = {}
	t.deepEqual(reducers.realPortfolio(undefined, {}), expectedState)
	t.deepEqual(reducers.hypoPortfolio(undefined, {}), expectedState)
})

test('buy action', t => {
	const action1 = {
		type: actionTypes.buyReal,
		payload: {
			VTI: {
				date: '2016-03-23',
				shares: 7,
				price: 29.19
			}
		}
	}
	const action2 = {
		type: actionTypes.buyReal,
		payload: {
			VWO: {
				date: '2016-04-10',
				shares: 15,
				price: 19.39
			}
		}
	}
	const action3 = {
		type: actionTypes.buyReal,
		payload: {
			VTI: {
				date: '2016-06-28',
				shares: 3,
				price: 29.19
			}
		}
	}
	const expectedState1 = {
		VTI: {
			date: '2016-03-23',
			shares: 7,
			price: 29.19
		}
	}
	const expectedState2 = {
		VTI: {
			date: '2016-03-23',
			shares: 7,
			price: 29.19
		},
		VWO: {
			date: '2016-04-10',
			shares: 15,
			price: 19.39
		}
	}
	const expectedState3 = {
		VTI: {
			date: '2016-06-28',
			shares: 10,
			price: 29.19
		},
		VWO: {
			date: '2016-04-10',
			shares: 15,
			price: 19.39
		}
	}
	t.deepEqual(reducers.realPortfolio({}, action1), expectedState1)
	t.deepEqual(reducers.realPortfolio(expectedState1, action2), expectedState2)
	t.deepEqual(reducers.realPortfolio(expectedState2, action3), expectedState3)
})

test('sell action', t => {
	const initialState = {
		VTI: {
			date: '2016-08-20',
			shares: 10,
			price: 29.19
		}
	}
	const action = {
		type: actionTypes.sellReal,
		payload: {
			VTI: {
				date: '2016-08-22',
				shares: 7,
				price: 29.19
			}
		}
	}
	const expectedState = {
		VTI: {
			date: '2016-08-22',
			shares: 3,
			price: 29.19
		}
	}
	t.deepEqual(reducers.realPortfolio(initialState, action), expectedState)
})
