$(document).ready(function(){

	var canvas = document.getElementById("networkCanvas");
	canvas.width = 1000;
	canvas.height = 600;

	labelFill="#f5da43";

	var width=150; //all entries have set width and height
	var height=100;

	var context = canvas.getContext("2d");
	var entries = [];

	var mousePos = {
		x : 0,
		y : 0
	};

	$("#networkCanvas").mousemove(function(e){
		var boundingRect = canvas.getBoundingClientRect();
		mousePos = {
			x : Math.floor(e.clientX - boundingRect.left),
			y : Math.floor(e.clientY - boundingRect.top)
		};
	});

	var requestAnimationFrame =  
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		function(callback) {
			return setTimeout(callback, 1);
		};

	var render = function() {
		// Clear the canvas
		context.clearRect(0, 0, canvas.width, canvas.height);

		entryLabelId=-1;

		for(i=0; i < entries.length; i++){
			drawEntry(entries[i]);
			if(entryLabelId==-1 && entries[i].underCursor()){
				entryLabelId=i;
			}
		}

		drawConnection(entries[0], entries[1]);

		drawConnection(entries[1], entries[2]);

		drawConnection(entries[1], entries[5]);

		drawConnection(entries[2], entries[3]);

		drawConnection(entries[2], entries[4]);

		drawConnection(entries[5], entries[6]);

		drawConnection(entries[5], entries[7]);

		if(entryLabelId!=-1){
			//label has to be painted last.
			drawLabel(mousePos.x, mousePos.y, entries[entryLabelId].ip);
		}

		requestAnimationFrame(render);
	};

	function drawConnection(entry1, entry2){

		context.lineWidth = 10;

		context.beginPath();

		var entry2CenterX = entry2.x+entry2.width/2;
		var entry1CenterX = entry1.x+entry1.width/2;
		
		if(entry1.x+entry1.width < entry2CenterX){
			//entry2 is right to entry1
			if(entry1.y < entry2.y){
				//entry1 above entry2
				context.moveTo(entry1.x+entry1.width, entry1.y+entry1.height/2);
				context.lineTo(entry2CenterX, entry1.y+entry1.height/2);
				context.lineTo(entry2CenterX, entry2.y);
			}
			else
			{
				//entry2 above entry1
				context.moveTo(entry2.x+entry2.width, entry2.y+entry2.height/2);
				context.lineTo(entry1CenterX, entry2.y+entry2.height/2);
				context.lineTo(entry1CenterX, entry1.y);
			}
		}
		else if(entry2CenterX < entry1.x){
			//entry2 is left to entry1
			if(entry1.y < entry2.y){
				//entry1 above entry2
				context.moveTo(entry1.x, entry1.y+entry1.height/2);
				context.lineTo(entry2CenterX, entry1.y+entry1.height/2);
				context.lineTo(entry2CenterX, entry2.y);
			}
			else
			{
				//entry2 above entry1
				context.moveTo(entry2.x, entry2.y+entry2.height/2);
				context.lineTo(entry1CenterX, entry2.y+entry2.height/2);
				context.lineTo(entry1CenterX, entry1.y);
			}
		}
		else if(entry2.x == entry1.x){
			//the one is below the other
			if(entry1.y > entry2.y){
				//entry1 below entry2
				context.moveTo(entry2.x+entry2.width/2, entry2.y+entry2.height);
				context.lineTo(entry1.x+entry1.width/2, entry1.y);
			}
			else
			{
				//entry2 below entry1
				context.moveTo(entry1.x+entry1.width/2, entry1.y+entry1.height);
				context.lineTo(entry2.x+entry2.width/2, entry2.y);
			}
		}
		context.stroke();
	}

	function Entry(x, y, percentage, title, ip){
		this.width=150;
		this.height=100;
		this.x=x;
		this.y=y;
		this.percentage=percentage;
		this.title=title;
		this.ip=ip;
	}

	Entry.prototype.underCursor = function(){
		return mousePos.x < this.x+this.width && mousePos.x > this.x && mousePos.y < this.y+this.height && mousePos.y > this.y;
	}

	function colorWithPercentage(percentage){
		if(percentage <= 5){
			return "#30ff00";
		}
		else if(percentage <= 20){
			return "#d7c820";
		}
		else if(percentage <= 40){
			return "#e06013";
		}
		else
		{
			return "#f31b1b";
		}
	}

	function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
		if (typeof stroke == "undefined" ) {
			stroke = true;
		}
		if (typeof radius === "undefined") {
			radius = 5;
		}
		ctx.beginPath();
		ctx.moveTo(x + radius, y);
		ctx.lineTo(x + width - radius, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
		ctx.lineTo(x + width, y + height - radius);
		ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
		ctx.lineTo(x + radius, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
		ctx.lineTo(x, y + radius);
		ctx.quadraticCurveTo(x, y, x + radius, y);
		ctx.closePath();
		if (stroke) {
			ctx.stroke();
		}
		if (fill) {
			ctx.fill();
		}        
	}

	function drawEntry(entry){
		var oldWidth = context.lineWidth;
		context.lineWidth = 1;
		context.fillStyle=colorWithPercentage(entry.percentage);

		roundRect(context, entry.x, entry.y, entry.width, entry.height, 10, true, true);
		context.font="20px Verdana";
		context.fillStyle="#000000";
		context.fillText(entry.title, entry.x+entry.width/2-context.measureText(entry.title).width/2, entry.y+40);
		context.font="12px Courier";
		context.fillText(entry.percentage+"% packet loss", entry.x+entry.width/2-context.measureText(entry.percentage+"% packet loss").width/2, entry.y+60);

		context.lineWidth=oldWidth;
	}

	function drawLabel(x, y, text){
		var oldWidth = context.lineWidth;
		context.lineWidth = 1;
		context.fillStyle=labelFill;

		context.font="15px Courier";
		textWidth = context.measureText(text).width;
		roundRect(context, x, y-23, textWidth, 20, 1, true, true);
		context.fillStyle="#000000";
		context.fillText(text, x, y-6);

		context.lineWidth-oldWidth;
	}

	context.lineJoin = 'round';

	entries.push(new Entry(canvas.width/2-width/2, 0, thlefwneio, "Τηλεφωνείο", "150.140.208.65"));

	entries.push(new Entry(canvas.width/2-width/2, 1.5*height, omadaDiktyou, "Ομάδα Δικτύου", "150.140.208.66"));

	entries.push(new Entry(canvas.width/4-width/2, 3*height, b, "B", "150.140.211.126"));

	entries.push(new Entry(canvas.width/9-width/2, 4.5*height, a, "A", "150.140.210.126"));

	entries.push(new Entry(canvas.width/2-canvas.width/9-width/2, 4.5*height, c, "Γ", "150.140.212.126"));

	entries.push(new Entry(3*canvas.width/4-width/2, 3*height, h, "H", "150.140.216.126"));

	entries.push(new Entry(3*canvas.width/2-8*canvas.width/9-width/2, 4.5*height, z, "Z", "150.140.215.126"));

	entries.push(new Entry(8*canvas.width/9-width/2, 4.5*height, th, "Θ", "150.140.217.126"));

	render();

});