$(document).ready(function(){

	var entryWidth=150;
	var entryHeight=100;

	function colorWithPercentage(percentage){
		if(percentage <= 5){
			return "#30ff00";
		}
		else if(percentage<=20){
			return "#d7c820";
		}
		else if(percentage<=40){
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

	function newEntry(x, y, percentage, title){
		var oldWidth = context.lineWidth;
		context.lineWidth = 1;
		context.fillStyle=colorWithPercentage(percentage);
		roundRect(context, x, y, entryWidth, entryHeight, 10, true, true);
		context.font="20px Verdana";
		context.fillStyle="#000000";
		
		context.fillText(title, x+entryWidth/2-context.measureText(title).width/2, y+40);
		context.font="12px Courier";
		context.fillText(percentage+"% packet loss", x+entryWidth/2-context.measureText(percentage+"% packet loss").width/2, y+60);
		context.lineWidth=oldWidth;
	}

	
	var canvas = document.getElementById("network");
	var context = canvas.getContext("2d");

	canvas.width = 1000;
	canvas.height = 600;

	context.lineJoin = 'round';

	newEntry(canvas.width/2-entryWidth/2, 0, thlefwneio, "Τηλεφωνείο")

	
	//Omada diktyou

	context.lineWidth = 10;

	context.beginPath();
	context.moveTo(canvas.width/2, entryHeight);
	context.lineTo(canvas.width/2, 1.5*entryHeight);
	context.stroke();

	newEntry(canvas.width/2-entryWidth/2, 1.5*entryHeight, omadaDiktyou, "Ομάδα Δικτύου")

	context.beginPath();
	context.moveTo(canvas.width/2-entryWidth/2, 2*entryHeight);
	context.lineTo(canvas.width/4, 2*entryHeight);
	context.lineTo(canvas.width/4, 3*entryHeight);
	context.stroke();

	context.beginPath();
	context.moveTo(canvas.width/2+entryWidth/2, 2*entryHeight);
	context.lineTo(3*canvas.width/4, 2*entryHeight);
	context.lineTo(3*canvas.width/4, 3*entryHeight);
	context.stroke();

	//B

	newEntry(canvas.width/4-entryWidth/2, 3*entryHeight, b, "B");

	context.beginPath();
	context.moveTo(canvas.width/4-entryWidth/2, 3.5*entryHeight);
	context.lineTo(canvas.width/9, 3.5*entryHeight);
	context.lineTo(canvas.width/9, 4.5*entryHeight);
	context.stroke();

	//A

	newEntry(canvas.width/9-entryWidth/2, 4.5*entryHeight, a, "A");

	context.beginPath();
	context.moveTo(canvas.width/4+entryWidth/2, 3.5*entryHeight);
	context.lineTo(canvas.width/2-canvas.width/9, 3.5*entryHeight);
	context.lineTo(canvas.width/2-canvas.width/9, 4.5*entryHeight);
	context.stroke();

	//C

	newEntry(canvas.width/2-canvas.width/9-entryWidth/2, 4.5*entryHeight, c, "Γ");

	//H

	newEntry(3*canvas.width/4-entryWidth/2, 3*entryHeight, h, "H");

	context.beginPath();
	context.moveTo(3*canvas.width/4-entryWidth/2, 3.5*entryHeight);
	context.lineTo(3*canvas.width/2-8*canvas.width/9, 3.5*entryHeight);
	context.lineTo(3*canvas.width/2-8*canvas.width/9, 4.5*entryHeight);
	context.stroke();

	//Z

	newEntry(3*canvas.width/2-8*canvas.width/9-entryWidth/2, 4.5*entryHeight, z, "Z");

	context.beginPath();
	context.moveTo(3*canvas.width/4+entryWidth/2, 3.5*entryHeight);
	context.lineTo(8*canvas.width/9, 3.5*entryHeight);
	context.lineTo(8*canvas.width/9, 4.5*entryHeight);
	context.stroke();

	//TH

	newEntry(8*canvas.width/9-entryWidth/2, 4.5*entryHeight, th, "Θ");

});
