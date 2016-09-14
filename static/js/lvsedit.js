$(function(){
	$('.datetime').datetimepicker();
	//兼容IE8
	$('.lstate').on('click',function(){
    $('.lstate span').removeClass('checked');
    $(this).find('span').addClass('checked');
  })
})