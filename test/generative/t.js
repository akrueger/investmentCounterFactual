import test from 'ava'
import {check, property, gen} from 'testcheck'

const options = {
	times: 1000
	// maxSize: undefined,
	// seed: undefined
}

const report = check(
	property(
		[gen.int],
		x => x - x === 0
	)
, options)

test('testcheck', t =>
	(report.result ? t.pass() : t.fail(JSON.stringify(report)))
)
