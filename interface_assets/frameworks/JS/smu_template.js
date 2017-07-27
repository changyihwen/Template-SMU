
// Detects if index is opened by launcher
if(window.opener){
	var courseCode 		= window.opener.courseCode;
	var courseLength 	= window.opener.courseLength;
	var pageNum 		= Number(window.opener.SUSPENDbookmark);
	var pagescompletion = window.opener.SUSPENDpagecompletion;
}else{
	var courseCode 		= $(document).attr('title').split('_')[0];
	var courseLength 	= $('nav #TOC li').length;
	var pageNum 		= 1;
	var pagescompletion = [0,0,0,0,0,0,0];
}

var art 				= $('article');
var foot 				= $('footer');

var navNum 				= pageNum - 1;
var prenavNum 			= null;
var mobileVersion		= null;
var prevVersion			= null;

var Qcompletion			= null;				// this variable is also used in smu_MCQ_SCORM.js. 
											// it help to detect the completed quiz and reflects it back onto the page completion status
											// it is set to null when there is no quiz elements and set to zero when the page contains quiz


//var NoteEnabled			= false;

//--------- Variable for touch function ------------
var xDown,
	yDown,
	sTime,
	eTime,
	xUp,
	yUp 			= null;
var swipeTiming 	= 250;
var swipeDistance 	= 100;
var swipping		= false;



$(document).ready(function() {
	"use strict";
	initialise();
	detectSize();
	loadPage();
}).scroll(function() {
	"use strict";
	//fixedMenu();
	showreturnTop();
	detectComplete();
});

if(is_touch_device()){
	document.addEventListener('touchstart', handleTouchStart, false);
	document.addEventListener('touchend', handleTouchEnd, false);
	document.addEventListener('touchmove', handleTouchMove, false);

	foot.hide();
}

window.onresize = function(){
	"use strict";
	detectSize();
	//fixedMenu();
};

$('#menuBar p').click(function(){
	"use strict";
	var currSize = parseInt($('header').css('font-size'));
	var childID = $(this).attr('id');

	if(childID === 'Mzoomin' && currSize!==22) {			//if is increase font size button
		currSize = currSize+2;
		fontSize(currSize);
	}else if(childID === 'Mzoomout' && currSize!==14) {		//if is decrease font size button
		currSize = currSize-2;
		fontSize(currSize);
	}else if(childID === 'Mmenu'){						//if is menu button
		if($(document).scrollTop() > $('header').outerHeight()){
			//$('nav').show();
			//$('#TOC').removeClass('hideNav');
			$('nav').removeClass('hideNav');
			returnToTop();			
		}else{
			//$('nav').toggle();
			//$('#TOC').toggleClass('hideNav');
			$('nav').toggleClass('hideNav');
		}		
	}	
	
});

// -----------------------------------------------------
// ------------------- Change Page ---------------------
// -----------------------------------------------------

// ---------- Click Event for Navigation Menu ----------
$('#TOC li').click(function(){
	"use strict";
	var gotoPage = ($(this).index('#TOC li') + 1) - pageNum;
	pageChange(gotoPage);
});
// ---------- Click Event for Next & Prev button in mobile mode ----------
foot.children().click(function() {
	"use strict";
	var index = $(this).index();
	if(index === 0) {					//if prev button is clicked
		pageChange(-1);		
	}else if(index === 2) {				//if next button is clicked
		pageChange(+1);
	}else{								//if "Back to Top" is clicked
		returnToTop();
	}
});
// ---------- Keyboard Event to change page ----------
document.addEventListener("keydown", function(event) {
	"use strict";
	if(event.keyCode === 37) {
		//alert('prev was pressed');
		pageChange(-1);
	}
	else if(event.keyCode === 39) {
		//alert('next was pressed');
		pageChange(+1);
	}
});
// -------------------------------------------------------------
// -------------------- End of Change Page ---------------------
// -------------------------------------------------------------




// ------------------------------------------------
// ----------- Click Event for Tabs ---------------	
// ------------------------------------------------

