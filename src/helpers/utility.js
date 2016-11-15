import moment from 'moment'

export function flatten(array) {
	return array.reduce((a, b) =>
		a.concat(b)
	)
}

export function formatDate(date) {
	return moment(date).format('YYYY-MM-DD')
}

export function removeStrings(transactions) {
	return transactions.map(element => (
		{
			date: element.date,
			shares: parseFloat(element.shares),
			symbol: element.symbol,
			transaction: element.transaction
		}
	))
}

export function lowerCase(transactions, fields) {
	return transactions.map(element => {
		// REFACTOR -- can it be cleaner or more straightforward?
		const obj = {}
		fields.forEach(key => {
			if(key.toLowerCase() === 'transaction') {
				obj[key.toLowerCase()] = element[key].toLowerCase()
			}
			else if(key.toLowerCase() === 'symbol') {
				obj[key.toLowerCase()] = element[key].toUpperCase()
			}
			else {
				obj[key.toLowerCase()] = element[key]
			}
		})
		return obj
	})
}

export function sortByDate(transactions) {
	return transactions.sort((a, b) =>
		moment(a.date).diff(b.date)
	)
}

export function binarySearch(array, element) {
	let low = 0
	let high = array.length - 1
	while(low <= high) {
		const mid = Math.floor((low + high) / 2)
		const guess = formatDate(array[mid].date)
		if(guess === element) {
			return array[mid]
		}
		if(guess > element) {
			high = mid - 1
		}
		else {
			low = mid + 1
		}
	}
	return undefined
}
