"use strict";
var scorm 			= pipwerks.SCORM;
var courseCode 		= $(document).attr('title').split('_')[0];
var courseLength;
var exitCourse 		= false;

	var SCORMuser,
		SCORMmastery,
		SCORMscore;

	var SCORMsuspenddata;
		var SUSPENDpagecompletion;
		var SUSPENDbookmark;
		var SUSPENDattemptquiz;
		var SUSPENDquizUserans;
		var SUSPENDlastaccessdate;

$(document).ready(function(){
	$('#courseTitle').text($(document).attr('title').split('_')[1])
	$('#courseLengthGetter').load("index.html #TOC", function(){
		courseLength = $('#TOC li').length;
		initSCORM();
		setPrint();
	});
});

/*-----------------------------------------------
  ------------------ FUNCTIONS ------------------
  -----------------------------------------------*/

function initSCORM() {

	if(window.location.protocol === "https:"){		//checks if launcher is opened in eLearn or locally
		var lmsConnected = scorm.init();
		if(lmsConnected){

			SCORMuser 		= scorm.get("cmi.core.student_name");
			SCORMmastery 	= scorm.get("cmi.student_data.mastery_score")
			SCORMscore 		= Math.round(scorm.get("cmi.core.score.raw"));

			SCORMsuspenddata 		= scorm.get("cmi.suspend_data").split("|");
				SUSPENDpagecompletion	= SCORMsuspenddata[0];
				SUSPENDbookmark			= SCORMsuspenddata[1];
				SUSPENDattemptquiz 		= SCORMsuspenddata[2];
				SUSPENDquizUserans		= SCORMsuspenddata[3];
				SUSPENDlastaccessdate 	= SCORMsuspenddata[4];

			
			/*alert('SCORMsuspenddata ' 		+ SCORMsuspenddata)
			alert('SUSPENDpagecompletion ' 	+ SUSPENDpagecompletion)
			alert('SUSPENDbookmark ' 		+ SUSPENDbookmark)
			alert('SUSPENDattemptquiz ' 	+ SUSPENDattemptquiz)
			alert('SUSPENDquizUserans ' 	+ SUSPENDquizUserans)
			alert('SUSPENDlastaccessdate ' 	+ SUSPENDlastaccessdate)
			*/

			if(SUSPENDpagecompletion.length == 0) {
				SUSPENDpagecompletion = [];
				for(var i=0;i<courseLength;i++){
					SUSPENDpagecompletion[i]=0;
				}
			}else{
				SUSPENDpagecompletion = SUSPENDpagecompletion.split(",")
			}


			if(SUSPENDbookmark){
				$('#remarksStat').text("Welcome back "+SCORMuser+". You last accessed this topic on "+SUSPENDlastaccessdate+".");
				$('#restartbtn').text("Start from beginning");
			}else{
				SUSPENDbookmark = 0;
				$('#remarksStat').text("Welcome "+SCORMuser+". It is your first time here. Please begin the course by clicking on the start button.");
				$('#continuebtn').hide();
			}

			if(!SUSPENDquizUserans){
				SUSPENDquizUserans = [];
				for(var i=0; i<courseLength; i++){
					SUSPENDquizUserans[i] = [];
				}
			}else{
				//alert("luancher "+SUSPENDquizUserans)
				SUSPENDquizUserans = eval("["+SUSPENDquizUserans+"]");
				//alert("luancher 2 "+SUSPENDquizUserans+"     "+SUSPENDquizUserans.length)
			}

			var now = new Date();
			SUSPENDlastaccessdate = now.getDate()+"/"+(now.getMonth()+1)+"/"+now.getFullYear();

			animatePieChart();

		}else{
			//alert("LMS did not connect properly");
			location.reload();			
		}
	}else{
		//--- this is for local testing purposes -----
		courseLength 			= 7;
		SUSPENDbookmark 		= 1;
		SCORMscore 				= 25;
		SCORMmastery 			= 50;
		SUSPENDpagecompletion	= [0,0,0,0,0,0,0];
		SUSPENDattemptquiz 		= true
		SUSPENDquizUserans		= [/*,,[2],,,,[4,3,1]*/];

		for(var i=0; i<courseLength; i++){
			SUSPENDquizUserans[i] = [];
		}
		animatePieChart();
	}
}