$('nav #menu').click(function(){
	"use strict";
	//$('nav #note').removeClass('iconActivate');
	//$('nav #TOC').show();
	//$('nav #notePad').hide();

	$(this).toggleClass('iconActivate');
	$('nav').toggleClass('navSwitch');
	$('#TOC, #notePad').toggleClass('tocSwitch');
	$('#note').fadeToggle();
	foot.removeClass('footFitNav');
	//foot.css('width', '90%');
	//art.toggleClass('artFitNav');
	//foot.toggleClass('footFitNav');
	//foot.width(foot.width()-250);
	if($('nav').hasClass('navSwitch')){
	// 	NoteEnabled = false;
	$('nav #notePad').addClass('tocSwitch');
		//$('#counter').append('clicked');
	 	$('#note').removeClass('iconActivate');
	 	$('#notePad').addClass('hideNav');
	 	foot.addClass('footFitNav');
	 	//foot.css('width', 'calc(100% - 330px)');
	 	//foot.css('max-width',800-adjustBy)
	}
		
		//foot.css('max-width',820)

	//var adjustBy = 1136 - window.innerWidth;
	//$('#counter').text(adjustBy);



	 	//$('#counter').text('Adjust footer width');
	 	//foot.toggleClass('footFitNav');
	// $('#counter').text(window.innerWidth+' - '+$('nav').width()+' = '+ Number(window.innerWidth) - Number($('nav').width())+'   '+$('#contentHolder').width());
	 //$('#counter').text(window.innerWidth+' - '+$('nav').width()+' = '+ Number(window.innerWidth - $('nav').width()) + "  ("+$('#contentHolder').width()+")");
	 //window.innerWidth
});

$('nav #note').click(function(){
	"use strict";
	//NoteEnabled = true;
	$(this).toggleClass('iconActivate');
	//$('nav #notePad').toggle();
	$('nav #notePad').toggleClass('hideNav');
});


// ----------- Javascript to save Notes ---------------
document.getElementById('note_btnSave').onclick = function() {
	"use strict";
  if ('Blob' in window) {
	var fileName = prompt('Please enter file name to save', 'Untitled');
	if (fileName) {
	  var textToWrite = document.getElementById('note_Textarea').value.replace(/\n/g, '\r\n');
	  var textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
	  
	  // Internet Explorer allows file to be saved
	  if ('msSaveOrOpenBlob' in navigator) {
		navigator.msSaveOrOpenBlob(textFileAsBlob, fileName);
	  } else {
		var downloadLink = document.createElement('a');
		downloadLink.download = fileName+'.txt';
		downloadLink.innerHTML = 'Download File';
		if ('webkitURL' in window) {
		  // Chrome allows the link to be clicked without actually adding it to the DOM.
		  downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
		} else {
		  // Firefox requires the link to be added to the DOM before it can be clicked.
		  downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
		  downloadLink.onclick = destroyClickedElement;
		  downloadLink.style.display = 'none';
		  document.body.appendChild(downloadLink);
		}

		downloadLink.click();
	  }
	}
  } else {
	alert('Your browser does not support the HTML5 Blob.');
  }
};		
function destroyClickedElement(event) {
	"use strict";
	document.body.removeChild(event.target);
}
// ----------- End of Javascript to save Notes ---------------

// -------------------------------------------------------
// ----------- End of Click Event for Tabs ---------------	
// -------------------------------------------------------



// -----------------------------------------------------------------------
// ------------------------------ FUNCTIONS ------------------------------
// -----------------------------------------------------------------------

function initialise(){
	$('nav #TOC ul').prev('li').append(' ￬');
	$('nav #TOC li span').addClass('incompleteMark');
	//alert("pagescompletion.length:" + pagescompletion.length)
	for(var i=0; i<courseLength; i++){
		$('nav #TOC li:eq('+i+') span').text(pagescompletion[i]+"%");
		if(pagescompletion[i] == 100){
			$('nav #TOC li:eq('+i+') span').text('✔').addClass('completeMark');
		}
	}

	//$('nav #Icons ul, nav #TOC, nav #notePad').addClass('absoluteNavElements');
}

