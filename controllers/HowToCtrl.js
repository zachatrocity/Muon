muonApp.controller('HowToCtrl', function ($scope, $stateParams) {
	
	var fill = d3.scale.category10();
	var width =  window.innerWidth;
	var nodes = [],
		links = [],
		foci = [{x: 500 , y: 150}, {x: width - 150, y: 150}];

	var SVG = d3.select(".muon-container").append("svg")
	    .attr("width", width)
	    .attr("height", 300)

	var force = d3.layout.force()
	    .nodes(nodes)
	    .links(links)
	    .linkDistance(50)
	    .linkStrength(1)
	    .gravity(0.02)
	    .charge(function(d, i) { 
	      return d.id % 3 == 0 ? -30 : 0; 
	    })
	    .size([300, 300])
	    .on("tick", tick);

	var node = SVG.selectAll("circle");
	var link = SVG.selectAll(".link");

	function tick(e) {
		var k = .1 * e.alpha;

		// Push nodes toward their designated focus.
		nodes.forEach(function(o, i) {
			if(o.anti){
				o.y += (foci[1].y - o.y) * k;
				o.x += (foci[1].x - o.x) * k;
			} else {
				o.y += (foci[0].y - o.y) * k;
				o.x += (foci[0].x - o.x) * k;
			}
		});

		node
		  .attr("cx", function(d) { return d.x; })
		  .attr("cy", function(d) { return d.y; });

		link
	      .attr("x1", function(d) { return d.source.x; })
	      .attr("y1", function(d) { return d.source.y; })
	      .attr("x2", function(d) { return d.target.x; })
	      .attr("y2", function(d) { return d.target.y; })
	}

	nodes.push({id: 0});
	nodes.push({id: 1});
	nodes.push({id: 2});
	//antimuons
	nodes.push({id: 3, anti:true});
	nodes.push({id: 4, anti:true});
	nodes.push({id: 5, anti:true});

	links.push({source: 0, target: 1});
	links.push({source: 1, target: 2});
	links.push({source: 2, target: 0});
	//antimuons
	links.push({source: 3, target: 4});
	links.push({source: 4, target: 5});
	links.push({source: 5, target: 3});

	force.start();

	link = link.data(links);

    link.enter().insert("line", ".node")
      .attr("class", "link");

	node = node.data(nodes);

	node.enter().append("circle")
	  .attr("class", "node")
	  .attr("cx", function(d) { return d.x; })
	  .attr("cy", function(d) { return d.y; })
	  .attr("r", 10)
	  .style("fill", function(d) { return (!d.anti) ? d3.rgb(95,173,65) : d3.rgb(84,144,204); })
	  .call(force.drag);

});