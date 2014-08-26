$(function() {
  board.drawBoard();

  $('body').keyup(function(event){
  	var keyboardHandler = {
  		38: function(){board.move('up')},
  		40: function(){board.move('down')},
  		37: function(){board.move('left')},
  		39: function(){board.move('right')}
  	};

  	if(keyboardHandler[event.which] !== undefined){
  		keyboardHandler[event.keyCode]();
  	}
  });
});