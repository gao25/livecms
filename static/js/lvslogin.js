$(function(){
  creatCode();
  $('.code').on('click',creatCode);
	
  /*判断输入验证码是否正确*/
  $('.loginbtn').on('click',function(){
    var inputCode=$('.login-checkcode input').val();
    if(inputCode.length<=0){
      errtip($('.login-checkcode input'),"请输入验证码！");
    }else if(inputCode!=code){
      errtip($('.login-checkcode input'),"验证码输入错误");
      creatCode();
    }
  })
 
  /*获取验证码*/
  var code;
  function creatCode(){
    code="";
    var codeLength=4;
    var selectChar=new Array(0,1,2,3,4,5,6,7,8,9);
    for(var i=0;i<codeLength;i++){
      var charIndex=Math.floor(Math.random()*10);
      code+=selectChar[charIndex];
    }
    $('.code').html(code);
  }
  function errtip(fieldObj, msg){
    var errtipObj = fieldObj.parent().find('.j-tplform-errtip'),
        errtipImg = 'http://static.xinhuaapp.com/img/tplform_tip.png';
    if (errtipObj.length == 0) {
      errtipObj = $('<div class="j-tplform-errtip" style="position:absolute;background-color:#fff;border:solid 1px #cfcfcf;border-radius:3px;display:none;box-shadow:0 5px 15px rgba(0,0,0,0.4);z-index:2;">' +
        '<em style="position:absolute;margin:-9px 0 0 16px;width:17px;height:9px;background:url('+errtipImg+') no-repeat left top;"></em>' +
        '<p style="padding:8px 10px 8px 33px;line-height:19px;font-size:12px;">' +
        '<em style="position:absolute;margin-left:-25px;width:19px;height:19px;background:url('+errtipImg+') no-repeat left -9px;"></em>' +
        '<span style="color:#000;"></span></p>' +
        '</div>');
      errtipObj.css('margin-top', fieldObj.outerHeight()+7);
      fieldObj.click(function(){
        errtipObj.hide();
      }).blur(function(){
        errtipObj.hide();
      });
      errtipObj.click(function(){
        $(this).hide();
      });
      fieldObj.before(errtipObj);
    }
    fieldObj.focus();
    errtipObj.find('span').html(msg);
    errtipObj.show();
    var errtipObjLeft = fieldObj.outerWidth() / 2 - 26;
    errtipObj.css('margin-left', errtipObjLeft);
  }
}) 