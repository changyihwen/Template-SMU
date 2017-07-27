// JavaScript Document

var MCQattempts = 2;

var MCQtotal = $('article.content .MCQ').length;
var MCQAttemptsLeft = [];
var MCQgroup;
var MCQuserAns;
var MCQuserAnsText;
var MCQrightAns;

for(var i=0; i<MCQtotal; i++){
	$('.MCQ:eq('+i+') input:radio').attr('name','MCQ'+i);
	MCQAttemptsLeft[i] = MCQattempts;
}

$('input[type=radio]').click(function(){
	$(this).closest('ol').siblings('input[type=button]').fadeIn('fast');
	$(this).closest('ol').siblings('.feedback').text('')
});

$('.MCQ input:button').click(function(){
	$(this).hide();

	MCQgroup = $(this).parent().index('.MCQ');
	MCQuserAns = $('input[name=MCQ'+MCQgroup+']:checked').closest('li').index()+1;		//finds the ancestor until closest 'li' is found and get index of user's selected answer
	MCQuserAnsText = $('input[name=MCQ'+MCQgroup+']:checked').parent('label').text();
	MCQrightAns = $(this).closest('.MCQ').attr('data-ans');								

	MCQAttemptsLeft[MCQgroup] = MCQAttemptsLeft[MCQgroup]-1;

	if(MCQuserAns == MCQrightAns) {
		$(this).siblings('.feedback')
			.text('✔ Correct. Store Operations or the Point-of-Sale (POS) is typically the first area for analytics in retail.')
			.css('color','rgb(30,125,30)');
	}else{
		$(this).siblings('.feedback')
			.css('color','rgb(125,30,30)');
		if(MCQAttemptsLeft[MCQgroup] == 0){
			$(this).siblings('.feedback').text('✘ Incorrect. The correct answer is B. Store Operations or the Point-of-Sale (POS) is typically the first area for analytics in retail.');
		}else{
			$(this).siblings('.feedback').text('✘ I don’t think that’s quite right. Try again?');	
			$('input[name=MCQ'+MCQgroup+']:radio').prop('checked',false);
		}				
	}

	if(MCQuserAns == MCQrightAns || MCQAttemptsLeft[MCQgroup] == 0){
		$(this).hide();
		$(this).parent().siblings('.instructions').hide();
		$('.MCQ input[name=MCQ'+MCQgroup+']').attr('disabled','disabled');
		$('.MCQ input[name=MCQ'+MCQgroup+']').parent('label').css('cursor','default');
		$('.MCQ input[name=MCQ'+MCQgroup+']:eq('+(MCQrightAns-1)+')')
			.prop('checked',true)
			.closest('li').css('background-color','rgb(170,235,170)');
		QUIZupdateProgress();

		if($(this).siblings('.explain').text() !== ""){
			$(this).siblings('.explain').fadeIn('fast');
		}
	}
});
		