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
      .domain([0, d3.max(timeseries, function(d) { return d[0]; })]);
  var y = d3.scale.linear()
      .range([height, 0])
      .domain([0, d3.max(timeseries, function(d) { return d[1]; })]);

  var xRadial = d3.scale.linear()
      .range([0, width])
      .domain([-2, 2]);
  var yRadial = d3.scale.linear()
      .range([height, 0])
      .domain([-2, 2]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");
  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("transform", "translate(" + width/2 + "," + 30 + ")")
      .style("text-anchor", "end")
      .text("Time (seconds)");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Movement (unknown units)");

  //  var tmax = d3.max(timeseries, function(d) { return d[0]; });
  tmax = 3600 * 12;
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
      .interpolate("linear")
      .x(function(d) { return x(d[0]); })
      .y(function(d) { return y(d[1]); });

  var radialLine = d3.svg.line()
      .x(function(d) {
        var xRaw = rcos(d[0], d[1], tmax);
        var xCoord = xRadial(xRaw);
        return xCoord;
      })
      .y(function(d) {
        var yRaw = rsin(d[0], d[1], tmax);
        var yCoord = yRadial(yRaw);
        return yCoord;
      });

  svg.append("path")
      .datum(timeseries)
      .attr("class", "line")
      .attr("d", line);

  svg.selectAll(".line")
      .transition()
      .delay(1000)
      .duration(1000)
      .attr("d", radialLine);

  svg.append("circle")
      .attr("cx", width/2)
      .attr("cy", width/2)
      .attr("r", x(1))
      .attr("class", ".axis");

  svg.append('g')
        .attr('transform','translate('+width/2+','+height/2+')')
        .selectAll('g')
        .data(d3.range(10))
        .enter()
        .append('g')
        .attr('transform',function(d,i){

          var yTranslate = yRadial(0.5);
          return 'translate(0,'+(-yTranslate)+') rotate('+ (i/10)*360 +' ' + 0 + ' ' + yTranslate + ')';
          
        })
        .append('line')
        .attr('stroke','black')
        .attr('x1',0)
        .attr('y1',10)
        .attr('x2',0)
        .attr('y2',-10);


});
