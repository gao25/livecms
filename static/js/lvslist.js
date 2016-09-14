$(function(){
  $('.datetime').datetimepicker({
    timepicker:false,
    format:'Y.m.d'
  });
  $('.more').hover(function(){
    $(this).find('img').attr('src','/static/img/green_menu.png');
    $(this).find('ul').show();
  },function(){
    $(this).find('img').attr('src','/static/img/menu.png');
    $(this).find('ul').hide();
  })
  $('.more ul li a').hover(function(){
    $(this).css('color','#12bb9a');
  },function(){
    $(this).css('color','#808080');
  })
})
