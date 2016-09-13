$(function(){
	$('.lset').hover(function(){
		$('.lset ul').show();
	},function(){
		$('.lset ul').hide();
	})
	$('.lset li a').hover(function(){
		$(this).css('color','#12bb9a');
	},function(){
		$(this).css('color','#f3f3f3');
	})
})