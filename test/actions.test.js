import test from 'ava'
import * as actionCreators from '../src/actionCreators'
import * as actionTypes from '../src/actionTypes'

/*
When testing action creators we want to test whether the correct action
creator was called and also whether the right action was returned.
*/

test('buy action', t => {
	const payload = {
		VTI: {
			shares: 3,
			price: 34.29
		}
	}
	const expectedAction = {
		type: actionTypes.BUY,
		payload
	}
	t.deepEqual(actionCreators.buyStock(payload), expectedAction)
})

test('sell action', t => {
	const payload = {
		VTI: {
			shares: 3,
			price: 34.29
		}
	}
	const expectedAction = {
		type: actionTypes.SELL,
		payload
	}
	t.deepEqual(actionCreators.sellStock(payload), expectedAction)
})
