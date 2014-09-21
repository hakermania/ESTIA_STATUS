$(document).ready(function(){

	var canvas = document.getElementById("networkCanvas");
	canvas.width = 1000;
	canvas.height = 600;

	labelFill="#f5da43";
	pingFill="#d8d525";

	var width=150; //all entries have set width and height
	var height=100;

	var pingRadius=5;

	var context = canvas.getContext("2d");

	var entries = [];
	var pings = [];

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

	var time;

	var render = function() {

		var now = new Date().getTime(),
		dt = now - (time || now);

		time = now;
		// Clear the canvas
		context.clearRect(0, 0, canvas.width, canvas.height);

		// Draw the lines between the entries

		drawConnection(entries[0], entries[1]);

		drawConnection(entries[1], entries[2]);

		drawConnection(entries[1], entries[5]);

		drawConnection(entries[2], entries[3]);

		drawConnection(entries[2], entries[4]);

		drawConnection(entries[5], entries[6]);

		drawConnection(entries[5], entries[7]);

		// Draw the pings. These have to be above the lines, below the entries

		var oldWidth = context.lineWidth;
		context.lineWidth = 2;

		context.fillStyle=pingFill;

		for(i=pings.length-1; i>=0; i--){
			if(pings[i].delay>0){
				pings[i].delay-=dt;
				continue;
			}
			context.beginPath();
			context.arc(pings[i].paths[0].xc, pings[i].paths[0].yc, pings[i].radius, 0, 2*Math.PI);
			context.closePath();
			context.fill();
			pings[i].paths[0].xc+=pings[i].paths[0].xadd*dt*0.05;
			pings[i].paths[0].yc+=pings[i].paths[0].yadd*dt*0.05;
			var animationPathEnded=false;
			if(pings[i].paths[0].xadd>0){
				if(pings[i].paths[0].xc>pings[i].paths[0].xf){
					animationPathEnded=true;
				}
			}
			else if(pings[i].paths[0].xadd<0){
				if(pings[i].paths[0].xc<pings[i].paths[0].xf){
					animationPathEnded=true;
				}
			}
			else if(pings[i].paths[0].yadd>0){
				if(pings[i].paths[0].yc>pings[i].paths[0].yf){
					animationPathEnded=true;
				}
			}
			else if(pings[i].paths[0].yadd<0){
				if(pings[i].paths[0].yc<pings[i].paths[0].yf){
					animationPathEnded=true;
				}
			}
			if(animationPathEnded){
				//animation has come to an end.
				console.log("ANIMATION ENDED");
				pings[i].paths.splice(0, 1);
				if(pings[i].paths.length==0){
					console.log("PING HAS TO BE REMOVED");
					pings.splice(i, 1);
					i--;
				}
			}
		}

		context.lineWidth = oldWidth;

		// Draw the entries and if mouse is above one, make sure to keep its id

		entryLabelId=-1;

		for(i=0; i < entries.length; i++){
			drawEntry(entries[i]);
			if(entryLabelId==-1 && entries[i].underCursor()){
				entryLabelId=i;
			}
		}

		// Label has to be drawn last (in order to be above everything else)

		if(entryLabelId!=-1){
			//this means that the mouse is above an entry, so the label has to be drawn
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

	function Entry(x, y, percentage, title, ip, comment){
		this.width=width;
		this.height=height;
		this.x=x;
		this.y=y;
		this.percentage=percentage;
		this.title=title;
		this.ip=ip;
		if(typeof(comment)==='undefined')
			this.comment="";
		else
			this.comment=comment;
	}

	Entry.prototype.underCursor = function(){
		return mousePos.x < this.x+this.width && mousePos.x > this.x && mousePos.y < this.y+this.height && mousePos.y > this.y;
	}

	function Ping(radius, startingDelay){
		this.radius=radius;
		this.delay=startingDelay;
		this.paths=[];
	}

	Ping.prototype.addPath = function(a, b, c, d){

		xadd1=0;
		yadd1=0;

		if((a-c)==0 && (b-d)==0){
			xadd1=0;
			yadd1=0;
		}
		else if((a-c)==0){
			xadd1=0;
			yadd1 = (d - b)*0.03;
		}
		else if ((b-d)==0){
			xadd1 = (c - a)*0.03;
			yadd1=0;
		}
		else
		{
			xadd1 = (c - a)*0.03/Math.abs(b-d);
			yadd1 = xadd1*(d - b)/(c-a);
		}

		console.log("Pushing a path!");

		this.paths.push({xadd: xadd1, yadd: yadd1, xc: a, yc: b, xf: c, yf: d});
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
		if(entry.comment!=""){
			context.font="10px Verdana";
			context.fillStyle="#FF0000";
			context.fillText(entry.comment, entry.x+entry.width/2-context.measureText(entry.comment).width/2, entry.y+90);
		}
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

	function pingWithPath(path, delay){
		var ping = new Ping(pingRadius, delay);

		if(path == "ot"){
			ping.addPath(canvas.width/2, 1.5*height+2*pingRadius, canvas.width/2, height-2*pingRadius);
		}
		else if(path == "ob"){
			ping.addPath(entries[1].x, entries[1].y+entries[1].height/2, entries[2].x+entries[2].width/2, entries[1].y+entries[1].height/2);
			ping.addPath(entries[2].x+entries[2].width/2, entries[1].y+entries[1].height/2, entries[2].x+entries[2].width/2, entries[2].y+height/2);
		}
		else if(path == "ho"){
			ping.addPath(entries[5].x+entries[5].width/2, entries[5].y+2*pingRadius, entries[5].x+entries[5].width/2, entries[1].y+height/2);
			ping.addPath(entries[5].x+entries[5].width/2, entries[1].y+height/2, entries[1].x+entries[1].width-2*pingRadius, entries[1].y+height/2);
		}
		else if(path == "ba"){
			ping.addPath(entries[2].x+entries[2].width/2, entries[2].y+entries[2].height/2, entries[3].x+entries[3].width/2, entries[2].y+entries[2].height/2);
			ping.addPath(entries[3].x+entries[3].width/2, entries[2].y+entries[2].height/2, entries[3].x+entries[3].width/2, entries[3].y+entries[3].height/2)
		}
		else if(path == "bc"){
			ping.addPath(entries[2].x+entries[2].width/2, entries[2].y+entries[2].height/2, entries[4].x+entries[4].width/2, entries[2].y+entries[2].height/2);
			ping.addPath(entries[4].x+entries[4].width/2, entries[2].y+entries[2].height/2, entries[4].x+entries[4].width/2, entries[4].y+entries[4].height/2)
		}
		else if(path == "hz"){
			ping.addPath(entries[5].x+entries[2].width/2, entries[5].y+entries[5].height/2, entries[6].x+entries[6].width/2, entries[5].y+entries[5].height/2);
			ping.addPath(entries[6].x+entries[6].width/2, entries[5].y+entries[5].height/2, entries[6].x+entries[6].width/2, entries[6].y+entries[6].height/2)	
		}
		else if(path == "h8"){
			ping.addPath(entries[5].x+entries[5].width/2, entries[5].y+entries[5].height/2, entries[7].x+entries[7].width/2, entries[5].y+entries[5].height/2);
			ping.addPath(entries[7].x+entries[7].width/2, entries[5].y+entries[5].height/2, entries[7].x+entries[7].width/2, entries[7].y+entries[7].height/2)
		}

		return ping;
	}

	function launchPings(){
		for(i=0;i<3;i++){
			if(i==0)
				pings.push(pingWithPath("ot", 0));
			pings.push(pingWithPath("ob", i*200));
			pings.push(pingWithPath("ba", i*200));
			pings.push(pingWithPath("bc", i*200));
			pings.push(pingWithPath("ho", i*200));
			pings.push(pingWithPath("hz", i*200));
			pings.push(pingWithPath("h8", i*200));
		}
	}

	context.lineJoin = 'round';

	entries.push(new Entry(canvas.width/2-width/2, 0, thlefwneio, "Τηλεφωνείο", "150.140.208.65"));

	entries.push(new Entry(canvas.width/2-width/2, 1.5*height, omadaDiktyou, "Ομάδα Δικτύου", "150.140.208.66"));

	entries.push(new Entry(canvas.width/4-width/2, 3*height, b, "B", "150.140.211.126"));

	entries.push(new Entry(canvas.width/9-width/2, 4.5*height, a, "A", "150.140.210.126"));

	entries.push(new Entry(canvas.width/2-canvas.width/9-width/2, 4.5*height, c, "Γ", "150.140.212.126"));

	entries.push(new Entry(3*canvas.width/4-width/2, 3*height, h, "H", "150.140.216.126", "(PING SOURCE)"));

	entries.push(new Entry(3*canvas.width/2-8*canvas.width/9-width/2, 4.5*height, z, "Z", "150.140.215.126"));

	entries.push(new Entry(8*canvas.width/9-width/2, 4.5*height, th, "Θ", "150.140.217.126"));

	setInterval(launchPings, 1000);

	render();

});