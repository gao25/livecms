var newTplform = new cake["tplform-1.0.1"]('j-loginform'),
formConfig = {
  "type": "ajax",
  "method": "post",
  "action": "xxx",
  "fields": [{
    "class": "username",
    "title": "用户名",
    "name": "username",
    "type": "text",
    "required": true,
    "minlength": 4,
    "maxlength": 100,
    "placeholder": "输入ID或用户名登录"
  }, {
    "class": "userpwd",
    "title": "密码",
    "name": "userpwd",
    "type": "password",
    "required": true,
    "minlength": 4,
    "maxlength": 100,
    "placeholder": "输入密码"
  }],
  "button": [
    {
      "value": "登录",
      "type": "submit"
    }
  ]
};
newTplform.render(formConfig, null, function(){
  alert('ajax');
  


  
});