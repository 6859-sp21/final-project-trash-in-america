// window.onload = function () {
//   var bulldozer = document.createElement('img')
//   bulldozer.setAttribute("src", "images/excavator.svg");
//   bulldozer.setAttribute("width", "20px")
//   bulldozer.setAttribute("height", "20px")

//   bulldozerDiv = document.getElementById("bulldozer")
//   for(let i=0; i<390; i++) {
//     bulldozerDiv.innerHTML += bulldozer.outerHTML;
//   }
// }
function handleNextPageClick() {
  url = window.location.href
  newurl = url.split('/').slice(0,-1).join('/')+'/us_state_landfill.html'
  window.location.href = newurl
}

function handleBackPageClick() {
  url = window.location.href
  newurl = url.split('/').slice(0,-1).join('/')+'/polar_area_chart.html'
  window.location.href = newurl
}

d3.select("#mapToCircle").on('click', function () {
  document.getElementById('circularPacking').scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'center'
  });})

d3.select("#barToMap").on('click', function () {
  document.getElementById('first').scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'center'
  });
})

function onSortChange () {
  sortValue = document.getElementById("selectSort").value
  drawCircularPacking()
  drawMap()
  document.getElementById('circularPacking').scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'center'
  });
  if (selectedCountries.length > 0) {
    drawCountryInfoChart()
  }
}

function onNumberChange () {
  drawCountryInfoChart()
}

var allData = {}
var selectedCountries = []
var circleVisCountryNames = new Set([]);
var globalTopo = null;
var sortValue = document.getElementById("selectSort").value
var selectedCountryCircle = null
var maxTotal = 0;
var maxPerPerson = 0;
var minTotal = Infinity;
var minPerPerson = Infinity
region_id_to_to_name = {
  LCN: "Latin America & Caribbean",
  SAS: "South Asia",
  ECS: "Europe & Central Asia",
  MEA: "Middle East & North Africa",
  EAS: "East Asia & Pacific",
  SSF: "Sub-Saharan Africa",
  NAC: "North America"
}


// The svg
var svg = d3.select(".map"),
    width = +svg.attr("width"),
    height = +svg.attr("height");    
var countries_g = svg.append("g").attr("class", "countries")
var legend_g = svg.append("g").attr("class", "mapLegendThreshold").attr("transform", "translate(700,20)");
var zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);
svg.call(zoom).on("wheel.zoom", null); // allow to drag map around but disable zoom

// var colorScale = d3.scaleLinear()
var colorScale = d3.scaleQuantile()
    // .domain([100000, 100/0000, 10000000, 30000000, 100000000, 500000000])
    .domain([3000, 300000000])
    // .domain([Math.log(minTotal), Math.log(maxTotal)])
    .range(["#ffdfd3", "#fec8d8", "#d291bc", "#957dad"])
    // .range(["#ffdfd3", "#fec8d8", "#d291bc", "#957dad"])
  // .range(["white", "pink", "red"])
console.log(d3.schemePuBuGn)
var colorScalePopulation = d3.scaleQuantile()
// var colorScalePopulation = d3.scaleLinear()

    // .domain([0, 2.0])
    .domain([0.02, 1.6])
  //   .range(d3.schemeBlues[7]);
  .range(["#ffdfd3", "#fec8d8", "#d291bc", "#957dad"])


var projection = d3.geoNaturalEarth()
    .scale(width /1.6/ Math.PI)
    .translate([width / 2-30, height / 2-20])
var path = d3.geoPath()
    .projection(projection);
