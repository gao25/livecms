$(function(){
  $('.datetime').datetimepicker({
    timepicker:false,
    format:'Y.m.d'
  });
  $('.more').hover(function(){
    $('.more img').attr('src','/static/img/green_menu.png');
    $('.more ul').show();
  },function(){
    $('.more img').attr('src','/static/img/menu.png');
    $('.more ul').hide();
  })
  $('.more ul li a').hover(function(){
    $(this).css('color','#12bb9a');
  },function(){
    $(this).css('color','#808080');
  })
})
