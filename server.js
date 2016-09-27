const koa = require('koa')
const router = require('koa-router')()
const logger = require('koa-logger')
const webpackDevServer = require('koa-webpack-dev')
const yahooFinance = require('yahoo-finance')
const moment = require('moment')

const app = koa()
app.use(logger())

router.get('/api', function * (next) {
	const date = this.query.date
	let inputSymbols = this.query.symbols
	if(!Array.isArray(inputSymbols)) {
		inputSymbols = [inputSymbols]
	}
	this.body = yield yahooFinance.historical({
		symbols: inputSymbols,
		from: date,
		to: date
	}).then(response =>
		response
	).catch(error =>
		console.log(error)
	)
})

app.use(router.routes())
app.use(router.allowedMethods())
app.use(webpackDevServer({
	config: './webpack.config.js',
	log: {
		level: 'verbose'
	}
}))

app.listen(2333)

// moment().format('YYYY-MM-DD')

// 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