function drawMap() {
    countries_g.selectAll("*").remove()
    legend_g.selectAll("*").remove()
    // Map and projection
    topo = globalTopo
    // var path = d3.geoPath();


    // Data and color scale

    var data = d3.map();

    // Legend
    if (sortValue === "totalMsw") {
      legend_g.append("text")
        .attr("class", "caption")
        .attr("x", 0)
        .attr("y", -6)
        .text("Total Waste (TONS)");
    } else {
      legend_g.append("text")
        .attr("class", "caption")
        .attr("x", 0)
        .attr("y", -6)
        .text("Total Waste Per Person (TONS)");
    }

  //   var labels = ['0-10K', '10K-100K', '100K-1M', '1M-3M', '3M-10M', '10M-50M', '> 1000'];
  //   var labelsPopulation = ["0.0.2", "0.2-0.4", "0.4-0.6", "0.6-0.8", "0.8-1.0"]

    var legend = d3.legendColor()
        .shapePadding(4)
    
    if (sortValue === "totalMsw") {
      legend.scale(colorScale).labelFormat(d3.format(".2s"))

    } else {
      legend.scale(colorScalePopulation)
    }
        // .scale(colorScale);
    svg.select(".mapLegendThreshold")
        .call(legend);

    countries_g
      .selectAll("path")
      .data(topo.features)
      .enter().append("path")
          .attr("fill", function (d){
              // Pull data for this country
              if (!(d.id in allData)) {
                return "#f4eeed" // data doesn't exist
              }
              d.total = allData[d.id] ? allData[d.id].total_msw : 0;
              d.population = allData[d.id] ? allData[d.id].population : 0;
              d.country_name = allData[d.id] ? allData[d.id].country_name : ""
              d.total_msw = allData[d.id] ? allData[d.id].total_msw : 0;
              d.region_name = allData[d.id] ? allData[d.id].region_name : ""
              d.total_per_person = allData[d.id] ? allData[d.id].total_per_person : 0
              d.country_code = allData[d.id] ? allData[d.id].country_code : ""
              // Set the color
              if (circleVisCountryNames.has(d.country_name)) {
                return "gray"
              }
              if (sortValue === "totalMsw") {
                return colorScale(d.total);

              } else {
                return colorScalePopulation(d.total_per_person);
              }
          })
          .attr('id', function (d) { return d.id})
          .attr('class', "mapCountry")
          .attr("d", path)
          .on("click", function(d) {
            if (!(d.id in allData)) {
              alert("No 2018 waste data available for that country - Please select another country")
              return            
            }

            if (circleVisCountryNames.has(d.country_name)) {
              if (sortValue === "totalMsw") {
                d3.select(this)
                .style("fill", colorScale(d.total));
              } else {
                d3.select(this)
                .style("fill", colorScalePopulation(d.total_per_person));
              }

            } else {
              d3.select(this)
              .style("fill", "gray");
            }

            clicked(allData[d.country_code])
          })
          .call(
            d3.helper.tooltip( // toltip
              function(d,i){
                return d.country_name ? d.country_name : d.properties.name + " (No data available)";
              }, false
            )
          )
} 

// zoom stuff for map
function zoomed() {
  var transform = d3.event.transform; 
  countries_g.style("stroke-width", 1.5 / transform.k + "px");
  countries_g.attr("transform", transform);
}

d3.select('#zoom-in').on('click', function() {
  // Smooth zooming
    zoom.scaleBy(svg.transition().duration(750), 1.3);
});

d3.select('#zoom-out').on('click', function() {
  // Ordinal zooming
  zoom.scaleBy(svg, 1 / 1.3);
});
  
d3.select('#zoom-reset').on('click', function() {
  reset()
});

function clickedCircle(d) {
  let selection = ".countries #" + d.country_code
  d3.select(selection).style("fill", "gray")
  // selectedCountries = selectedCountries.filter(c => {
  //   return c.country_name !== d.country_name
  // })

  selectedCountries.forEach(c => {
    country_code_selection2 = ".countries #" + c.country_code //unselect the current country removed (button.id == country_code)
    d3.select(country_code_selection2).style("fill", function(d){ 
      if (sortValue === "totalMsw") {
        return colorScale(c.total_msw)
      } else {
        return colorScalePopulation(c.total_msw)
      }            
    })
  })
  selectedCountries = [allData[d.country_code]]
  circleVisCountryNames = new Set([d.country_name])
  displayList()
  zoomOnCountry(d)

  document.getElementById('first').scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'center'
  });
}

function clicked(dAllDataFormat) {
  d = dAllDataFormat

  // if (! isCircleClick) { // if not circle click, reset the circle color
  //   let selection = ".node#" + d.country_code
  //   d3.select(selection).style("fill", color(d.region_name))
  // }
  if (circleVisCountryNames.has(d.country_name)) {
    circleVisCountryNames.delete(d.country_name)
    selectedCountries = selectedCountries.filter(c => {return c.country_name !== d.country_name})
  } else {
    circleVisCountryNames.add(d.country_name)
    selectedCountries.push(allData[d.country_code])
  }
  displayList()
}

