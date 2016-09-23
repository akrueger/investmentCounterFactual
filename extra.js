// const rowDataset = undefined
// const dataset = undefined

// const handleFiles = files => {
// 	let file = files[0],
// 	reader = new FileReader()
// 	reader.onload = function(event) {
// 		dataset = d3.csv.parse(reader.result)
// 		processData(dataset)
// 		rowDataset = d3.csv.parseRows(reader.result)
// 		visualizeTable()
// 	}
// 	reader.onerror = function(event) {
// 		throw 'Error reading CSV file'
// 	}

// 	reader.readAsText(file)

// }

// var visualizeTable = function() {

// 	var sampleHTML = d3.select("#viz")
// 			.append("table")
// 			.style("border-collapse", "collapse")
// 			.style("border", "2px black solid")

// 			.selectAll("tr")
// 			.data(rowDataset)
// 			.enter().append("tr")

// 			.selectAll("td")
// 			.data(function(d){return d})
// 			.enter().append("td")
// 			.style("border", "1px black solid")
// 			.style("padding", "5px")
// 			.on("mouseover", function(){d3.select(this).style("background-color", "aliceblue")})
// 			.on("mouseout", function(){d3.select(this).style("background-color", "white")})
// 			.text(function(d){return d})
// 			.style("font-size", "12px")

// }

// var processData = function(data) {
// 	var securities = []
// 	data.forEach(function(v, i, a) {
// 		if(securities.map(function(value, index, array) { return value.symbol }).indexOf(v.SYMBOL) < 0) {
// 			securities.push({
// 				symbol: v.SYMBOL,
// 				shares: 0
// 			})
// 		}
// 	})
// }
