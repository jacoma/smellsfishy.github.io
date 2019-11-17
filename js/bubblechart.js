// bubble chart object for creation of bubble charts

/*
 * BubbleChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the bar charts
 * @param _data						-- the dataset 'household characteristics'
 * @param _config					-- variable from the dataset (e.g. 'electricity') and title for each bar chart
 */

BubbleChart = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = _data;

    this.initVis();
}

/*
 * Initialize visualization (static content; e.g. SVG area, axes)
 */

BubbleChart.prototype.initVis = function() {
    var vis = this;
    vis.width = 250;
    vis.height=250;
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width)
        .attr("height", vis.height )
        .attr("class", "bubble")
    this.updateVis();
}


// bubble chart reference: https://www.freecodecamp.org/news/a-gentle-introduction-to-d3-how-to-build-a-reusable-bubble-chart-9106dc4f6c46/

BubbleChart.prototype.updateVis = function() {
    var vis = this;
    //console.log(vis.displayData);
    //console.log(vis.displayData.length)
    var colorCircles = d3.scaleOrdinal(d3.schemeBlues[9]);

    var scaleRadius = d3.scaleLinear()
        .domain([
            d3.min(vis.displayData, function(d) { return +d.Value; }),
            d3.max(vis.displayData, function(d) { return +d.Value; })])
        .range([10,40]);

    var scaleRect = d3.scaleLinear()
        .domain([
            d3.min(vis.displayData, function(d) { return +d.Value; }),
            d3.max(vis.displayData, function(d) { return +d.Value; })])
        .range([5,20]);



    var simulation = d3.forceSimulation(vis.displayData)
        .force("charge", d3.forceManyBody().strength([-35]))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .on("tick", ticked);

    function ticked(e) {
        node.attr("transform",function(d) {
            return "translate(" + [d.x+(vis.width / 2), d.y+((vis.height) / 2)] +")";
        });
    }

    var node = vis.svg.selectAll(".bubbles")
        .data(vis.displayData)
        .enter()
        .append("g")
        .attr("x", function(d){return d.x})
        .attr("y", function(d){return d.y})
        .attr('transform', 'translate(' + [vis.width / 2, vis.height / 2] + ')');

    circle = node.append("circle")
        .attr('r', function(d) {
//            console.log(d.Value);
            return scaleRadius(d.Value)})
        .style("fill", function(d) { return colorCircles(d.Name)})
        .attr("class", "bubbles" );

/*
    node.append("rect")
        .attr("x", 2)
        .attr("y", function(d) { return (scaleRadius(d.Value) - (scaleRadius(d.Value)* 2 )) + 8; })
        .attr("height", function(d) { return scaleRect(d.Value); })
        .attr("width", function(d) { return scaleRect(d.Value); })
        .attr("stroke", "#dddfe2")
        .attr("fill", function(d, i) { return colorCircles(i--) })
        .attr("transform", "rotate(15)");
*/
        node.append("path")
            .attr("y", function(d) { return (scaleRadius(d.Value) - (scaleRadius(d.Value)* 2 )) + 8; })
            .attr("d", function (d){
                //var x = scaleRadius(d.Value) ;
                var x = (scaleRadius(d.Value) - (scaleRadius(d.Value)* 2 )) + scaleRect(d.Value);
                var y = (scaleRadius(d.Value) - (scaleRadius(d.Value)* 2 )) + scaleRect(d.Value);
                var w = scaleRect(d.Value);
                return "M 0 " + x  +
                    " l " + w + " 0" +
                    " l 4 4" +
                    " l 0 8 z"
            })
            .attr("fill", function(d, i) { return colorCircles(i--)})

    node.append("text")
        .attr("dy", ".2em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.Name })
        .attr("class", "bubble_text");


}

