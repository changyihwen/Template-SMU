// JavaScript Document

var Qtotal 				= $('article.content .QUIZ').length;

var QpercentSize		= 20;			// how much percentage QUIZ questions takes up in the progressbar
										// this value is also used at smu_template.js

	Qcompletion 		= 0;			// this variable is found at smu_template.js. 
										// it help to detect the completed quiz and reflects it back onto the page completion status
										// it is set to null when there is no quiz elements and set to zero when the page contains quiz

var MCQattempts 		= 2;
var MCQAttemptsLeft 	= [];
var MCQrightAns 		= null;

var score 				= null;

//alert(window.opener.SUSPENDquizUserans +"     "+ window.opener.SUSPENDquizUserans[navNum]);

var userAnsArray 		= window.opener.SUSPENDquizUserans[navNum];

initQuiz();

//var Stime,Etime,Ttime;
//Stime = new Date();


//for(var i=0; i<Qtotal; i++){
//	$('.MCQ:eq('+i+') input:radio').attr('name','MCQ'+i);
	//MCQAttemptsLeft[i] = MCQattempts;

	/*
	//---------------- If this page is being called by MAIN from index.html, then set up SCORM for the MCQ questions--------------------------
	if(window.opener !== null && IsContent == "MAIN") {		
		window.opener.scorm.set("cmi.interactions."+i+".id","Question_"+(i+1));		// NOTE: SCORM interactions id must not have empty space
		window.opener.scorm.set("cmi.interactions."+i+".type","choice");			// NOTE: SCORM interactions type must be set to "other" so that all kinds of answers can be accepted
		window.opener.scorm.set("cmi.interactions."+i+".correct_responses.0.pattern", $('.MCQ:eq('+i+') .correctOption').text());
		window.opener.scorm.set("cmi.interactions."+i+".weighting","1");
		//scorm.set("cmi.interactions."+i+".description", $('.MCQ:eq('+i+') .qn').text());
		//scorm.SetScoreRaw("50");
		//scorm.set("cmi.score.raw",50);
		//alert("Raw Score : "+scorm.GetScoreRaw());
		//alert("Raw Score : "+scorm.get("cmi.score.raw"));
	}
	//----------------------------------------------------------------------------------------------------------------------------------------
	*/
//}


/*---------------------------------------------------------------------------
  -------------------------------- Functions -------------------------------- 
  ---------------------------------------------------------------------------*/

function initQuiz(){

	var QuizCompleted = 0;

	if(userAnsArray == undefined){
		userAnsArray = [];
	}

	for(var i=0; i<Qtotal; i++){	
		if(userAnsArray[i]){
			//set up questions that have been answered	
			MCQrightAns = $('.MCQ:eq('+i+')').attr('data-ans')-1;

			$('.MCQ:eq('+i+') input').attr('disabled','disabled');
			$('.MCQ:eq('+i+') input:eq('+(userAnsArray[i]-1)+')').prop('checked',true);
			$('.MCQ:eq('+i+') label').css('cursor','default');
			$('.MCQ:eq('+i+') ol li:eq('+(userAnsArray[i]-1)+')').css('background-color','rgb(235,200,200)');
			$('.MCQ:eq('+i+') ol li:eq('+MCQrightAns+')').css('background-color','rgb(170,235,170)');
			MCQAttemptsLeft[i] = 0;
		}else{
			//set up questions that have not been completed	
			$('.MCQ:eq('+i+') input').attr('disabled',false);
			$('.MCQ:eq('+i+') input:radio').prop('checked',false);
			$('.MCQ:eq('+i+') label').css('cursor','pointer');
			$('.MCQ:eq('+i+') ol li').css('background-color','transparent');

			$('.MCQ:eq('+i+') input:radio').attr('name','MCQ'+i);
			MCQAttemptsLeft[i] = MCQattempts;
		}
		QuizCompleted = QuizCompleted + MCQAttemptsLeft[i];
	}

	Qcompletion = (QpercentSize/Qtotal)*userAnsArray.length;

	if(QuizCompleted == 0){
		$('#QuizComplete').css('display','block');
	}
}

function QUIZupdateProgress(){
	if(pagescompletion[navNum] < 100){
		pagescompletion[navNum] = Number(pagescompletion[navNum]) + (QpercentSize	/Qtotal);
		Qcompletion += QpercentSize	/Qtotal;
	}

	$('nav #TOC li span:eq('+navNum+')').text(pagescompletion[navNum] +"%");

	if(pagescompletion[navNum] === 100){
		$('nav #TOC li span:eq('+navNum+')').text('✔').addClass('completeMark');
	}

	//--------------------update progress bar-------------------------
		$("#progress #bar").css('width', window.opener.getAvgCompletion()+'%');
	//----------------------------------------------------------------
}


