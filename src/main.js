import _map from 'lodash.map'
import moment from 'moment'
import Papa from 'papaparse'
import store from './store.js'
import { buyStock, sellStock } from './actionCreators.js'

const fileInput = document.getElementById('fileInput')
fileInput.addEventListener('change', handleFiles, false)

const worthButton = document.getElementById('worthButton')
worthButton.addEventListener('click', calculateWorth, false)

function handleFiles() {
	const file = this.files[0]
	const reader = new FileReader()
	reader.onload = () => {
		const json = Papa.parse(reader.result, {header: true})
		processData(json)
	}
	reader.onerror = () => {
		throw new Error('Error reading CSV file')
	}
	reader.readAsText(file)
}

// Papa.parse(seed, {
//  complete: results => {
//    console.log('Finished: ', results.data)
//  }
// })

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
					price: parseFloat(element.PRICE),
					shares: parseInt(element.SHARES, 10)
				}
			}))
		}
		else if(element.TRANSACTION.toUpperCase() === 'SELL') {
			store.dispatch(sellStock({
				[element.SYMBOL]: {
					price: element.PRICE,
					shares: element.SHARES
				}
			}))
		}
	})
}

function calculateWorth() {
	_map(store.getState(), element =>
		element.shares * element.price
	)
	.reduce((previous, current) =>
		previous + current
	)
}
