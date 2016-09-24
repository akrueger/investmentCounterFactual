import test from 'ava'

test('foo', t => {
	t.pass()
})

test('bar', t => {
	const bar = 'bar'

	t.is(bar, 'bar')
})
