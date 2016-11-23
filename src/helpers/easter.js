export default function findEaster(year) {
	const a = (year / 100 | 0) * 1483 - (year / 400 | 0) * 2225 + 2613
	const b = ((year % 19 * 3510 + (a / 25 | 0) * 319) / 330 | 0) % 29
	const c = 148 - b - ((year * 5 / 4 | 0) + a - b) % 7
	return moment({year, month: (c / 31 | 0) - 1, day: c % 31 + 1})
}
