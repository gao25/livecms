$(function(){
	$('.datetime').datetimepicker({
		timepicker:false,
		format:'Y.m.d'
	});
	$('.more').mouseover(function(){
		$('.more-menu').show();
		$('.more img').attr('src','/static/img/green_menu.png');
	})
})