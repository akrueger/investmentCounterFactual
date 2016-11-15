const koa = require('koa')
const router = require('koa-router')()
const logger = require('koa-logger')
const webpackDevServer = require('koa-webpack-dev')
const yahooFinance = require('yahoo-finance')
const xray = require('x-ray')
const moment = require('moment')

const app = koa()
app.use(logger())

router.get('/api/quote', function * (next) {
	const beginDate = this.query.beginDate
	const endDate = this.query.endDate
	const period = this.query.period
	const inputSymbols = (this.query.symbols).split(',')
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

router.get('/api/split', function * (next) {
	const x = xray()
	const url = 'https://au.finance.yahoo.com/q/bc?s='
	const symbol = this.query.symbol
	this.body = yield new Promise((resolve, reject) =>
		x(`${url}${symbol}`, 'nobr', ['nobr'])((error, splitHistory) =>
			resolve(splitHistory)
		)
	).then(response =>
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