function detectComplete(){
	var pageHT 					= $(document).height();
	var viewportHT 				= $(window).height();
	var scrolledHT 				= $(document).scrollTop();
	var lastpageCompletePercent = 0;
	var pageCompletePercent;

	if(!swipping) {
		
		//-------------------- Checks progress base on scrolling if its not QUIZ -------

		if(Qcompletion == null){
			pageCompletePercent = Math.round((scrolledHT/(pageHT - viewportHT))*100);
		}else{
			pageCompletePercent = Math.round((scrolledHT/(pageHT - viewportHT))*((100-QpercentSize) + Qcompletion));
		}

		//document.getElementById('counter').innerHTML = Qcompletion;
		//pageCompletePercent = Math.round((scrolledHT/(pageHT - viewportHT))*((100-QpercentSize) + Qcompletion));

		if(pageCompletePercent > 100){
			pageCompletePercent = 100;
		}
		
		if(navNum === prenavNum  /*&& swipping == false*/){
			lastpageCompletePercent = $('nav #TOC li span:eq('+navNum+')').text().replace('%','');
	
			if(pageCompletePercent > lastpageCompletePercent){
				$('nav #TOC li span:eq('+navNum+')').text(pageCompletePercent +"%");
				pagescompletion[navNum] = pageCompletePercent;
	
				if(window.opener){
					window.opener.SUSPENDpagecompletion = pagescompletion;
				}
	
			}else{
				pageCompletePercent = lastpageCompletePercent;
			}
	
		}else{
			lastpageCompletePercent = 0;
		}
	
		if(pageCompletePercent === 100 /*&& swipping == false*/){
			$('nav #TOC li span:eq('+navNum+')').text('✔').addClass('completeMark');
		}
	
	
		//$('#counter').text(window.opener.getAvgCompletion());
		//--------------------update progress bar-------------------------
			$("#progress #bar").css('width', window.opener.getAvgCompletion()+'%');
		//----------------------------------------------------------------
	}
	
}

function detectSize(){
	"use strict";
	mobileVersion = $('#menuBar').css('display')
	if(prevVersion !== mobileVersion){
		//$('#counter').append('change')
		if(mobileVersion === 'none'){
			//$('#counter').text('desktop');
			fontSize(18);

			$('#progress').addClass('relativeDesktopProgress');

			$('nav, #TOC, #Icons').removeClass('hideNav');
			//$('#TOC').removeClass('hideNav');
			$('#notePad').addClass('hideNav');
			$('#note').hide();

			//if(!$('#Icons #note').hasClass('iconActivate')){
				//$('#Icons #note').removeClass('iconActivate');
				
			//}

			/*if(!NoteEnabled){
				//$('nav').show();									//shows navigation bar when in desktop version
				$('#TOC ul').hide();								//hides the sub-topics when in desktop version
				$('#TOC li:eq('+navNum+')').next('ul').show();		//shows the sub-topics of selected topics
				$('#TOC li:eq('+navNum+')').parents('ul').show();	//shows the parent-topic of selected sub-topics
			}	*/		
		}else{
			//$('#counter').text('mobile');
			
			//NoteEnabled = false;
			//$('nav, #TOC, #notePad, #Icons').addClass('hideNav');
			$('nav, #notePad, #Icons').addClass('hideNav');

			/*$('#TOC, #TOC ul').show();
			$('nav, nav #note, #notePad').hide();*/
			$('nav #menu, nav #note').removeClass('iconActivate');
			$('nav').removeClass('navSwitch');
			//art.removeClass('artFitNav');
			//foot.removeClass('footFitNav');
			$('#TOC, #notePad').removeClass('tocSwitch');
			foot.removeClass('footFitNav');
			/*$('nav').toggleClass('navSwitch');
			$('#TOC, #notePad').toggleClass('tocSwitch');
			$('#note').fadeToggle();
			foot.removeClass('footFitNav');*/
		}
	}
	prevVersion = mobileVersion;
}


