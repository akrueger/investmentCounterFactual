import _map from 'lodash.map'
import moment from 'moment'
import Papa from 'papaparse'
import store from './store.js'
import { buyStock, sellStock } from './actionCreators.js'

const uri = '/api'
const date = '2014-12-02'
const symbols = 'VWO'

fetch(`${uri}?date=${date}&symbols=${symbols}`)
.then(response =>
  console.log(response)
)
.catch(error => {
	console.log(error)
})

// const options = {
// 	uri: '/',
// 	qs: {
// 		access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'
// 	},
// 	headers: {
// 		'User-Agent': 'Request-Promise'
// 	},
// 	json: true
// }

// rp(options)
// 	.then(repos => {
// 		console.log('User has %d repos', repos.length)
// 	})
// 	.catch(error => {
// 			// API call failed...
// 	})

// const initialState = {
// 	realPortfolio: {

// 	},
// 	hypoPortfolio: {

// 	}
// }

const calculateButton = document.getElementById('calculateButton')
calculateButton.addEventListener('click', handleCalculation, false)

const portfolioInput = document.getElementById('fileInput')
portfolioInput.addEventListener('change', handleFiles, false)

function handleFiles() {
	const options = {
		header: true
	}
	const file = this.files[0]
	const reader = new FileReader()
	reader.onload = () => {
		const json = Papa.parse(reader.result.trim(), {header: options.header})
		processData(json)
	}
	reader.onerror = () => {
		throw new Error('Error reading CSV file')
	}
	reader.readAsText(file)
}

function handleCalculation() {
	const hypoInput = document.getElementById('textInput')
}

function processData(data) {
	const sortedData = sortByDate(data)
	dispatchActions(sortedData)
}

function sortByDate(transactions) {
	return transactions.data.sort((a, b) =>
		moment(a.DATE).diff(b.DATE)
	)
}

function dispatchActions(sortedData) {
	sortedData.forEach(element => {
		if(element.TRANSACTION.toUpperCase() === 'BUY') {
			store.dispatch(buyStock({
				[element.SYMBOL]: {
					shares: parseInt(element.SHARES, 10),
					price: parseFloat(element.PRICE)
				}
			}))
		}
		else if(element.TRANSACTION.toUpperCase() === 'SELL') {
			store.dispatch(sellStock({
				[element.SYMBOL]: {
					shares: element.SHARES,
					price: element.PRICE
				}
			}))
		}
	})
}

// function calculateWorth() {
// 	_map(store.getState(), element =>
// 		element.shares * element.price
// 	)
// 	.reduce((previous, current) =>
// 		previous + current
// 	)
// }
