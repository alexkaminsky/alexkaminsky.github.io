var robotics = {
	finshed: [],
	tween: [],
	done: false
};
robotics.init = function(){
	//#cell-robot
	$("#cell-robot").append("<canvas id='robot-canvas' class='main-canvas'></canvas>");
	this.canvas = document.getElementById("robot-canvas");
	$(this.canvas).attr("width", $("#part-0").width());
	$(this.canvas).attr("height", $("#part-0").height());
	this.ctx =  this.canvas.getContext('2d');
	this.charWidth = Math.floor((this.canvas.width / 20));
	this.rows = Math.floor(this.canvas.height / 30);
}

robotics.show = function(){
	this.finished = [];
	this.tween = [];
	this.i = 0;
	this.ctx.font = "30px Arial";
	this.ctx.fillStyle = "rgba(255,255,255,0.3)";
	robotics.interval = window.setInterval(function(){
		if(in_progress === false){
			robotics.makeRow(robotics.i);
			if(robotics.i === robotics.rows){
				robotics.done = true;
				clearInterval(robotics.interval);
			}
			robotics.i+=1;
		}
	},100);
	requestAnimationFrame(animate);
}

robotics.makeRow = function(){
	for(var i = 0; i < 20; i++){
		var doShow = Math.round(Math.random()) === 0;
		if(doShow === true){
			var char = Math.round(Math.random());
			var _left = i * this.charWidth;
			var _top = 0;
			var first = false;
			if(i === 0){
				first = true;
			}
			var coords = {left: _left, top : _top, char: char, first: first};
			coords.newTop = robotics.canvas.height - 30*robotics.i
			var tween = new TWEEN.Tween(coords).to({
				top: coords.newTop
			}, 1000)
			.onUpdate(function(){
				robotics.plot(this)
			})
			.onComplete(function(){
				robotics.finished.push(this);
			})
			.start();

			robotics.tween.push(tween);
		}
	}
}

function animate(time) {
    requestAnimationFrame(animate);
    robotics.clear();
    TWEEN.update(time);
    if(robotics.stopFinished !== true){
		for(var i = 0; i < robotics.finished.length; i++){
		 	robotics.plot(robotics.finished[i]);
		   	robotics.tween[i].stop();
		}
	}
    //robotics.ctx.save();
}

robotics.clear = function(){
	this.ctx.clearRect(0, 0, Number(this.canvas.width), Number(this.canvas.height));
}

robotics.plot = function(thing){
	robotics.ctx.fillText(thing.char, thing.left, thing.top);
}