function displayList() {
  text = ""
  selectedCountries.forEach(d=> {
    if (d.country_name && d.country_name.length > 0) {
      // funcCall = "removeCountryFromList(" + d.country_name + ")"
      text += "<button class='countryButton' onclick=removeCountryFromList(this) id='"  + d.country_code + "'>x&nbsp;&nbsp;&nbsp;" + d.country_name +"</button><br>"
    }
  })
  document.getElementById("selectedText").innerHTML = text
  // var element = document.getElementById("selectedText");
  // element.scrollTop = element.scrollHeight;
  var objDiv = document.getElementById("selectedText");
  objDiv.scrollTop = objDiv.scrollHeight;
}


function zoomOnCountry(d) {
  selection = "path#"+d.country_code
  d = null
  d3.select(selection).attr("class", function (datum) { d = datum})
  console.log(d)
  var bounds = path.bounds(d),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
      translate = [width / 2 - scale * x, height / 2 - scale * y];

  svg.transition()
      .duration(2000)
      .call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) ) 
      .transition()
      .duration(2000)
      .call( zoom.transform, d3.zoomIdentity) 
}

function reset() {
  svg
  .transition()
  .duration(1000)
  .call( zoom.transform, d3.zoomIdentity) 
}

function removeCountryFromList(button) {
  const found = selectedCountries.find(c => c.country_code === button.id);
  selectedCountries = selectedCountries.filter(c => c.country_code !== button.id);
  displayList()

  country_code_selection2 = ".countries #" + button.id //unselect the current country removed (button.id == country_code)
  d3.select(country_code_selection2).style("fill", function(d){ 
    if (sortValue === "totalMsw") {
      return colorScale(found.total_msw)
    } else {
      return colorScalePopulation(found.total_msw)
    }            
  })
}

// set the dimensions and margins of the bar graph
var width2 = 1000
var height2 = 800

// append the svg object to the body of the page
var circleVis = d3.select("#circularPacking")
  .append("svg")
    .attr("width", width2)
    .attr("height", height2)
    .attr('class', "circularPackingClass")

function clearList() {
  selectedCountries = []
  document.getElementById("selectedText").innerHTML = ""
  svg.selectAll("path").style("fill", function (d){
    return colorScale(d.total);
  })
}

var color = d3.scaleOrdinal()
    .domain(Object.values(region_id_to_to_name))
    .range(d3.schemeSet3)