// ---------- Function for page change ----------
function pageChange(x) {
	"use strict";
	pageNum = Number(pageNum + x);
	if(pageNum >= 1 && pageNum <= courseLength){
		//$('#TOC li:eq('+navNum+')').removeClass('selectedPage selectedPageBG');
		$('#TOC li:eq('+navNum+')').removeClass('selectedPage');
		navNum = pageNum-1;
		//detectSize()
		
		loadPage();	
	}
	if(pageNum < 1){
		//alert('page change back to 1')
		pageNum = 1;
	}else if(pageNum > courseLength){
		//alert('page change back to 5')
		pageNum = courseLength;
	}
	
	if(mobileVersion === 'none') {		// Desktop Version
		$('#TOC ul').hide();			//hides the sub-topics when in desktop version
		$('#TOC li:eq('+navNum+')').next('ul').show();
		$('#TOC li:eq('+navNum+')').parents('ul').show();
	}else{
		//$('nav').slideUp('fast');
		$('nav').addClass('hideNav');
	}
}
// ---------- End of Function for page change ----------
//var userAnsArray; 

function loadPage() {
	"use strict";
	//$('#TOC li:eq('+navNum+')').addClass('selectedPage selectedPageBG');

	Qcompletion = null;

	$('#TOC li:eq('+navNum+')').addClass('selectedPage');
	art.load(courseCode + '_' + pageNum +'.html', function(data){
		
		//var newPage = $(this).text();
		//document.title = $(this).text();
		////alert(document.title);
		//alert($("title").text());

		$(document).scrollTop(0);
	//--------------SCORM--------------------------
		if(window.opener){
			window.opener.SUSPENDbookmark = pageNum;
		}
	//---------------------------------------------

	//--------------------update progress bar-------------------------
		$("#progress #bar").css('width',window.opener.getAvgCompletion()+'%');
	//----------------------------------------------------------------

	//--------------------update footer------------------------------
		$('footer p').css('visibility','visible');
		if(pageNum === courseLength) {
			$('footer p:last').css('visibility','hidden');
		}else if(pageNum === 1) {
			$('footer p:first').css('visibility','hidden');
		}
		showreturnTop();
	//---------------------------------------------------------------

		
	});
	//e.stopPropagation();
	prenavNum = navNum;
}	


/*------------- function for the mobile version floating menu ------------*/
//function fixedMenu() {	
	//"use strict";

	//if(mobileVersion === 'none') {		//Desktop version
		//alert(NavIconPaddingTop)
		/*$('main').removeClass('fixedMain');
		$('#progress').removeClass('fixedProgress');*/
		//$('nav, nav #Icons').addClass('padTop');
		//if($(window).scrollTop() < $('header').outerHeight()) {
			//alert(NavIconPaddingTop-$(window).scrollTop())
			//$('nav, nav #Icons').css('padding-Top',110-$(window).scrollTop());
			//$('nav #Icons').css('padding-Top',110-$(window).scrollTop());
			/*$('#progress').removeClass('fixedDesktopProgress').addClass('relativeDesktopProgress');
			$('article').css('margin-Top','0px');
			$('nav #Icons ul, nav #TOC, nav #notePad').removeClass('fixedNavElements');*/
				//.css('position','absolute')
				//.css('margin-Top',25);
			//$('#progress').css('top',$('header').outerHeight()-$(window).scrollTop())
		//}else{
			//alert('NavIconPaddingTop')
			//$('nav, nav #Icons').css('padding-Top',110-$('header').outerHeight());
			/*$('#progress').removeClass('relativeDesktopProgress').addClass('fixedDesktopProgress');
			$('article').css('margin-Top','8px');
			$('nav #Icons ul, nav #TOC, nav #notePad').addClass('fixedNavElements')*/
			//$('nav #Icons ul').addClass('fixedNavElements')
				//.css('position','fixed')
				//.css('margin-Top',33-$('header').outerHeight());
			//$('#progress').addClass('fixedDesktopProgress');
			//$('#progress').css('top','0')
		//}
	//}else{
		/*$('#progress').removeClass('fixedDesktopProgress');*/
		//$('nav, nav #Icons').css('padding-Top',20);
		//if($(window).scrollTop() > $('header').outerHeight()) {
			
			/*$('#menuBar').addClass('fixedMenuBar');
			$('#progress').addClass('fixedProgress');
			$('main').addClass('fixedMain');*/
			
			//$('article').css('margin-Top','8px');
			//$('#counter').text($(window).scrollTop() - $('header').height());
			//$('#menuBar, #progress').css('top',$(window).scrollTop() - $('header').height());
		//}else{
			
			/*$('#menuBar').removeClass('fixedMenuBar');
			$('#progress').removeClass('fixedProgress');
			$('main').removeClass('fixedMain');*/

			//$('article').css('margin-Top','0px');

			//$('#menuBar, #progress').css('top','0');
		//}
	//}
	//showreturnTop();
