var boardWidth = 500;
var padding = 15;
var tilePerSide = 4;
var tileWidth = (boardWidth - padding * (tilePerSide + 1)) / tilePerSide;
var tileLocations = [
		[{value: 0}, {value: 0}, {value: 0}, {value: 0}],
    	[{value: 0}, {value: 0}, {value: 0}, {value: 0}],
    	[{value: 0}, {value: 4}, {value: 0}, {value: 0}],
      	[{value: 0}, {value: 0}, {value: 2}, {value: 0}]
     ];


var numberSize = 70;

var svg;

var board = {};

board.drawBoard = function(){
	board.createSvg();
	board.drawBackground();

	for(var j = 0; j < tileLocations.length; j++){
		for(var i = 0; i < tileLocations[0].length; i++){
			if(tileLocations[j][i].value > 0){
				board.drawTile({x: i, y: j}, tileLocations[j][i].value);
			}
		}
	}
};

board.createSvg = function(){
	svg = d3.select('#game-board')
	.append('svg')
	.attr('x', 0)
	.attr('y', 0)
	.attr('width', boardWidth)
	.attr('height', boardWidth)
};

board.drawBackground = function(){
	svg.append('rect')
	.attr('width', '100%')
	.attr('height', '100%')
	.attr('rx', 5)
	.attr('ry', 5)
	.style('fill', '#C8C8C8 ');

	for(var i = 0; i < tileLocations.length; i++){
		for(var j = 0; j < tileLocations[0].length; j++){
			svg.append('rect')
			.attr('x', getLocation(j))
			.attr('y', getLocation(i))
			.attr('width', tileWidth)
			.attr('height', tileWidth)
			.attr('rx', 5)
			.attr('ry', 5)
			.attr('fill', '#909090')
		}
	}
};

board.drawTile = function(coordinate, value){
	var thisTile = tileLocations[coordinate.y][coordinate.x];
	thisTile.rect = svg.append('g');

	thisTile.rect
	.append('rect')
	.attr('x', getLocation(coordinate.x))
	.attr('y', getLocation(coordinate.y))
	.attr('width', 0)
	.attr('height', 0)
	.attr('rx', 5)
	.attr('ry', 5)
	.attr('fill', '#FF9966');

	thisTile.rect
	.append('text')
	.attr('x', getLocation(coordinate.x) + tileWidth / 2)
	.attr('y', getLocation(coordinate.y) + tileWidth / 2)
	.attr('text-anchor', 'middle')
	.attr('alignment-baseline', 'central')
	.style('font-size',numberSize);


	thisTile.rect.select('rect')
	.transition()
	.delay(200)
	.attr('width', tileWidth)
	.attr('height', tileWidth);

	thisTile.rect.select('text')
	.transition()
	.delay(200)
	.text(value);
};

var getLocation = function(position){
	return padding + (padding + tileWidth) * position;
}


board.move = function(direction){
	var shifted = false;

	if(direction === 'left'){
		for(var j = 0; j < tileLocations.length; j++){
			for(var i = 0; i < tileLocations[0].length; i++){
				if(tileLocations[j][i].value !== 0){
					for(var k = i; k > 0; k--){
						var result = board.moveTile(direction, {x: k, y: j});
						if(result.shifted){
							shifted = true;
							if(result.combined){
								break;
							}
						}
					}
				}
			}
		}
	}else if(direction === 'right'){
		for(var j = 0; j < tileLocations.length; j++){
			for(var i = tileLocations[0].length - 1; i >= 0; i--){
				if(tileLocations[j][i].value !== 0){
					for(var k = i; k < tileLocations[0].length - 1; k++){
						var result = board.moveTile(direction, {x: k, y: j});
						if(result.shifted){
							shifted = true;
							if(result.combined){
								break;
							}
						}
					}
				}
			}
		}
	}else if(direction === 'up'){
		for(var i = 0; i < tileLocations[0].length; i++){
			for(var j = 0; j < tileLocations.length; j++){
				if(tileLocations[j][i].value !== 0){
					for(var k = j; k > 0; k--){
						var result = board.moveTile(direction, {x: i, y: k});
						if(result.shifted){
							shifted = true;
							if(result.combined){
								break;
							}
						}
					}
				}
			}
		}
	}else if(direction === 'down'){
		for(var i = 0; i < tileLocations[0].length; i++){
			for(var j = tileLocations.length - 1; j >= 0; j--){
				if(tileLocations[j][i].value !== 0){
					for(var k = j; k < tileLocations.length - 1; k++){
						var result = board.moveTile(direction, {x: i, y: k});
						if(result.shifted){
							shifted = true;
							if(result.combined){
								break;
							}
						}
					}
				}
			}
		}
	}

	if(shifted){
		board.addRandomTile();
	}

	// if(shifted){
	// 	setTimeout(board.addRandomTile(), 400);
	// }
};

