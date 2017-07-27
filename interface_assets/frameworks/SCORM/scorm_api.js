var findAPITries=1;
var API = null;
var	timerID = null;
//var	timerRunning = false;
//var	startDate;
//var	startSecs;
var timeValue;
var timecnt=0;
//var lessonStatus=false;
var Bookmark_location="";
//var SetMasteryScore=100;
//var prevLesson_Status = "";
//var gpercentage =""; 
//var ok1 =0;
var scorm_version;
var user_name = "";
/*-------------------------------------------------###############################-------------------------------------------------------------
--------------------------------------------------Function for find the scorm Version--------------------------------------------------------*/
/*function fnScormVersion(win){

 while ((win.API_1484_11 == null||(win.API == null)) && (win.parent != null) && (win.parent != win))
   {
      findAPITries++;

      if (findAPITries > 500) 
      {
	  
         return null;
      }
       win = win.parent;
   }
   if(win.API_1484_11) {									
		scorm_version = "2004";								
	} else if(win.API) {
		scorm_version = "1.2";
	}

	initSco();
}*/
/*-------------------------------------------------###############################-------------------------------------------------------------
--------------------------------------------------Function for find the API------------------------------------------------------------------*/
function FindAPI(win)
{	
   while ((win.API == null) && (win.parent != null) && (win.parent != win))
   {
      findAPITries++;
      // Note: 7 is an arbitrary number, but should be more than sufficient
      if (findAPITries > 7) 
      {
         // alert("Error finding API -- too deeply nested.");
         return null;
      }
      
      win = win.parent;
		
   }
   scorm_version = "1.2";
   return win.API;
}
/*-------------------------------------------------###############################-------------------------------------------------------------
--------------------------------------------------Function for get the API-------------------------------------------------------------------*/
function GetAPI()
{
    API = FindAPI(window);
	
   if ((API == null) && (window.opener != null) && (typeof(window.opener) != "undefined"))
   {
      API = FindAPI(window.opener);
   }
   if (API == null)
   {
     parent.status = "Unable to find an API adapter";
   }
   return API;
}
/*-------------------------------------------------###############################-------------------------------------------------------------
--------------------------------------------------Function for Initializing the scorm--------------------------------------------------------*/
function initSco() {
 		API = GetAPI();
	alert(scorm_version)
		if( API != null )
		{
			var ret;
			var code;
			var diag;
			if(scorm_version=="2004"){
				API.Initialize("");
				set_val("cmi.score.max","100");
				set_val("cmi.score.min","0");
				var status = get_val("cmi.completion_status");
			}else{
				API.LMSInitialize("");
				set_val("cmi.core.score.max","100");
				set_val("cmi.core.score.min","0");
				var status = get_val("cmi.core.lesson_status")
			}
			startclock();
			if (status == "not attempted")
			{
			  	if(scorm_version=="2004"){
					set_val("cmi.completion_status","incomplete");
				}else{
					set_val("cmi.core.lesson_status","incomplete");
				}
			  Bookmark_location="";
			}
			else
			{	
				if(scorm_version=="2004"){
					Bookmark_location=get_val("cmi.location");
				}else{
					Bookmark_location=get_val("cmi.core.lesson_location");
				}

			}
			if(scorm_version=="2004"){
				user_name = get_val("cmi.learner_name");
				var s_data  = String(get_val("cmi.suspend_data"));			
			}else{
				user_name = get_val("cmi.core.student_name");
				var s_data  = String(get_val("cmi.suspend_data"));
			}

			if(scorm_version=="2004")
				{
				code = API.GetLastError();
				ret = API.GetErrorString( code );
				diag = API.GetDiagnostic( "" );		
				}
			else 
				{
				code = API.LMSGetLastError();
				ret = API.LMSGetErrorString( code );
				
				diag = API.LMSGetDiagnostic( "" );	
				}

		}
		
}
/*-------------------------------------------------###############################-------------------------------------------------------------
--------------------------------------------------Function for set the LMS data--------------------------------------------------------------*/
function set_val( gname,gvalue )
{
	//API = GetAPI();
	if( API != null )
	{
		var ret;
		var code;
		var diag;
		
		if(scorm_version=="2004")
		{
			API.SetValue( gname, gvalue );		
			code = API.GetLastError();
			ret = API.GetErrorString( code );
			diag = API.GetDiagnostic( "" );		
		}
		else 
		{
			API.LMSSetValue( gname, gvalue );		
			code = API.LMSGetLastError();
			ret = API.LMSGetErrorString( code );
			diag = API.LMSGetDiagnostic( "" );	
		}	
	}
	commit();
};
/*-------------------------------------------------###############################-------------------------------------------------------------
--------------------------------------------------Function for get the data from LMS---------------------------------------------------------*/
function get_val( gname )
{	
	API = GetAPI();
	if( API != null )
	{
	
	var ret1,ret2;
		var code;
		var diag;
		 if(scorm_version=="2004")
		{		
			ret1 = API.GetValue( gname );		
			code = API.GetLastError();
			ret2 = API.GetErrorString( code );
			diag = API.GetDiagnostic( "" );
        }
        else 
		{
			ret1 = API.LMSGetValue( gname );		
			code = API.LMSGetLastError();
			ret2 = API.LMSGetErrorString( code );
			diag = API.LMSGetDiagnostic( "" );
        }
	return ret1;		
		
	}
	
};
/*-------------------------------------------------###############################-------------------------------------------------------------
--------------------------------------------------Function for Commit each LMS calls---------------------------------------------------------*/
function commit()
{	
	//API = GetAPI();
	if( API != null )
	{
		var ret = "";
		var code;
		var diag;
		
		if(scorm_version=="2004")
		{
			API.Commit("");
			code = API.GetLastError();
			ret = API.GetErrorString( code );
			diag = API.GetDiagnostic( "" );
        }
        else 
		{
			API.LMSCommit("");
			code = API.LMSGetLastError();
			ret = API.LMSGetErrorString( code );
			diag = API.LMSGetDiagnostic( "" );
 		}
	}
};
/*-------------------------------------------------###############################-------------------------------------------------------------
--------------------------------------------------Function for Terminate the LMS Calls-------------------------------------------------------*/
function exit()
{ 
		API = GetAPI();
			
		if( API != null )
		{
			var ret;
			var code;
			var diag;
			sTime=stopclock();
			sTime=String(sTime);
			if(scorm_version=="2004")
			{
				ret = API.Terminate("");
				code = API.GetLastError();
				ret = API.GetErrorString( code );
				diag = API.GetDiagnostic( "" );
			}
			else{
				ret = API.LMSFinish("");
				code = API.LMSGetLastError();
				ret = API.LMSGetErrorString( code );
				diag = API.LMSGetDiagnostic( "" );
			}
		}
};
/*-------------------------------------------------###############################-------------------------------------------------------------
--------------------------------------------------Function for Start the timer---------------------------------------------------------------*/
function startclock()
{
	showtime();
}
/*-------------------------------------------------###############################-------------------------------------------------------------
--------------------------------------------------Function for Stop the timer----------------------------------------------------------------*/
function stopclock()
{

	clearTimeout(timerID);
	return timeValue;

}
/*-------------------------------------------------###############################-------------------------------------------------------------
--------------------------------------------------Function for calculate time----------------------------------------------------------------*/
function showtime()
{
	timecnt++;
	var newElapsedTime;
	var hours = Math.floor( timecnt / 3600 );
	newElapsedTime = timecnt - (hours*3600);

	var minutes = 	Math.floor( newElapsedTime / 60 );
	newElapsedTime = newElapsedTime - (minutes*60);

	var seconds = newElapsedTime;

	timeValue = "" + hours;
	if(hours<10)
	{
		timeValue = "0" + hours;
	}
	timeValue  += ((minutes < 10) ? ":0" : ":") + minutes;
	timeValue  += ((seconds < 10) ? ":0" : ":") + seconds;

	timerID = setTimeout("showtime()",1000);
}
/*-------------------------------------------------###############################-------------------------------------------------------------
--------------------------------------------------Function for Get the student Name----------------------------------------------------------*/
function fnGetStudentName()	
{
		if(scorm_version=="2004"){
			var studentName_lms = get_val("cmi.learner_name");
			return studentName_lms;
		}else{
			var studentName_lms = get_val("cmi.core.student_name");
			return studentName_lms;
		}
}


