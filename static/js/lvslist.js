$(function(){
  $('.datetime').datetimepicker({
    timepicker:false,
    format:'Y.m.d'
  });
  $('.more').mouseenter(function(){
    $('.more-menu').show();
    $('.more img').attr('src','/static/img/green_menu.png');
  });
  $('.more-menu').mouseenter(function(){
    return;  
  });
  $('.more-menu').mouseleave(function(){
    $('.more-menu').hide();
    $('.more img').attr('src','/static/img/menu.png');
  });
})