board.moveTile = function(direction, from){
 	var to = board.getNewLocation(from, direction);
    var newLocationIsEmpty = tileLocations[to.y][to.x].value === 0;
    var newLocationisTheSameValue = tileLocations[to.y][to.x].value === tileLocations[from.y][from.x].value;

    if(newLocationIsEmpty) {
      tileLocations[to.y][to.x].value = tileLocations[from.y][from.x].value;
      tileLocations[from.y][from.x].value = 0;

      if(typeof tileLocations[from.y][from.x].rect !== 'undefined') {
        tileLocations[from.y][from.x].rect.select('rect')
          .transition()
            .attr('x', getLocation(to.x))
            .attr('y', getLocation(to.y));
        tileLocations[from.y][from.x].rect.select('text')
          .transition()
            .attr('x', getLocation(to.x) + tileWidth / 2)
            .attr('y', getLocation(to.y) + tileWidth / 2);
        tileLocations[to.y][to.x].rect = tileLocations[from.y][from.x].rect;
        tileLocations[from.y][from.x].rect = undefined;
      }
      return {shifted: true, combined: false};
    } else if(newLocationisTheSameValue) {
      tileLocations[to.y][to.x].value *= 2;
      tileLocations[from.y][from.x].value = 0;


      if(typeof tileLocations[to.y][to.x].rect !== 'undefined') {
        tileLocations[to.y][to.x].rect.select('rect')
          .transition()
            .attr('width', 0)
            .attr('height', 0);
        tileLocations[to.y][to.x].rect.select('text')
          .transition()
            .text('')
            .attr('fill', 'none');
        tileLocations[to.y][to.x].rect = undefined;
      }

      if(typeof tileLocations[from.y][from.x].rect !== 'undefined') {
        tileLocations[from.y][from.x].rect.select('rect')
          .transition()
            .attr('x', getLocation(to.x))
            .attr('y', getLocation(to.y));
        tileLocations[from.y][from.x].rect.select('text')
          .transition()
            .text(tileLocations[to.y][to.x].value)
            .attr('x', getLocation(to.x) + tileWidth / 2)
            .attr('y', getLocation(to.y) + tileWidth / 2);
        tileLocations[to.y][to.x].rect = tileLocations[from.y][from.x].rect;
        tileLocations[from.y][from.x].rect = undefined;
      }
      return {shifted: true, combined: true};
    } else {
      return {shifted: false, combined: false};
    }
};

board.getNewLocation = function(from, direction){
	if(direction === 'up'){
		return {x: from.x, y: from.y - 1};
	}else if(direction === 'down'){
		return {x: from.x, y: from.y + 1}
	}else if(direction === 'left'){
		return {x: from.x - 1, y: from.y}
	}else if(direction === 'right'){
		return {x: from.x + 1, y: from.y}
	}
};

board.addRandomTile = function(){
	var newTileCoordinate = {x: getRandomPosition(), y: getRandomPosition()};

	while(tileLocations[newTileCoordinate.y][newTileCoordinate.x].value !== 0){
		newTileCoordinate = {x: getRandomPosition(), y: getRandomPosition()};
	}

	var value = getRandomValue();
	tileLocations[newTileCoordinate.y][newTileCoordinate.x].value = value;
	board.drawTile(newTileCoordinate, value);
};

var getRandomPosition = function(){
	return Math.floor(Math.random() * 4);
}

var getRandomValue = function(){
	return (Math.floor(Math.random() * 2) + 1) * 2;
};