var margin = {top:0, right:0, bottom:0, left:0};
var height = 500 - margin.top - margin.bottom,
    width = 500 - margin.left - margin.right;

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
      .domain([-2, 2]);
  var y = d3.scale.linear()
      .range([height, 0])
      .domain([-2, 2]);

  var tmax = d3.max(timeseries, function(d) { return d[0]; });
  var smax = d3.max(timeseries, function(d) { return d[1]; });

  var rcos = function(t, s, tmax) {
    var theta = (t/tmax) * 2 * Math.PI;
    var sNorm = s/smax;
    var x = (sNorm + 1) * Math.cos(theta);
    console.log("t = " + t);
    console.log("s = " + s);
    console.log("theta = " + theta);
    console.log("sNorm = " + sNorm);
    console.log("x = " + x);
    return x;
  };

  var rsin = function(t, s, tmax) {
    var theta = (t/tmax) * 2 * Math.PI;
    var sNorm = s/smax;
    var y = (sNorm + 1) * Math.sin(theta);
    return y;
  };

  console.log(tmax);
  console.log(smax);

  var line = d3.svg.line()
      .x(function(d) {
        var xRaw = rcos(d[0], d[1], tmax);
        var xCoord = x(xRaw);
        return xCoord;
      })
      .y(function(d) {
        var yRaw = rsin(d[0], d[1], tmax);
        var yCoord = y(yRaw);
        return yCoord;
      });

  svg.append("path")
      .datum(timeseries)
      .attr("class", "line")
      .attr("d", line);

});
