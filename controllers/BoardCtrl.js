muonApp.controller('BoardCtrl', function ($scope, $stateParams) {
	                
	                
	gameCore.board.boardSVG = d3.select(".gamepeices").append("svg")
		.attr("class", "d3gamepeices")
	    .attr("width", gameCore.board.width)
	    .attr("height", gameCore.board.height)
	    .on("mousedown", mousedown);

	gameCore.board.d3force = d3.layout.force()
	    .nodes(gameCore.board.nodes)
	    .links(gameCore.board.links)
	    .linkDistance(50)
	    .linkStrength(1)
	    .gravity(0.02)
	    .charge(function(d, i) { 
	      return d.id % 3 == 0 ? -30 : 0; 
	    })
	    .size([gameCore.board.width, gameCore.board.height])
	    .on("tick", gameCore.board.tick)
	    
	$scope.remove_board = function(){
		gameCore.board.d3force.stop();
		d3.select(".d3gamepeices").remove();
	}

	gameCore.board.activeNodes = gameCore.board.boardSVG.selectAll("circle");
	gameCore.board.activeLinks = gameCore.board.boardSVG.selectAll('.link');

	function mousedown() {
	  var point = d3.mouse(this);
	  var maxdist = 30
	  // This loops through all the nodes and find the index of atleast one node within
	  // 30 to point

	  var closestNode; //used to store the node closest to the click
	  var closestPoint = Infinity; //used to compare the distance between closestNode and other nodes
	  //loop though all of the nodes
	  gameCore.board.nodes.forEach(function(target) {
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


	function addNodeAtFoci(f,anti){
	    var i = f * 3

	    gameCore.board.nodes.push({id: i, foci: f, antimuon: anti, selected: false});
	    gameCore.board.nodes.push({id: i + 1, foci: f, antimuon: anti, selected: false});
	    gameCore.board.links.push({source: i, target: i + 1});
	    gameCore.board.nodes.push({id: i + 2, foci: f, antimuon: anti, selected: false});
	    gameCore.board.links.push({source: i + 2, target: i + 1});
	    gameCore.board.links.push({source: i, target: i + 2});

	    gameCore.board.refresh();
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


	createBoard();
});