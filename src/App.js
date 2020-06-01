import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3'
import './App.css';

function App() {
  const svgRef = useRef();

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
      .then(response => response.json())
      .then(
        (result) => {
          renderD3(result, svgRef)
        }
      )
  }, [])

  return (
    <div class="container">
      <h1 id="title">Doping in Professional Bicycle Racing</h1>
      <svg ref={svgRef}></svg>
    </div>
  );
}

const renderD3 = (data, svg) => {
  if (data.length > 1) {

    // Set main SVG area values
    let margin = {top: 20, right: 20, bottom: 50, left: 60};
    let height = 500 - margin.top - margin.bottom;
    let width = 700;

    // GRAB DEM MIN MAX TIMES BOIIIIIIIIII
    let minTime = d3.min(data, d => {
      let time = d["Time"].split(':')
      return new Date(2020, 1, 1, 0, parseInt(time[0]), parseInt([time[1]]));
    });

    let maxTime = d3.max(data, d => {
      let time = d["Time"].split(':')
      return new Date(2020, 1, 1, 0, parseInt(time[0]), parseInt([time[1]]));
    });

    // GRAB DEM MIN MAX YEARS BOIIIIIIIIIIIIIHJFREWOHBFOIWERQGBF9F8 REEEEEEEEEEEE!
    let minYear = d3.min(data, d => (d["Year"]));
    let maxYear = d3.max(data, d => (d["Year"]));


    // X Scale and Axis
    let xScale = d3.scaleLinear()
                   .domain([minYear-1, maxYear+1])
                   .range([0, width]);

    let xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'))

    // Y Scale and Axis
    let yScale = d3.scaleTime()
                   .domain([minTime, maxTime])
                   .range([0, height])

    let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));


    // This is the ENTIRE CHART
    let chart = d3.select(svg.current)
                  .attr("width", width + margin.right + margin.left)
                  .attr("height", height + margin.top + margin.bottom);


    // This is the main SVG AREA
    let main = chart.append('g')
                    .attr("transform", `translate(${margin.left}, ${margin.top})`)
                    .attr("width", width)
                    .attr("height", height)
                    .attr("class", "main");

        
    // Render the X Axis
    main.append('g')
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);


    // Render the Y Axis
    main.append('g')
        .attr("id", "y-axis")
        .call(yAxis);

    // Set dat legend!
    let legend = main.append('g')
                     .attr("id", "legend")
                     .attr("transform", "translate(0,250)")

                      legend.append('g')
                      .attr('class', 'legend-label1')
                      .append("text")
                      .text("No doping allegations")
                      .attr("font-size", 10)
                      .attr('x', 570)
                      .attr('y', 22)
              // Label 1
                      legend.select(".legend-label1")
                      .append('rect')
                      .attr("height", 18)
                      .attr("width", 18)
                      .attr('x', 669)
                      .attr('y', 10)
                      .attr("fill", "green")
                      
            // Label 2
                      legend.append('g')
                      .attr('class', 'legend-label2')
                      .append("text")
                      .text("Riders with doping allegations")
                      .attr("font-size", 10)
                      .attr('x', 537)
                      .attr('y', 53)
              
                      legend.select(".legend-label2")
                      .append('rect')
                      .attr("height", 18)
                      .attr("width", 18)
                      .attr('x', 669)
                      .attr('y', 40)
                      .attr("fill", "red")


    let div = d3.select(".container").append('div')
                .attr("class", "tooltip")
                .attr("id", "tooltip")
                .style("opacity", 0);

    // DAMNNNNN LOOK AT THOSE DOTS!!!
    main
      .selectAll('.dot')
      .data(data)
      .join("circle")
      .attr("class", "dot")
      .attr("cx", value => xScale(value["Year"]))
      .attr("cy", value => {
        let time = value["Time"].split(':')
        let newTime = new Date(2020, 1, 1, 0, parseInt(time[0]), parseInt([time[1]]));
        return yScale(newTime)
      })
      .attr("data-xvalue", value => value["Year"])
      .attr("data-yvalue", value => {
        let time = value["Time"].split(':')
        let newTime = new Date(2020, 1, 1, 0, parseInt(time[0]), parseInt([time[1]]));
        return newTime
      })
      .attr('r', 5)
      .attr("fill", value => value["Doping"] === "" ? "green" : "red")
      .attr("stroke", "black")

      .on("mouseover", value => {
        div.style("opacity", 0.9)
        div.html(value["Name"] + ": " + value["Nationality"] + "<br/>"
                 + "Year: " + value["Year"] + ", " + value["Time"] + "<br/>" 
                 + value["Doping"])
           .style("left", (d3.event.pageX) + "px")
           .style("top", (d3.event.pageY - 80) + "px");
           div.attr("data-year", value["Year"])

        // main
        //   .selectAll(".tooltip")
        //   .data([value])
        //   .join('text')
        //   .attr('x', 400)
        //   .attr('y', 40)
        //   .attr("class", "tooltip")
        //   .attr('id', "tooltip")
        //   .attr("data-year", value => value["Year"])
        //   .text(`${value["Name"]}: ${value["Nationality"]}`)
      })
      .on("mouseleave", () => { div.style("opacity", 0) .style("top", 0) })
  }
}

export default App;
