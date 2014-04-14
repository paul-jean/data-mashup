var margin = {top: 20, right: 30, bottom: 20, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
var y = d3.scale.linear()
    .range([height, 0]);
var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("apps-hourly.csv", type, function(error, data) {
  if (error) throw(error);

  var x = d3.scale.linear()
      .domain([0, width])
      .range([0, width]);
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");
  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  y.domain([0, d3.max(data, function (d) { return d.duration; })]);
  var barWidth = width / data.length;

  var bar = chart.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d, i) {
        return "translate(" + i * barWidth + ", 0)";
      });

  bar.append("rect")
      .attr("y", function (d) { return y(d.duration); })
      .attr("height", function(d) {
        return height - y(d.duration);
      })
      .attr("width", barWidth - 1);

  bar.append("text")
      .attr("y", function(d) { return y(d.duration) + 3; })
      .attr("x", barWidth / 2)
      .attr("dy", ".75em")
      .text(function(d) { return d.duration; });
});

function type(d) {
  var t = {};
  t.date = d['Date'];
  t.duration = +(d['Time Spent (seconds)']);
  t.activity = d['Activity'];
  if (t.activity.match(/iterm/i))
     return t;
}


