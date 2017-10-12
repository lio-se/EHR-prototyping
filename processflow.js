//Breadcrumb code inspired by https://bl.ocks.org/kerryrodden/766f8f6d31f645c39f488a0befa1e3c8

// Dimensions of visualisation.
var width = 1000;
var height = 150;

// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
var b = {
  w: 110, h: 50, s: 3, t: 10
};

// Mapping of step names to colors.
var colors = {
  "postponed": "red",
  "suspended": "orangered",
  "planned": "darkkhaki",
  "scheduled": "orange",
  "active": "mediumseagreen",
  "completed": "dodgerblue",
  "cancelled": "gray",
  "aborted": "gray"
};

// Total size of all segments; we set this later, after loading the data.
//var totalSize = 0; 

/*var vis = d3.select("#chart").append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .append("svg:g")
    .attr("id", "container")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
*/

function initialize(selectorString, width, height) {
  // Add the svg area.
  var trail = d3.select("#sequence").append("svg:svg")
      .attr("width", width)
      .attr("height", height)
      .attr("id", "trail");
  // Add the label at the end, for the percentage.
  trail.append("svg:text")
    .attr("id", "endlabel")
    .style("fill", "#000");
}

// Generate a string that describes the points of a breadcrumb polygon.
function breadcrumbPoints(d, i) {
  console.log("breadcrumbPoints",d,i);
  var points = [];
  points.push("0,0");
  points.push(b.w + ",0");
  points.push(b.w + b.t + "," + (b.h / 2));
  points.push(b.w + "," + b.h);
  points.push("0," + b.h);
  if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
    points.push(b.t + "," + (b.h / 2));
  }
  return points.join(" ");
}

// Update the breadcrumb trail to show the current sequence and percentage.
function update(nodeArray, percentageString) {

  // Data join; key function combines name and depth (= position in sequence).
  var trail = d3.select("#trail")
      .selectAll("g")
      .data(nodeArray, function(d) { return d.link; });

  // Remove exiting nodes.
  trail.exit().remove();

  // Add breadcrumb and label for entering nodes.
  var entering = trail.enter().append("svg:g");

  entering.append("svg:polygon")
      .attr("points", breadcrumbPoints)
      .style("fill", function(d) { return colors[d.state]; });    
//      .style("fill", function(d) { return colors[d.data.state]; });

  entering.append("svg:text")
      .attr("x", (b.w + b.t) / 2)
      .attr("y", b.h / 2)
      .attr("dy", "-1.1em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.name.substr(0,d.name.indexOf(' ')); });
//      .text(function(d) { return d.data.name; });
      
  entering.append("svg:text")
      .attr("x", (b.w + b.t) / 2)
      .attr("y", b.h / 2 )
      .attr("dy", "0.0em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.name.substr(d.name.indexOf(' ')+1); });

  entering.append("svg:text")
      .attr("x", (b.w + b.t) / 2)
      .attr("y", b.h / 2 )
      .attr("dy", "1.4em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.date; });

  // Merge enter and update selections; set position for all nodes.
  entering.merge(trail).attr("transform", function(d, i) {
    return "translate(" + i * (b.w + b.s) + ", 0)";
  });

  // Now move and update the percentage at the end.
  d3.select("#trail").select("#endlabel")
      .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
      .attr("y", b.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(percentageString);

  // Make the breadcrumb trail visible, if it's hidden.
  d3.select("#trail")
      .style("visibility", "");

}

//Start


    