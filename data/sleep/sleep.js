var margin = {top:20, right:20, bottom:30, left:50};
var height = 500 - margin.top - margin.bottom,
    width = 900 - margin.left - margin.right;

var svg = d3.select('body').append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("./sleep-quality.json", function(err, json) {
  var events = json[0].events;
  var timeseries = [];
  events.forEach(function (d, i) {
    if(d[1] === 1) {
      timeseries.push([d[0], d[2]]);
    }
  });
  var x = d3.scale.linear()
      .range([0, width])
      .domain([0, d3.max(timeseries, function(d) { return d[0]; })]);
  var y = d3.scale.linear()
      .range([height, 0])
      .domain([0, d3.max(timeseries, function(d) { return d[1]; })]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");
  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  var line = d3.svg.line()
      .interpolate("linear")
      .x(function(d) { return x(d[0]); })
      .y(function(d) { return y(d[1]); });
  svg.append("path")
      .datum(timeseries)
      .attr("class", "line")
      .attr("d", line);

  var circles = svg.selectAll("g")
      .data(timeseries)
    .enter().append("g")
      .attr("transform", function(d, i) {
        return "translate(" + x(d[0]) + ", " + y(d[1]) + ")";
      });
  circles.append("circle")
      .attr("r", 1)
      .attr("style", "fill:none; stroke:#000; stroke-width:1px");
});