function getAvgCompletion(){
	var x = 0;
	for(var i=0; i<courseLength; i++){
		x += Number(SUSPENDpagecompletion[i]);
	}
	x = Math.floor(x/courseLength);
	return x;
}


function fnrestart(){
	SUSPENDbookmark = 1;
	fnpopup();
};


function fnpopup(){
	//scorm.save(); //save all data that has already been sent
    //scorm.quit(); //close the SCORM API connection properly

	var win = "HTML5_Course";     
	var courseWin = window.open('index.html',win,'width=1024, height=768');
	
	if(window.location.protocol === "https:"){
		$('#wrapper button').hide();
		var timer = setInterval(function() {
			if(courseWin.closed) {
				exitCourse = true;
				for(var i=0; i<SUSPENDquizUserans.length; i++){
					SUSPENDquizUserans[i] = "["+SUSPENDquizUserans[i]+"]"
				}
				//--------Pack info into SUSPENDDATA----------------------
				SCORMsuspenddata = 	SUSPENDpagecompletion+"|"+
									SUSPENDbookmark+"|"+
									SUSPENDattemptquiz+"|"+
									SUSPENDquizUserans+"|"+
									SUSPENDlastaccessdate;

				scorm.set("cmi.suspend_data",SCORMsuspenddata);
				scorm.set("cmi.core.score.raw", SCORMscore);
				if(getAvgCompletion() === 100){
					scorm.set("cmi.core.lesson_status", "completed");			
				}

				animatePieChart();

				clearInterval(timer);
			}  
		}, 1000);
	}
};

var unloaded = false;
function unloadHandler(){
   if(!unloaded){
      scorm.save(); //save all data that has already been sent
      scorm.quit(); //close the SCORM API connection properly
      unloaded = true;
   }
}
window.onbeforeunload = unloadHandler;
window.onunload = unloadHandler;


function printcheck(){
	alert('Think about the trees. Do you really need to print?');
	window.print();
}


/*function drawEmptyPie(){
	var p = document.getElementById("progressCanvas");
	var s = document.getElementById("scoreCanvas");
	var pCTX = p.getContext("2d")
	var sCTX = s.getContext("2d");
	var CTX = [pCTX, sCTX]
	var sAngle = 1.5*Math.PI;
	var centerX = Math.floor(p.width / 2);
	var centerY = Math.floor(p.height / 2);

	for(var l=0; l<CTX.length; l++){
		CTX[l].lineWidth = 2;
		CTX[l].fillStyle="#fcefef";
		CTX[l].strokeStyle="#f7ddd7";
	
		CTX[l].beginPath();
		CTX[l].moveTo(centerX, centerY);
		CTX[l].arc(centerX, centerY, 90, sAngle, 3.5 * Math.PI);
		CTX[l].fill();
		CTX[l].stroke();
		CTX[l].closePath();
	}


	var erase_image = new Image();
	erase_image.src = 'interface_assets/img/percentageScale.svg';           
	erase_image.onload = function()
	{
	     CTX[l].drawImage(erase_image, 0, 0);
	}
};*/

function animatePieChart() {
	var start = null;

	$('#completionStat .stats').text(getAvgCompletion()+" %")
	if(getAvgCompletion() < 100){
		$('#courseStat .stats').addClass('red');
	}else{
		$('#courseStat .stats').text("Completed").removeClass('red').addClass('green');
	}

	if(SUSPENDattemptquiz == "true"){
		$('#scoreStat .stats').text(SCORMscore+" %");
		if(SCORMscore >= SCORMmastery) {
			$('#successStat .stats').text("Passed").removeClass('red').addClass('green')					
		}else{
			$('#successStat .stats').text("Failed").addClass('red');
		}
	}

	window.requestAnimationFrame(step);

	function step(timestamp) {
		if (!start) start = timestamp;
			var progress = timestamp - start;
			drawProgressPie(Math.min(progress / 25, getAvgCompletion()));
			drawScorePie(Math.min(progress / 25, SCORMscore));
		if (progress < 2500) {
			window.requestAnimationFrame(step);
		}else{
			if(exitCourse){
				window.history.back();
			}
		}
	}	
}

