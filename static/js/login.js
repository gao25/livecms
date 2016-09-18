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
  }, {
    "class":"checkcode",
    "title":"验证码",
    "type":"text",
    "name":"checkcode",
    "required":true,
    "placeholder":"输入验证码"
  }],
  "button": [
    {
      "value": "登录",
      "type": "submit"
    }, {
      "value": "取 消",
      "type": "button",
      "class": "cancel"
    }
  ]
};
newTplform.render(formConfig, null, function(){
  alert('ajax');
});