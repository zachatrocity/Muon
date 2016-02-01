muonApp.controller('BoardCtrl', function ($scope, $stateParams) {

	var width = 1100,
    	height = 1000;

	var fill = d3.scale.category10();

	var nodes = [],
	    foci = [{x: 100, y: 100}, {x: 300, y: 100},        //
	                        {x: 200, y: 200},              // Quad A
	                {x: 100, y: 300}, {x: 300, y: 300},    //

	                {x: 400, y: 400}, {x: 600, y: 400},   //
	                        {x: 500, y: 500},             // Quad D
	                {x: 400, y: 600}, {x: 600, y: 600},  //
	                
	                {x: 400, y: 100}, {x: 600, y: 100},    //
	                      {x: 500, y: 200},                // Quad B
	                {x: 400, y: 300}, {x: 600, y: 300},    //
	                
	                {x: 100, y: 400}, {x: 300, y: 400},   //
	                         {x: 200, y: 500},            // Quad C
	                {x: 100, y: 600}, {x: 300, y: 600}];   //
	                
	                
	var svg = d3.select("body").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .on("mousedown", mousedown);

	var force = d3.layout.force()
	    .nodes(nodes)
	    .links([])
	    .linkDistance(30)
	    .linkStrength(1)
	    .gravity(0.02)
	    .charge(function(d, i) { 
	      return d.id % 3 == 0 ? -30 : 0; 
	    })
	    .size([width, height])
	    .on("tick", tick)
	    
	$scope.remove_board = function(){
		force.stop();
		d3.select("svg").remove();
	}

	var node = svg.selectAll("circle");
	var links = force.links();
	var link = svg.selectAll('.link');

	function mousedown() {
	  var point = d3.mouse(this);
	  var maxdist = 30
	  // This loops through all the nodes and outputs the ones within
	  // 30 to point
	  nodes.forEach(function(target) {
	    var x = target.x - point[0],
	        y = target.y - point[1];
	    if (Math.sqrt(x * x + y * y) < maxdist) {
	    	debugger;
		    target.selected = true;
		    console.log(target);
		    
		    
	    } else {
	    	target.selected = false;
	    }
	  });

	  // d3.select(this).select("circle").transition()
   //      .duration(750)
   //      .attr("r", 16)


	  restart();
	}

	function tick(e) {
	    var k = .1 * e.alpha;

	    //Push center nodes toward their designated focus.
	    nodes.forEach(function(o, i) {
	      if(typeof o.foci !== "undefined"){
	        o.y += (foci[o.foci].y - o.y) * k;
	        o.x += (foci[o.foci].x - o.x) * k;
	      }
	    });

	    // Exit any old nodes.
	    node.exit().remove();

	    // Exit any old links.
	    link.exit().remove();

	    node
	      .attr("cx", function(d) { return d.x; })
	      .attr("cy", function(d) { return d.y; })


	    link
	      .attr("x1", function(d) { return d.source.x; })
	      .attr("y1", function(d) { return d.source.y; })
	      .attr("x2", function(d) { return d.target.x; })
	      .attr("y2", function(d) { return d.target.y; })

	      // .attr("cx", function(d) { return d.x = (d.source.x + d.target.x) * 0.5; })
	      // .attr("cy", function(d) { return d.y = (d.source.y + d.target.y) * 0.5; });
	}


	var numberOfAtomsPerPeice = 3;

	function restart(){

	    link = link.data(links);
	    link.enter().insert("line", ".node")
	      .attr("class", "link");


	    node = node.data(nodes);
	    node.enter().append("circle")
	      .attr("class", function(d) { return d.id + " node" })
	      .attr("cx", function(d) { return d.x; })
	      .attr("cy", function(d) { return d.y; })
	      .attr("r", 5)
	      .style("fill", function(d) { return (!d.antimuon) ? d3.rgb(95,173,65) :  d3.rgb(84,144,204); })
	      .style("stroke", function(d) { return ((!d.antimuon) ? d3.rgb(95,173,65) : d3.rgb(84,144,204)).darker(2); })
	      .call(force.drag)

	    force.start()
	}

	function addNodeAtFoci(f,anti){
	    var i = f * 3

	    nodes.push({id: i, foci: f, antimuon: anti, selected: false});
	    nodes.push({id: i + 1, foci: f, antimuon: anti, selected: false});
	    links.push({source: i, target: i + 1});
	    nodes.push({id: i + 2, foci: f, antimuon: anti, selected: false});
	    links.push({source: i + 2, target: i + 1});
	    links.push({source: i, target: i + 2});

	    restart();
	}

	function createBoard(){
	  //clearboard()
	  addMuons();
	  addAntiMuons();
	}

	function addMuons(){
	  addNodeAtFoci(0,0);
	  addNodeAtFoci(1,0);
	  addNodeAtFoci(2,0);
	  addNodeAtFoci(3,0);
	  addNodeAtFoci(4,0);
	}

	function addAntiMuons(){
	  addNodeAtFoci(5,1);
	  addNodeAtFoci(6,1);
	  addNodeAtFoci(7,1);
	  addNodeAtFoci(8,1);
	  addNodeAtFoci(9,1);
	}

	function moveMuonTweenFoci(f1,f2){
	  nodes.forEach(function(o, i) {
	    if (o.foci == f1){
	      o.foci = f2;
	    }
	  });

	  restart();
	}

	createBoard();
});