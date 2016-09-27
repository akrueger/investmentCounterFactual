import test from 'ava'
import reducer from '../src/reducer.js'
import * as actionTypes from '../src/actionTypes'

test('empty action', t => {
	const expectedState = {}
	t.deepEqual(reducer(undefined, {}), expectedState)
})

test('buy action', t => {
	const action1 = {
		type: actionTypes.BUY,
		payload: {
			VTI: {
				shares: 7,
				price: 29.19
			}
		}
	}
	const action2 = {
		type: actionTypes.BUY,
		payload: {
			VWO: {
				shares: 15,
				price: 19.39
			}
		}
	}
	const action3 = {
		type: actionTypes.BUY,
		payload: {
			VTI: {
				shares: 3,
				price: 29.19
			}
		}
	}
	const expectedState1 = {
		VTI: {
			shares: 7,
			price: 29.19
		}
	}
	const expectedState2 = {
		VTI: {
			shares: 7,
			price: 29.19
		},
		VWO: {
			shares: 15,
			price: 19.39
		}
	}
	const expectedState3 = {
		VTI: {
			shares: 10,
			price: 29.19
		},
		VWO: {
			shares: 15,
			price: 19.39
		}
	}
	t.deepEqual(reducer({}, action1), expectedState1)
	t.deepEqual(reducer(expectedState1, action2), expectedState2)
	t.deepEqual(reducer(expectedState2, action3), expectedState3)
})

test('sell action', t => {
	const initialState = {
		VTI: {
			shares: 10,
			price: 29.19
		}
	}
	const action = {
		type: actionTypes.SELL,
		payload: {
			VTI: {
				shares: 7,
				price: 29.19
			}
		}
	}
	const expectedState = {
		VTI: {
			shares: 3,
			price: 29.19
		}
	}
	t.deepEqual(reducer(initialState, action), expectedState)
})