function drawCircularPacking() {
  // Color palette for continents?
  d3.select(".circularPackingClass").selectAll("*").remove()
  circleData.sort(function(a,b){ return a.region_name.localeCompare(b.region_name) });

  // Size scale for countries
  var size = d3.scaleLinear()
  // var size = d3.scaleQuantize()
    .domain([minTotal, maxTotal])
    .range([15, 40])  // circle will be between 7 and 55 px wide
    // .range([10,  20, 30, 40, 50])
  var sizePopulation = d3.scaleLinear()
    .domain([minPerPerson, maxPerPerson])
    .range([15,40])
    // .range([10,  20, 30, 40, 50])
    
  // create a tooltip
  var Tooltip = d3.select("#tooltip")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("height", "300px")
    .style("width", "800px")


  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    Tooltip
      .style("opacity", 1)
  }
  var mousemove = function(d) {
    let text = '<u>' + d.country_name + '</u>' 
      + "<br>" + d.total_msw.toLocaleString() + " TONS of trash among"
      + "<br>" + d.population.toLocaleString() + " people means"
      + "<br>" + (d.total_msw/d.population).toLocaleString() + " TONS of trash per person"
    Tooltip
      .html(text)
      .style("left", (d3.mouse(this)[0]+20) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }

  var mouseleave = function(d) {
    // Tooltip
    //   .style("opacity", 0)
  }
  var elemEnter = 
    circleVis.append("g")
      .selectAll("circle")
      .data(circleData)
      .enter()

  // Initialize the circle: all located at the center of the svg area
  var node = elemEnter
    .append("circle")
      .attr("class", "node")
      .attr("id", function(d) { return d.country_code})
      .attr("class", "circleCountry")
      .attr("r", function(d){ 
        if (sortValue === "totalMsw") {
          return size(d.total_msw ? d.total_msw : 0)
        } else {
          return sizePopulation(d.total_per_person ? d.total_per_person : 0)
        }
      })
      .attr("cx", width2 / 2)
      .attr("cy", height2 / 2)
      .style("fill", function(d){ 
        if (selectedCountryCircle !== null && selectedCountryCircle.country_code === d.country_code) {
          return "gray"
        }
        return color(d.region_name)
      })
      .style("fill-opacity", 0.8)
      .attr("stroke", "black")
      .style("stroke-width", 1)
      .on("mouseover", mouseover) // What to do when hovered
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .on("click", function(d) {
        console.log(d)
        if (selectedCountryCircle !== null && selectedCountryCircle.country_code === d.country_code) {
          d3.select(this)
          .style("fill", color(d.region_name));

          country_code_selection2 = ".countries #" + selectedCountryCircle.country_code //unselect the current country in map selected
            d3.select(country_code_selection2).style("fill", function(d){ 
              if (sortValue === "totalMsw") {
                return colorScale(d.total)
              } else {
                return colorScalePopulation(d.total_per_person)
              }            
            })
            selectedCountryCircle = null
            
          selectedCountries = selectedCountries.filter(c => c.country_name !== d.country_name)
          circleVisCountryNames.delete(d.country_name)
          displayList()
          document.getElementById('first').scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });
        } else {
          if (selectedCountryCircle !== null) { // unselect the current circle selected 
            country_code_selection = ".node#" + selectedCountryCircle.country_code
            d3.select(country_code_selection).style("fill", function(d){ return color(selectedCountryCircle.region_name)})
            country_code_selection2 = ".countries #" + selectedCountryCircle.country_code //unselect the current country in map selected
            d3.select(country_code_selection2).style("fill", function(d){ 
              if (sortValue === "totalMsw") {
                return colorScale(d.total)
              } else {
                return colorScalePopulation(d.total_per_person)
              }            
            })
          }
          d3.select(this)
            .style("fill", "gray");
          clickedCircle(d)
          selectedCountryCircle = d
        }
      })
      .call(d3.drag() // call specific function when circle is dragged
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))

      .call(d3.helper.tooltip( // toltip
        function(d,i){ return d.country_name;
            }, true
      ))


  // Features of the forces applied to the nodes:
  var simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(width2 / 2).y(height2/ 2)) // Attraction to the center of the svg area
      .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
      .force("collide", d3.forceCollide().strength(.2).radius(function(d){ 
        if (sortValue === "totalMsw") {
          return (size(d.total_msw)+3) 
        } else {
          return (sizePopulation(d.total_per_person)+3)
        }
      }).iterations(1)) // Force that avoids circle overlapping

  // Apply these forces to the nodes and update their positions.
  // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.

  simulation
      .nodes(circleData)
      .on("tick", function(d){
        node
            .attr("cx", function(d){ return d.x ? d.x : 0; })
            .attr("cy", function(d){ return d.y ? d.y : 0; })
      });

    // document.getElementById('circularPacking').scrollIntoView({
    //   behavior: 'smooth',
    //   block: 'center',
    //   inline: 'center'
    // });
    // What happens when a circle is dragged?
    function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(.03).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(.03);
    d.fx = null;
    d.fy = null;
  }

  var g = circleVis.append("g")
    .attr("class", "legendThreshold")
    .attr("transform", "translate(700,40)");

  g.append("text")
    .attr("class", "caption")
    .attr("x", 0)
    .attr("y", -6)
    .text("Region In the World");


  var labels = Object.values(region_id_to_to_name);
  var labelsPopulation = ["0.0.2", "0.2-0.4", "0.4-0.6", "0.6-0.8", "0.8-1.0"]
  var legend = d3.legendColor()
      .labels(function (d) { 
        return labels[d.i]; 
      })
      .shapePadding(4)
      .scale(color);
  circleVis.select(".legendThreshold")
      .call(legend, true);


  var g = circleVis.append("g")
    .attr("class", "legendSize")
    .attr("transform", "translate(20,40)");


  if (sortValue === "totalMsw") {
    g.append("text")
    .attr("class", "caption")
    .attr("x", -15)
    .attr("y", -10)
    .text("Circle Size (total TONS)");

    var legendSize = d3.legendSize()
    .scale(size)
    .labelFormat(d3.format(".1s"))
    // .labels(function (d) { 
    //   console.log(d.generatedLabels[d.i])
    //   return abbreviateNumber(d.generatedLabels[d.i])
    // })
    .shape('circle')
    .shapePadding(25)
    .labelOffset(18)
    .orient('horizontal');
  } else {
    g.append("text")
    .attr("class", "caption")
    .attr("x", -15)
    .attr("y", -10)
    .text("Circle Size (TONS per person)");

    var legendSize = d3.legendSize()
    .scale(sizePopulation)
    .shape('circle')
    .shapePadding(25)
    .labelOffset(18)
    .orient('horizontal');
  }

  circleVis.select(".legendSize")
    .call(legendSize);
}

