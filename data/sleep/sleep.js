var height = 500,
    width = 500;

var svg = d3.select('body').append('svg');

svg.attr('height', height)
    .attr('width', width);
/*
svg.append('text')
    .attr('x', 10)
    .attr('y', 20)
    .text('hello world')
    .attr('fill', 'blue');
*/

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
  var line = d3.svg.line()
      .interpolate("linear")
      .x(function(d) { return x(d[0]); })
      .y(function(d) { return y(d[1]); });
  svg.append("path")
      .attr("d", line(timeseries))
      .attr("style", "fill:none; stroke:steelblue; stroke-width:1.5px");

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
