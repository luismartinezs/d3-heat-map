// Fetch the data from a remote point
let req, json;
const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
req = new XMLHttpRequest();
req.open("GET", url, true);
req.onload = () => {
  json = JSON.parse(req.responseText);
  makeMap(json);
};
req.send();

// Settings //

// Styles //
const chartStyles = {
  margin: {
    top: 60,
    right: 30,
    bottom: 70,
    left: 70
  }
};

const svgStyles = {
  w: 1000,
  h: 600,
  margin: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  }
};

chartStyles.w =
  svgStyles.w - chartStyles.margin.left - chartStyles.margin.right;
chartStyles.h =
  svgStyles.h - chartStyles.margin.top - chartStyles.margin.bottom;

// Create graph

let svg = d3
  .select(".svgWrapper")
  .append("svg")
  .attr("width", svgStyles.w)
  .attr("height", svgStyles.h);

// define title
svg
  .append("text")
  .attr("x", svgStyles.w / 2)
  .attr("y", chartStyles.margin.top / 2 - 5)
  .attr("text-anchor", "middle")
  .attr("id", "title")
  .style("font-size", "24px")
  .text("Monthly Global Land-Surface Temperature");

// define subtitle
svg
  .append("text")
  .attr("x", svgStyles.w / 2)
  .attr("y", chartStyles.margin.top / 2 + 20)
  .attr("text-anchor", "middle")
  .attr("id", "subtitle")
  .style("font-size", "16px")
  .text("1753 - 2015: base temperature 8.66℃");

// define Y axis title
svg
  .append("text")
  .attr("x", -(chartStyles.w / 2.5))
  .attr("y", chartStyles.margin.top / 2.4)
  .attr("transform", "rotate(-90)")
  .attr("text-anchor", "middle")
  .text("Months");

// define X axis title
svg
.append("text")
.attr("x", svgStyles.w / 2)
.attr("y", svgStyles.h - chartStyles.margin.bottom + 5)
.attr("text-anchor", "middle")
.text("Years");

function makeMap(data) {
  return data;
}