// Below Three functions are communicating with course. we can customize these function to accommodate with course.

/*-------------------------------------------------###############################-------------------------------------------------------------
--------------------------------------------------Function for update the bookmark status----------------------------------------------------*/
function set_location(setbookmark)
{
	//alert("set_location"+setbookmark)
	Bookmark_location=setbookmark;
		if(scorm_version=="2004"){
			set_val("cmi.location", Bookmark_location);
		}else{
			set_val("cmi.core.lesson_location", Bookmark_location);
		}
}
/*-------------------------------------------------###############################-------------------------------------------------------------
--------------------------------------------------Function for mark the completion status----------------------------------------------------*/

function markStatus(completionStatus,score)
{
	//alert("markStatus"+completionStatus+":::::"+score)
		if(scorm_version=="2004"){
			set_val("cmi.score.raw",score);
			set_val("cmi.completion_status",completionStatus);
		}else{
			set_val("cmi.core.score.raw",score);
			set_val("cmi.core.lesson_status",completionStatus);	
		}
}
/*-------------------------------------------------###############################-------------------------------------------------------------
--------------------------------------------------Function for mark the completion status----------------------------------------------------*/
function getBookMark()
{
	return Bookmark_location;
};
/*-------------------------------------------------##############$End$#################------------------------------------------------------*/
//fnScormVersion(window);