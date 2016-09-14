$(function(){

	/*首页 菜单项改变*/
	var srcs=['lvslist.html','checklvs.html','',''];
	$('.lvs-nav a').click(function(){
		$('.lvs-nav a').removeClass('current');
		$(this).addClass('current');
		var i=$(this).parent().index();
		$('.lvs-iframe iframe').attr('src',srcs[i]);
	})
  
	/*个人设置样式*/
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