var p,
	s,
	sAngle,
	eAngle,
	centerX,
	centerY;

function drawProgressPie(progress){
	p = document.getElementById("progressCanvas");
	sAngle = 1.5*Math.PI;
	eAngle = ((progress/100)*2+1.5)*Math.PI;
	centerX = Math.floor(p.width / 2);
	centerY = Math.floor(p.height / 2);

	var pCTX = p.getContext("2d")

	drawChart(pCTX);
}

function drawScorePie(score){
	s = document.getElementById("scoreCanvas");
	sAngle = 1.5*Math.PI;
	eAngle = ((score/100)*2+1.5)*Math.PI;
	centerX = Math.floor(s.width / 2);
	centerY = Math.floor(s.height / 2);

	var sCTX = s.getContext("2d");

	drawChart(sCTX);
}

function drawChart(CTX){	
	CTX.clearRect(0, 0, p.width, p.height);	//clears the canvas to prepare for new animation frame

	/*------------ Draws empty red pie ------------*/

	//pCTX.lineWidth = 2;
	//pCTX.strokeStyle="#f7ddd7";
	CTX.fillStyle="#fcefef";
	CTX.beginPath();
	CTX.moveTo(centerX, centerY);
	CTX.arc(centerX, centerY, 110, sAngle, 3.5 * Math.PI);
	CTX.closePath();
	CTX.fill();
	//CTX.stroke();

	/*	-------------- Draws green pie --------------*/

	//CTX.lineWidth = 1;
	//CTX.strokeStyle="#8cc47b";
	CTX.fillStyle="#c0e8b2";
	CTX.beginPath();
	CTX.moveTo(centerX, centerY);
	CTX.arc(centerX, centerY, 114, sAngle, eAngle);
	CTX.closePath();
	CTX.fill();
	//CTX.stroke();

	/*-------------- Draws white pie --------------*/

	//CTX.lineWidth = 2;
	//CTX.strokeStyle="#f7ddd7";
	CTX.fillStyle="#FAFAFA";	
	CTX.beginPath();
	CTX.moveTo(centerX, centerY);
	CTX.arc(centerX, centerY, 94, sAngle, 3.5 * Math.PI);
	CTX.closePath();
	CTX.fill();
	//CTX.stroke();


	//var erase_image = new Image();
	//erase_image.src = 'interface_assets/img/percentageScale.svg';

	/*sCTX.fillStyle="black";
	sCTX.font = "20px arial";
	sCTX.fillText(score+"%", centerX+10, centerY-10);*/

	/*erase_image.onload = function() {
		sCTX.drawImage(erase_image,21.5,0);
		//alert(this.height/2)
	}*/
};

function setPrint(){
	for(var i=1; i<=courseLength; i++) {
		var pageDiv = document.createElement('div');
			//pageDiv.setAttribute("id", "pageDIV"+i);
			//pageDiv.attr("id", "pageDIV"+i);
		//alert(i);
		//var pagetoLoad = eval(courseCode + '_' + i +'.html');		
		document.getElementById('print').appendChild(pageDiv);

		$(pageDiv).load(courseCode + '_' + i +'.html');//, function(data){
			/*			
			alert(data);
			function removeThis(start,end){
				if(content.search(start) != -1){
					var a = content.split(start)[0];
					var b = content.split(end)[1];
				
					return a.concat(b)
				}else{
					return content
				}
			}
			*/
		//});			
	};
		
	/* ------Does Action when printable version is completely loaded
	printAll.done(function(){
		actions to do when the printAll has completed loading. Not 100% working.
	});
	*/
}