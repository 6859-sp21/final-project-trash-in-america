//copied from http://bl.ocks.org/espinielli/4d17fa15a7a5084e217992f985fba484
d3.helper = {};

d3.helper.tooltip = function(accessor, isCircleFlag){
    return function(selection){
        var tooltipDiv;
        var bodyNode = d3.select('body').node();
        selection.on("mouseover", function(d, i){
            // Clean up lost tooltips
            d3.select('body').selectAll('div.mapTooltip').remove();
            // Append tooltip
            tooltipDiv = d3.select('body').append('div').attr('class', 'mapTooltip');
            tooltipDiv.style("opacity", 1)

            var absoluteMousePos = d3.mouse(bodyNode);
            tooltipDiv.style('left', (absoluteMousePos[0] + 10)+'px')
                .style('top', (absoluteMousePos[1] - 15)+'px')
                .style('position', 'absolute') 
                .style('z-index', 300000);
            console.log( (absoluteMousePos[0] + 10))
            console.log((absoluteMousePos[1] - 15))
            // Add text using the accessor function
            var tooltipText = accessor(d, i) || '';
            // Crop text arbitrarily
            //tooltipDiv.style('width', function(d, i){return (tooltipText.length > 80) ? '300px' : null;})
            //    .html(tooltipText);
        })
        .on('mousemove', function(d, i) {
            // Move tooltip
            var absoluteMousePos = d3.mouse(bodyNode);
            tooltipDiv.style('left', (absoluteMousePos[0] + 10)+'px')
                .style('top', (absoluteMousePos[1] - 15)+'px');
            var tooltipText = accessor(d, i) || '';
            if (isCircleFlag) {
                tooltipText = '<u>' + d.country_name + '</u>: ' + d.total_msw.toLocaleString() + " tons of waste (" +  d.population.toLocaleString() + " people)"
                // + "<br>" + d.total_msw.toLocaleString() + " tons of trash among"
                // + "<br>" + d.population.toLocaleString() + " people means"
                // + "<br>" + (d.total_msw/d.population).toLocaleString() + " tons of trash per person"
                // + "<br>" + Math.round((2000*d.total_msw/d.population)).toLocaleString() + " lbs per person"
            }
            console.log(tooltipText)
            tooltipDiv.html(tooltipText);
        })
        .on("mouseout", function(d, i){
            // Remove tooltip
            console.log("hi")
            // tooltipDiv.remove();
            tooltipDiv.style("opacity", 0)
        });

    };
};