//}	
/*------------- end ------------*/	

function showreturnTop() {
	"use strict";
	if($(document).scrollTop() > 0) {
		$('footer p:eq(1)').show();
	}else{
		$('footer p:eq(1)').hide();
	}	
}
function returnToTop() {
	"use strict";
	//$('#menuBar, #progress').hide();
	$('body,html').animate({
		scrollTop: 0
	}, 800/*, function(){
		$('#menuBar, #progress').slideDown('fast');
	}*/);
}


function fontSize(e) {
	"use strict";
	if(e<=22 && e>=14){
		$('header, article, nav ul').css('fontSize', e+'px');
		$('#menuBar p').removeClass('txtSize_disabled');
	}
	
	if(e === 22){
		$('#menuBar #Mzoomin').addClass('txtSize_disabled');
	}else if(e === 14){
		$('#menuBar #Mzoomout').addClass('txtSize_disabled');
	}
}


//------------- Touch Function -----------------

function is_touch_device() {
	return 'ontouchstart' in window			// works on most browsers 
	|| navigator.maxTouchPoints;			// works on IE10/11 and Surface
};

function handleTouchStart(evt) {
	xDown = evt.touches[0].clientX;
	yDown = evt.touches[0].clientY;
	sTime = new Date().getTime();

  	//evt.preventDefault();
};


function handleTouchEnd(evt) {
	//xUp = evt.touches[0].clientX;
    //yUp = evt.touches[0].clientY;
	eTime = new Date().getTime();

	var timeLapse = eTime - sTime;
	var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;
    xUp = undefined;
	yUp = undefined;

	if(timeLapse < swipeTiming) {
		//within a quarter of a second
		if(Math.abs(xDiff) > swipeDistance || Math.abs(yDiff) > swipeDistance) {
			//travelled more than 150px
			if(Math.abs(xDiff) > Math.abs(yDiff)){
				//swipe left/right
				swipping = true;
				if (xDiff > 0) {
					//document.getElementById('counter').innerHTML = "Swipe left/next";
					pageChange(+1);
				}else{
					//document.getElementById('counter').innerHTML = "Swipe right/previous";
					pageChange(-1);
				}						
			}else{
				//swipe top/down
				swipping = false;
				if (yDiff > 0) {
					//document.getElementById('counter').innerHTML = "Swipe up";
				}else{
					//document.getElementById('counter').innerHTML = "Swipe down";
				}
			}
		}else{
			swipping = false;
			//document.getElementById('counter').innerHTML = "Not a Swipe";
		}
	}else{
		swipping = false;
		//document.getElementById('counter').innerHTML = "Not a Swipe";
	}
	//document.getElementById('counter').innerHTML = swipping;

	//evt.preventDefault();

};

function handleTouchMove(evt) {
    xUp = evt.touches[0].clientX;                                    
    yUp = evt.touches[0].clientY;                                            
};


