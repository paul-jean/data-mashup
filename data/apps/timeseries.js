var width = 420,
    barHeight = 20;
var x = d3.scale.linear()
    .range([0, width]);
var chart = d3.select(".chart")
    .attr("width", width);

d3.csv("apps-hourly-20140304-20140407.csv", type, function(error, data) {
  if (error) throw(error);
  x.domain([0, d3.max(data, function(d) {
    return d.duration;
  })]);
  chart.attr("height", barHeight * data.length);
  var bar = chart.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d, i) {
        return "translate(0," + i * barHeight + ")";
      });
  bar.append("rect")
      .attr("width", function(d) {
        return x(d.duration);
      })
      .attr("height", barHeight - 1);
  bar.append("text")
      .attr("x", function(d) { return x(d.duration) - 3; })
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
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

