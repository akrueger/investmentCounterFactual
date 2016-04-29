var dataset;

var handleFiles = function(files) {
  var file = files[0],
      reader = new FileReader();
  
  reader.onload = function (event) {
    //dataset = d3.csv.parse(reader.result);
    dataset = d3.csv.parseRows(reader.result);
    visualize();
  };
  reader.onerror = function (event) {
    throw 'Error reading CSV file';
  };
  
  reader.readAsText(file);
  
};

var visualize = function() {

  var sampleHTML = d3.select("#viz")
      .append("table")
      .style("border-collapse", "collapse")
      .style("border", "2px black solid")
  
      .selectAll("tr")
      .data(dataset)
      .enter().append("tr")
  
      .selectAll("td")
      .data(function(d){return d;})
      .enter().append("td")
      .style("border", "1px black solid")
      .style("padding", "5px")
      .on("mouseover", function(){d3.select(this).style("background-color", "aliceblue")})
      .on("mouseout", function(){d3.select(this).style("background-color", "white")})
      .text(function(d){return d;})
      .style("font-size", "12px");
      
};