/********* COUNTRY BAR CHART BEGINS HERE *****************/

var margin = { top: 0, right: 0, bottom: 30, left: 80 };

///////////////////////
// Chart Size Setup
var barGraphWidth = 750
var barGraphHeight = 500
var w = barGraphWidth - margin.left - margin.right;
var h = barGraphHeight - margin.top - margin.bottom;

var chart = d3.select('#countryInfoChart').append("svg")
  .attr("width", barGraphWidth)
  .attr("height", barGraphHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

function drawCountryInfoChart() {
  document.getElementById("barToMap").style.display = "block";
  
  if (selectedCountries.length == 0) {
    alert("Please select some countries on the map to compare")
    return
  }
  document.getElementById('countryInfoChart').scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'center'
  });
  chart.selectAll("*").remove().transition().duration(1500)
  document.getElementById('selections').style.display = 'block';
  sortValue = document.getElementById("selectSort").value
  numberValue = document.getElementById("selectNumber").value
  let countries_sorted = selectedCountries
  if (sortValue === "totalMsw") { // sort by total msw
    countries_sorted.sort(function(a,b) { return b.total_msw - a.total_msw; }) 
  } else { // sort by msw per person
    countries_sorted.sort(function(a,b) { return b.total_per_person - a.total_per_person; }) 
  }
  data = countries_sorted
  console.log(data)

  if (numberValue !== "all") {
    data = countries_sorted.slice(0,numberValue); 
  }


  // Scales
  var x = d3.scaleBand()
      // .domain(data.map(function(d) { return d.country_name.split(",")[0].slice(0, 18); }))
      .domain(data.map(function(d) { return d.country_name.split(",")[0].slice(0, 18); }))
      .range([0, w])
      .padding(0.2);

  let y = d3.scaleLinear()
      .domain([0, maxTotal*1.1])
      .range([h, 0]);

  let yPopulation= d3.scaleLinear()
      .domain([0, maxPerPerson+0.05])
      .range([h, 0]);

  ///////////////////////
  // Axis
    // Scale the range of the data in the domains
  // x.domain(data.map(function(d) { return d.country_name; }));
  // y.domain([0, d3.max(data, function(d) { return d.total_msw * 1.1; })]);

  // append the rectangles for the bar chart
  var bar = chart.selectAll(".bar").data(data)

  bar.enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.country_name.split(",")[0].slice(0, 18)); })
      .attr("width", x.bandwidth())
      .attr("y", function (d) { 
        if (sortValue === "totalMsw") {
          return y(d.total_msw); 
        } else {
          return yPopulation(d.total_per_person);
        }         
      })
      .attr("height", function(d) { 
        if (sortValue === "totalMsw") {
          return h - y(d.total_msw); 
        } else {
          return h - yPopulation(d.total_per_person);
        }
      })
      .style("fill", function(d) {
        if (sortValue === "totalMsw") {
          return colorScale(d.total_msw) 
        } else {
          return colorScalePopulation(d.total_per_person)
        }
      });
  
  bar.transition()
      .duration(1500)
      .ease(d3.easeElastic)
      .attr("y", function(d) { 
        if (sortValue === "totalMsw") {
          return y(d.total_msw); 
        } else {
          return yPopulation(d.total_per_person);
        }      
      })
      .attr("height", function(d) { 
        if (sortValue === "totalMsw") {
          return h - y(d.total_msw); 
        } else {
          return h - yPopulation(d.total_per_person);
        }      
      })
  
      // add the x Axis
  chart.append("g")
      .attr("transform", "translate(0," + h + ")")
      .call(d3.axisBottom(x));

  if (sortValue === "totalMsw") {
    chart.append("g")
    .call(d3.axisLeft(y).tickFormat(d3.format(".2s")));

    chart
    .append("text")
    .attr("transform", "translate(-68," +  ((h+margin.bottom)/2+25) + ") rotate(-90)")
    .text("Total Waste (TONS)");

  } else {
    chart.append("g")
    .call(d3.axisLeft(yPopulation));

    chart
    .append("text")
    .attr("transform", "translate(-68," +  ((h+margin.bottom)/2+25) + ") rotate(-90)")
    .text("Total Waste (TONS) per person");
  }

  ///////////////////////
  // Title
  // chart.append("text")
  //   .text('Top 10 Countries With Most Waste In ' + allData.region_name)
  //   .attr("text-anchor", "middle")
  //   .attr("class", "graph-title")
  //   .attr("y", 15)
  //   .attr("x", w / 2.0);
  
  ///////////////////////
  // Bars
  // var bar = chart.selectAll(".bar").data(data)
  // bar.enter().append("rect")
  //     .attr("class", "bar")
  //     .attr("x", function(d) { return x(d.country_name.split(",")[0]); })
  //     .attr("y", h)
  //     .attr("width", x.rangeBand())
  //     .attr("height", 0)
  //     .style('fill', color(allData.region_name))
  //     .on("mouseover", function(d, i) {
  //       drawStep2(d);
  //       d3.select(this)
  //       .style("fill", "gray");
  //     })
  //     .on("mouseout", function(d, i) {
  //       d3.select(this)
  //       .style("fill", function() {
  //         return color(allData.region_name);
  //       });
  //     });

  // bar.transition()
  //     .duration(1500)
  //     .ease("elastic")
  //     .attr("y", function(d) { return y(d.total_msw); })
  //     .attr("height", function(d) { return h - y(d.total_msw); })
  ///////////////////////
}
  
