$(function(){
	$('.datetime').datetimepicker({
		format:'Y/m/d  H:i'
	});
	$('.lstate').each(function(){
		var _this=this;
		$(this).onclick(function(){
      $(_this).removeClass('checked');
			$(this).addClass('checked');
		})
	})
})