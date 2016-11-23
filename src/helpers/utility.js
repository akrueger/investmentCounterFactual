import moment from 'moment'
import findEaster from './easter'

export function flatten(array) {
	return array.reduce((a, b) =>
		a.concat(b)
	)
}

export function formatDate(date) {
	return moment(date).format('YYYY-MM-DD')
}

export function formSplitDate(split) {
	const date = split.substr(0, 10)
	const dateRegEx = /\b\d{2}[/]?\d{2}[/]?\d{4}\b/
	return dateRegEx.test(date) ?
		moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD') :
		moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD')
}

export function removeStrings(transactions) {
	return transactions.map(element => (
		{
			date: formatDate(element.date),
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

export function findLastTradeDate(target) {
	if(isDynamicHoliday(target) || isStaticHoliday(target) || isWeekend(target)) {
		findLastTradeDate(target.subtract(1, 'day'))
	}
	return formatDate(target)
}

function isDynamicHoliday(date) {
	// MLK, Washington's Birthday, Good Friday, Memorial Day, Labor Day, Thanksgiving
	const dynamicHolidays = ['1-3-1', '2-3-1', '5-5-1', '9-1-1', '11-4-4']
	const monthOfYear = date.month() + 1
	const weekOfMonth = Math.ceil(date.date() / 7)
	const dayOfWeek = date.day()
	const test = `${monthOfYear}-${weekOfMonth}-${dayOfWeek}`
	if(dynamicHolidays.includes(test)) {
		return true
	}
	return false
}

function isStaticHoliday(date) {
	// New Year's Day, Independence Day, Christmas
	const holidays = ['01-01', '07-04', '12-25']
	const goodFriday = findGoodFriday(date.year())
	holidays.push(goodFriday.format('MM-DD'))
	const monthOfYear = date.month() + 1
	const dayOfMonth = date.date()
	const test = `${monthOfYear}-${dayOfMonth}`
	if(holidays.includes(test)) {
		return true
	}
	return false
}

function findGoodFriday(year) {
	return findEaster(year).subtract(2, 'days')
}

function isWeekend(date) {
	const dayOfWeek = date.day()
	if(dayOfWeek === 0 || dayOfWeek === 6) {
		return true
	}
	return false
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