// Load external data and boot
var circleData = []
d3.queue()
    .defer(d3.json, "https://raw.githubusercontent.com/enjalot/wwsd/master/data/world/world-110m.geojson")
    .defer(d3.csv, "data_resources/country_level_data.csv", function(d) { 
      let country_value = d.total_msw_total_msw_generated_tons_year ? parseInt(d.total_msw_total_msw_generated_tons_year) : 0
      // country_value = Math.log(country_value)
      let country_code = d.iso3c
      let population = d.population_population_number_of_people ? parseInt(d.population_population_number_of_people) : 1
      let country_name = d.country_name
      let region_name = region_id_to_to_name[d.region_id]
      let valuePerPerson = country_value / population;
      if (country_value > 0 && country_value < minTotal) {
        minTotal = country_value
      }
      if (country_value >  maxTotal) {
        maxTotal = country_value
      }
      if (valuePerPerson > 0 && valuePerPerson < minPerPerson) {
        minPerPerson = valuePerPerson
      }
      if (valuePerPerson > maxPerPerson) {
        maxPerPerson = valuePerPerson
      }
      allData[country_code] = {total_msw: country_value, population: population, country_name: country_name, country_code: country_code, region_name: region_name, total_per_person: valuePerPerson}
      circleData.push( {total_msw: country_value, population: population, country_name: country_name, country_code: country_code, region_name: region_name, total_per_person: valuePerPerson})
    })
    .await(ready);

function ready(error, topo) {
    if (error) throw error;
    globalTopo = topo 
    topoCountries = new Set([])
    globalTopo.features.forEach(t => {
      topoCountries.add(t.id)
    })
    circleData = circleData.filter(c => topoCountries.has(c.country_code)) // DO NOT INCLUDE CIRCLES FOR COUNTRIES NOT ON THE MAP
    // Draw the map
    console.log(minTotal)
    console.log(maxTotal)
    console.log(minPerPerson)
    console.log(maxPerPerson)
    drawMap()
    drawCircularPacking()
}