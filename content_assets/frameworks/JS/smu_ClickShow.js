// JavaScript Document

function appear(event){
	//event.target.style.display = 'none';
	event.target.classList.add('hide');
	//alert(event.target.value);
	
	
	//var next = document.querySelector('.resultPanel');
	var next = event.target.nextElementSibling;
	/*while(next.className == undefined || next.className == ""){
		//alert(next.className);
		next = next.nextSibling;
	}*/
	if (next.classList.contains('is-paused')){
		next.classList.remove('is-paused');
	}
}