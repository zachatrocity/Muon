muonApp.controller('BoardCtrl', function ($scope, $stateParams) {
	                
	                
	gameCore.board.boardSVG = d3.select(".gamepeices").append("svg")
		.attr("class", "d3gamepeices")
	    .attr("width", gameCore.board.width)
	    .attr("height", gameCore.board.height)
	    .on("mousedown", gameCore.board.mousedown);

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

	gameCore.board.createBoard();
});