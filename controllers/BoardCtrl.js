muonApp.controller('BoardCtrl', function ($scope, $stateParams) {

	var width = 700,
    	height = 700;


	var nodes = [],
	    foci = [{x: 5, y: 5}, {x: 300, y: 5},        //
	                        {x: 150, y: 150},              // Quad A
	                {x: 5, y: 300}, {x: 300, y: 300},    //

	                {x: 400, y: 400}, {x: 675, y: 400},   //
	                        {x: 550, y: 550},             // Quad D
	                {x: 400, y: 675}, {x: 675, y: 675},  //
	                
	                {x: 400, y: 5}, {x: 675, y: 5},    //
	                      {x: 500, y: 200},                // Quad B
	                {x: 400, y: 300}, {x: 675, y: 300},    //
	                
	                {x: 5, y: 400}, {x: 300, y: 400},   //
	                         {x: 200, y: 500},            // Quad C
	                {x: 5, y: 675}, {x: 300, y: 675}];   //
	                
	                
	var svg = d3.select(".gamepeices").append("svg")
		.attr("class", "d3gamepeices")
	    .attr("width", width)
	    .attr("height", height)
	    .on("mousedown", mousedown);

	var force = d3.layout.force()
	    .nodes(nodes)
	    .links([])
	    .linkDistance(50)
	    .linkStrength(1)
	    .gravity(0.02)
	    .charge(function(d, i) { 
	      return d.id % 3 == 0 ? -30 : 0; 
	    })
	    .size([width, height])
	    .on("tick", tick)
	    
	$scope.remove_board = function(){
		force.stop();
		d3.select(".d3gamepeices").remove();
	}

	var node = svg.selectAll("circle");
	var links = force.links();
	var link = svg.selectAll('.link');

	function mousedown() {
	  var point = d3.mouse(this);
	  var maxdist = 30
	  // This loops through all the nodes and find the index of atleast one node within
	  // 30 to point

	  var closestNode; //used to store the node closest to the click
	  var closestPoint = Infinity; //used to compare the distance between closestNode and other nodes
	  //loop though all of the nodes
	  nodes.forEach(function(target) {
	    var x = target.x - point[0],
	        y = target.y - point[1],
	        distance = Math.sqrt(x * x + y * y);
	    //check if the node (target) is within the maxdist of the click    
	    if (distance < maxdist) {
	    	//if target is closer than my currently stored closestNode then replace it with target
	    	if(closestPoint > distance)
	    	{
	    		closestNode = target;
	    		closestPoint = distance;
	    	}
	    } else {
	    	//unselect all other nodes
	    	target.selected = false;
	    	d3.selectAll(".id" + target.index).transition().duration(450).attr("r", 10);
	    }
	  });

		if(closestNode){
			//select all the nodes around the node we clicked
			var startIndex = closestNode.index - (closestNode.index % 3);
			//closestNode.selected = true;
			d3.selectAll(".id" + startIndex + ",.id" + (startIndex + 1) + ",.id" + (startIndex + 2))
				.transition()
				.duration(450)
				.attr("r", 15);
		}
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
	      .attr("class", function(d) { return "id" + d.id + " node" })
	      .attr("cx", function(d) { return d.x; })
	      .attr("cy", function(d) { return d.y; })
	      .attr("r", 10)
	      .style("fill", function(d) { return (!d.antimuon) ? d3.rgb(95,173,65) :  d3.rgb(84,144,204); })
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