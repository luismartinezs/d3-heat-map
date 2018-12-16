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
const YearFormat = d3.timeFormat("%Y");

// Styles //
const chartStyles = {
  margin: {
    top: 60,
    right: 30,
    bottom: 100,
    left: 90
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
  .attr("y", svgStyles.h - chartStyles.margin.bottom + 35)
  .attr("text-anchor", "middle")
  .text("Years");

// Add chart to svg
let chart = svg
  .append("g")
  .attr("class", "chart")
  .attr(
    "transform",
    `translate(${chartStyles.margin.left}, ${chartStyles.margin.top})`
  );

function makeMap(data) {
  let { monthlyVariance } = data;

  let minYear = d3.min(monthlyVariance, d => d.year);
  let maxYear = d3.max(monthlyVariance, d => d.year);

  let variance = {};
  
  variance.min = d3.min(monthlyVariance, d => d.variance);
  variance.max = d3.max(monthlyVariance, d => d.variance);

  console.log(variance);

  // X AXIS
  const xScale = d3
    .scaleTime()
    .range([0, chartStyles.w])
    .domain([
      d3.min(monthlyVariance, d => new Date().setFullYear(d.year)),
      d3.max(monthlyVariance, d => new Date().setFullYear(d.year))
    ]);

  // create X axis
  chart
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${chartStyles.h})`)
    .call(d3.axisBottom(xScale).tickFormat(YearFormat));

  // Y AXIS
  const yScale = d3
    .scaleTime()
    .range([0, chartStyles.h])
    .domain([
      d3.min(monthlyVariance, d => new Date().setMonth(d.month - 1)),
      d3.max(monthlyVariance, d => new Date().setMonth(d.month - 1))
    ]);

  // create Y axis
  chart
    .append("g")
    .attr("id", "y-axis")
    .call(d3.axisLeft(yScale));

  // define subtitle
  svg
    .append("text")
    .attr("x", svgStyles.w / 2)
    .attr("y", chartStyles.margin.top / 2 + 20)
    .attr("text-anchor", "middle")
    .attr("id", "subtitle")
    .style("font-size", "16px")
    .text(`${minYear} - ${maxYear}: base temperature ${data.baseTemperature}℃`);

  const barStyle = {
    color: "#c4755d",
  };

  chart
    .selectAll()
    .data(monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-year", d => d.year)
    .attr("data-month", d => d.month)
    .attr("data-variance", d => d.variance)
    .attr("x", d => xScale(new Date().setFullYear(d.year)))
    .attr("y", d => yScale(new Date().setMonth(d.month - 1)))
    .attr("height", chartStyles.h / 12)
    .attr("fill", barStyle.color)
    .attr("width", 5)
    .style('border', 'none')
    .on("mouseover", function(d) {
        d3.select(this).style("border", "1px solid black")
    //   tooltip
    //     .style("opacity", 0.8)
    //     .html(
    //       `${d[0].split("-")[0]} Q${Math.ceil(
    //         d[0].split("-")[1] / 3
    //       )}<br/>$${d[1].toFixed(1)} Billion`
    //     )
    //     .style("left", function() {
    //       if (
    //         event.clientX + tooltipStyle.margin.left + tooltipStyle.width <
    //         document.documentElement.clientWidth
    //       ) {
    //         return `${event.clientX + tooltipStyle.margin.left}px`;
    //       } else {
    //         return `${event.clientX -
    //           tooltipStyle.margin.left -
    //           tooltipStyle.width}px`;
    //       }
    //     })
    //     .attr("data-date", this.dataset.date);
    })
    .on("mouseout", function() {
      d3.select(this).style('border', 'none');
    //   tooltip.style("opacity", 0);
    });
}
