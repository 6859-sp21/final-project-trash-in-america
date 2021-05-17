//copied from http://bl.ocks.org/espinielli/4d17fa15a7a5084e217992f985fba484
d3.helper = {};

d3.helper.tooltip = function(accessor, flag, sortValue, colorScale, colorScalePopulation){
    // create a tooltip

    // this is for the circular packing right tooltip
    var Tooltip = d3.select("#tooltip")
    var mouseover = function(d) {
        Tooltip
          .style("opacity", 1)
    }
    var mousemove = function(d) {
        let text = '<u>' + d.country_name + '</u>' 
            + "<br>" + d.total_msw.toLocaleString() + " tons of trash among"
            + "<br>" + d.population.toLocaleString() + " people means"
            + "<br>" + (d.total_msw/d.population).toLocaleString() + " tons of trash per person"
            + "<br>" + Math.round((2000*d.total_msw/d.population)).toLocaleString() + " lbs per person"
            + "<br><br><b>Note: One ton = 2000 lbs"
        Tooltip.html(text)
    }



    return function(selection){
        var tooltipDiv;
        var bodyNode = d3.select('body').node();
        selection.on("mouseover", function(d, i){
            if (flag) {
                mouseover(d)
            }
            // Clean up lost tooltips
            d3.select('body').selectAll('div.mapTooltip').remove();

            // Append tooltip
            tooltipDiv = d3.select('body').append('div').attr('class', 'mapTooltip');
            var absoluteMousePos = d3.mouse(bodyNode);
            tooltipDiv.style('left', (absoluteMousePos[0] + 10)+'px')
                .style('top', (absoluteMousePos[1] - 15)+'px')
                .style('position', 'absolute') 
                .style('z-index', 1001);
            // Add text using the accessor function
            var tooltipText = accessor(d, i) || '';
            tooltipDiv.html(tooltipText);
        })
        .on('mousemove', function(d, i) {
            // change the according hover color to gray
            // let selection = "circle#" + d.country_code
            if (flag) {
                mousemove(d) // do circle selection hovering with right tooltip
            }
            // } else {
            //     selection = "path#" + d.country_code   
            // }

            // let elt = d3.select(selection)
            // elt.style("fill", "lightgray")

            // Move tooltip
            // var absoluteMousePos = d3.mouse(bodyNode);
            // tooltipDiv.style('left', (absoluteMousePos[0] + 10)+'px')
            //     .style('top', (absoluteMousePos[1] - 15)+'px');
            // var tooltipText = accessor(d, i) || '';
            // tooltipDiv.html(tooltipText);
        })
        .on("mouseout", function(d, i){
            // change the according hover color back to normal

            // let selection = "circle#" + d.country_code
            // var color = "lightgray"
            // if (flag) {
            //     currColor = colorScale(d.region_name)
            // } else {
            //     currColor = sortValue === "totalMsw" ? colorScale(d.total_msw) : colorScalePopulation(d.total_per_person)
            //     selection = "path#" + d.country_code
            // }
            // d3.select(selection).style("fill", currColor)

            // remove tooltip
            tooltipDiv.remove();
        });

    };
};