//function checkPassStat(x){
	//var prevScore = window.opener.scorm.get("cmi.core.score.raw");
	//if(x > window.opener.SCORMscore){
		//window.opener.SCORMscore = x;
		//window.opener.scorm.set("cmi.core.score.raw",x);
		/*if(x >= window.opener.scorm.get("cmi.student_data.mastery_score")){
			window.opener.scorm.set("cmi.core.lesson_status", "passed");
		}else{
			window.opener.scorm.set("cmi.core.lesson_status", "failed");
		}*/
	//}	
//}



/*---------------------------------------------------------------------------
  ---------------------------------- EVENTS ---------------------------------
  ---------------------------------------------------------------------------*/


$('input[type=radio]').click(function(){
	$(this).closest('ol').siblings('input[type=button]').fadeIn('fast');
	$(this).closest('ol').siblings('.feedback').text('');
});

$('.MCQ input:button').click(function(){

	var MCQgroup 		= $(this).parent().index('.MCQ');
	var MCQuserAns 		= $('input[name=MCQ'+MCQgroup+']:checked').closest('li').index()+1;		//finds the ancestor until closest 'li' is found and get index of user's selected answer
	var MCQuserAnsText 	= $('input[name=MCQ'+MCQgroup+']:checked').parent('label').text();		//gets correct answer of this MCQ

		MCQrightAns 	= $(this).closest('.MCQ').attr('data-ans');


	$(this).hide();	

	if(!$(this).parent().hasClass('Scoreless')){
		window.opener.SUSPENDattemptquiz = "true";
		//window.opener.scorm.set("cmi.interactions."+MCQgroup+".student_response", MCQuserAnsText);		//For SCORM Tracking of user answer (textual content)
		//window.opener.scorm.set("cmi.interactions."+MCQgroup+".latency", Ttime);
	}

	MCQAttemptsLeft[MCQgroup] = MCQAttemptsLeft[MCQgroup]-1;

	if(MCQuserAns == MCQrightAns) {
		MCQAttemptsLeft[MCQgroup] = 0;
		$(this).siblings('.feedback')	.text('✔ Correct.')
										.css('color','rgb(30,125,30)');

		if(!$(this).parent().hasClass('Scoreless')){			
			score = window.opener.SCORMscore + (100/Qtotal);		// For SCORM : reflects the score of the learner
			if(score > window.opener.SCORMscore){
				window.opener.SCORMscore = score;
			}
			//if(window.opener) {
			//	window.opener.scorm.set("cmi.interactions."+MCQgroup+".result","correct");		// For SCORM Tracking of user answer (correct or incorrect)
			//}
			//checkPassStat(score)
		}

	}else{
		$(this).siblings('.feedback').css('color','rgb(125,30,30)');
		if(MCQAttemptsLeft[MCQgroup] !== 0){
			$('input[name=MCQ'+MCQgroup+']:radio').prop('checked',false);
			$(this).siblings('.feedback').text('✘ Incorrect. Please try again.');
		}else{
			$(this).siblings('.feedback').text('✘ Incorrect. The correct answer is highlighted above.');
		}
		//if(window.opener) {
		//	window.opener.scorm.set("cmi.interactions."+MCQgroup+".result","wrong");			// For SCORM Tracking of user answer (correct or incorrect)
		//}
	}

	if(MCQAttemptsLeft[MCQgroup] == 0){	
		$('.MCQ input[name=MCQ'+MCQgroup+']').attr('disabled','disabled');
		$('.MCQ input[name=MCQ'+MCQgroup+']').parent('label').css('cursor','default');
		$('.MCQ input[name=MCQ'+MCQgroup+']:eq('+(MCQrightAns-1)+')')
			.closest('li').css('background-color','rgb(170,235,170)');

		
		userAnsArray[MCQgroup] = MCQuserAns
		//alert("userAnsArray "+userAnsArray)

		window.opener.SUSPENDquizUserans[navNum] = userAnsArray;
		QUIZupdateProgress();

		if($(this).siblings('.explain').text() !== ""){
			$(this).siblings('.explain').fadeIn('fast');
		}	
	}


	/*
	Etime = new Date();
	Ttime = Math.round((Etime.getTime() - Stime.getTime())/1000);
	//---------------Convert Time to SCORM format for cmi.interactions.n.latency, which is "PT1H20M59S" meaning its 1HOUR 20MINS 59 SECONDS --------------------------
	if(Ttime >59){
		var MIN = Math.floor(Ttime/60);
		var SEC = Ttime % 60;
		if(MIN < 10){
			MIN = "0"+MIN;
		}
		if(SEC < 10){
			SEC = "0"+SEC;
		}
		//Ttime = "PT"+MIN+"M"+SEC+"S"
		Ttime = "00"+":"+MIN+":"+SEC
	}else{
		if(Ttime < 10){
			Ttime = "0"+Ttime;
		}
		Ttime = "00"+":"+"00"+":"+Ttime
	}		
	//alert(Ttime)
	Stime = new Date();
	//----------------------------------------------------------------------------------------------------------------------------------------------------------------
	*/

});