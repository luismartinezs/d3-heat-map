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
const yearFormat = d3.timeFormat("%Y");
var monthFormat = d3.timeFormat("%B");

// Styles //
const chartStyles = {
  margin: {
    top: 90,
    right: 30,
    bottom: 120,
    left: 100
  }
};

const svgStyles = {
  w: 1250,
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
  .attr("x", -(chartStyles.w / 3.5))
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

  const colorScale = [
    {
      color: "rgb(49, 54, 149)",
      temp: 0
    },
    {
      color: "rgb(69, 117, 180)",
      temp: 2.8
    },
    {
      color: "rgb(116, 173, 209)",
      temp: 3.9
    },
    {
      color: "rgb(171, 217, 233)",
      temp: 5.0
    },
    {
      color: "rgb(224, 243, 248)",
      temp: 6.1
    },
    {
      color: "rgb(255, 255, 191)",
      temp: 7.2
    },
    {
      color: "rgb(254, 224, 144)",
      temp: 8.3
    },
    {
      color: "rgb(253, 174, 97)",
      temp: 9.5
    },
    {
      color: "rgb(244, 109, 67)",
      temp: 10.6
    },
    {
      color: "rgb(215, 48, 39)",
      temp: 11.7
    },
    {
      color: "rgb(165, 0, 38)",
      temp: 12.8
    }
  ];

  // X AXIS
  const xScale = d3
    .scaleTime()
    .range([0, chartStyles.w])
    .domain([
      d3.min(monthlyVariance, d => new Date().setFullYear(d.year, 0, 1)),
      d3.max(monthlyVariance, d => new Date().setFullYear(d.year + 1, 11, 31))
    ]);

  const xAxis = d3
    .axisBottom(xScale)
    .tickFormat(yearFormat)
    .tickArguments([d3.timeYear.every(10)]);

  // create X axis
  chart
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${chartStyles.h})`)
    .style("font-size", "14px")
    .call(xAxis);

  // Y AXIS
  const yScale = d3
    .scaleTime()
    .range([0, chartStyles.h])
    // .domain([new Date().setFullYear(2000, 11, 5), new Date().setFullYear(2001, 11, 14)]);
    .domain([new Date().setMonth(0, 1), new Date().setMonth(11, 31)]);

  const yAxisScale = d3
    .scaleTime()
    .range([0, chartStyles.h])
    .domain([
      new Date().setFullYear(2000, 11, 15),
      new Date().setFullYear(2001, 11, 14)
    ]);

  const yAxis = d3
    .axisLeft()
    .scale(yAxisScale)
    .tickFormat(monthFormat)
    .tickArguments([d3.timeMonth.every(1)]);

  // create Y axis
  chart
    .append("g")
    .attr("id", "y-axis")
    .style("font-size", "14px")
    .call(yAxis);

  // define subtitle
  svg
    .append("text")
    .attr("x", svgStyles.w / 2)
    .attr("y", chartStyles.margin.top / 2 + 20)
    .attr("text-anchor", "middle")
    .attr("id", "description")
    .style("font-size", "16px")
    .text(`${minYear} - ${maxYear}: base temperature ${data.baseTemperature}℃`);

  // make legend
  const legendStyles = {
    axis: {
      width: chartStyles.w / 3,
      numberOfTicks: 11
    },
    box: {
      height: 20
    }
  };

  legendStyles.box.width =
    legendStyles.axis.width / legendStyles.axis.numberOfTicks;

  // legend scale
  const legendScale = d3
    .scaleLinear()
    .range([0, legendStyles.axis.width])
    .domain([
      variance.min + data.baseTemperature,
      variance.max + data.baseTemperature
    ]);

  const ticksArray = arrayFromRange(
    variance.min + data.baseTemperature,
    variance.max + data.baseTemperature,
    legendStyles.axis.numberOfTicks
  );

  const legendAxis = d3
    .axisBottom()
    .scale(legendScale)
    .ticks(legendStyles.axis.numberOfTicks)
    .tickFormat(d3.format(".1f"))
    .tickValues(ticksArray.slice(1, this.length - 1));

  const legend = chart
    .append("g")
    .attr("id", "legend")
    .attr(
      "transform",
      `translate(0, ${chartStyles.h + chartStyles.margin.bottom / 2})`
    )
    .call(legendAxis);

  // add legend color boxes
  legend
    .selectAll()
    .data(ticksArray.slice(0, this.length - 1))
    .enter()
    .append("rect")
    .attr("class", "legendItem")
    .attr("x", d => legendScale(d) + 0.5)
    .attr("y", -legendStyles.box.height)
    .attr("width", legendStyles.box.width)
    .attr("height", legendStyles.box.height)
    .attr("fill", (d, index) => {
      return `${colorScale[index].color}`;
    })
    .attr("stroke", "black");

  // define tooltip
  const tooltipStyle = {
    offsetX: 10
  };

  let tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .attr("id", "tooltip")
    .style("opacity", 0);

  // add data boxes to chart
  chart
    .selectAll()
    .data(monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-year", d => d.year)
    .attr("data-month", d => d.month - 1)
    .attr("data-temp", d => data.baseTemperature + d.variance)
    .attr("x", d => xScale(new Date().setFullYear(d.year - 1)) + 1)
    .attr(
      "y",
      d => yScale(new Date().setMonth(d.month - 1)) - chartStyles.h / 24 - 2
    )
    .attr("height", chartStyles.h / 12 + 1)
    .attr("fill", d => {
      let colorRel = colorScale.filter(
        elem => elem.temp <= data.baseTemperature + d.variance
      );
      let color = colorRel[colorRel.length - 1].color;
      return color;
    })
    .attr("width", 4.5)
    .style("stroke", "none")
    .on("mouseover", function(d) {
      d3.select(this).style("stroke", "black");
      tooltip
        .attr("data-year", d.year)
        .style("opacity", 0.8)
        .html(
          `${d.year} - ${getMonthName(d.month)}<br/>${(
            data.baseTemperature + d.variance
          ).toFixed(1)}℃<br />${d.variance.toFixed(1)}℃`
        )
        .style("top", function() {
          return `${event.clientY}px`;
        })
        .style("left", function() {
          if (
            event.clientX + tooltipStyle.offsetX + this.clientWidth >
            document.documentElement.clientWidth
          ) {
            return `${event.clientX -
              tooltipStyle.offsetX -
              this.clientWidth}px`;
          } else {
            return `${event.clientX + tooltipStyle.offsetX}px`;
          }
        });
    })
    .on("mouseout", function() {
      d3.select(this).style("stroke", "none");
      tooltip.style("opacity", 0);
    });
}
