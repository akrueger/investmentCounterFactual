const koa = require('koa')
const router = require('koa-router')()
const logger = require('koa-logger')
const webpackDevServer = require('koa-webpack-dev')
const yahooFinance = require('yahoo-finance')
const moment = require('moment')

const app = koa()
app.use(logger())

router.get('/api', function * (next) {
	const beginDate = this.query.beginDate
	const endDate = this.query.endDate
	const period = this.query.period
	let inputSymbols = this.query.symbols
	if(!Array.isArray(inputSymbols)) {
		inputSymbols = [inputSymbols]
	}
	this.body = yield yahooFinance.historical({
		symbols: inputSymbols,
		from: beginDate,
		to: endDate,
		period
	}).then(response =>
		response
	).catch(error => {
		this.body = { message: error.message }
		this.status = error.status || 500
	})
})

app.use(router.routes())
app.use(router.allowedMethods())
app.use(webpackDevServer({
	config: './webpack.config.js'
}))

app.listen(2333)

// moment().format('YYYY-MM-DD')

// 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
