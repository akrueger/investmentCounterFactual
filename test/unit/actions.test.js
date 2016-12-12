import test from 'ava'
import * as actionCreators from '../../src/actionCreators'
import * as actionTypes from '../../src/actionTypes'

/*
When testing action creators we want to test whether the correct action
creator was called and also whether the right action was returned.
*/

test('buy real action', t => {
	const payload = {
		VTI: {
			shares: 3,
			price: 34.29
		}
	}
	const expectedAction = {
		type: actionTypes.buyReal,
		payload
	}
	t.deepEqual(actionCreators.buyRealStock(payload), expectedAction)
})

test('sell real action', t => {
	const payload = {
		VTI: {
			shares: 3,
			price: 34.29
		}
	}
	const expectedAction = {
		type: actionTypes.sellReal,
		payload
	}
	t.deepEqual(actionCreators.sellRealStock(payload), expectedAction)
})
