var newTplform = new cake["tplform-1.0.1"]('j-loginform'),
formConfig = {
  "id": "j-loginform",
  "type": "ajax",
  "method": "post",
  "action": "/",
  "fields": [{
    "class": "username",
    "title": "用户名",
    "name": "username",
    "type": "text",
    "required": true,
    "maxlength": 100,
    "placeholder": "输入ID或用户名登录"
  }, {
    "class": "userpwd",
    "title": "密码",
    "name": "userpwd",
    "type": "password",
    "required": true,
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
  if ($('#j-executeframe').length == 0) {
    $('body').append('<div class="fn-hide"><iframe id="j-executeframe" src="about:blank"></iframe></div>');
  }
  lvsCmd['cookie'].del('token');
  loginFn();
});
function loginRandomCallback (state, res) {
  if (state) {
    if (res['status'] == 0) {
      var randomStr = res['data']['randomArray'].join(',');
      lvsCmd['cookie'].set('random', randomStr, '18m'); // 实际过期时间是20分钟
      loginFn();
    } else {
      alert(res['errMsg']);
    }
  } else {
    alert('接口请求失败，请检查网络连接！');
  }
}
function loginTokenCallback (state, res) {
  if (state) {
    if (res['status'] == 0) {
      var token = res['data']['token'];
      lvsCmd['cookie'].set('token', token, (7*24-1) + 'h'); // 实际过期时间是7天
      loginFn();
    } else {
      alert(res['errMsg']);
    }
  } else {
    alert('接口请求失败，请检查网络连接！');
  }
}
function loginCallback (state, res) {
  if (state) {
    if (res['status'] == 0) {
      $.each(res['data'], function(key, val){
        lvsCmd['cookie'].set(key, val, (7*24-1) + 'h'); // 实际过期时间是7天
      });
      var goUrl = document.URL;
      goUrl = goUrl.substr(0, goUrl.lastIndexOf('/'));
      location.href = goUrl;
    } else {
      // alert(res['errMsg']);
      alert('用户名或密码错误！');
    }
  } else {
    alert('接口请求失败，请检查网络连接！');
  }
}
function loginFn(){
  if (lvsCmd['cookie'].get('random')) {
    var token = lvsCmd['cookie'].get('token');
    if (token) {
      // 请求登录
      var random = lvsCmd['random'].get(),
        actionHead = escape('{"random":"'+random+'","token":"'+token+'"}'),
        actionBody = escape('{"loginType":"normal","openid":"","countryMobileCode":"86","mobile":"'+$('#j-loginform input[name=username]').val()+'","password":"'+$('#j-loginform input[name=userpwd]').val()+'","userType":4}');
      $('#j-executeframe').attr('src', executeServer + '/execute/?action=/cms/login/execute.json&actionHead='+actionHead+'&actionBody='+actionBody+'&callback=loginCallback');
    } else {
      // 获取 token
      var random = lvsCmd['random'].get(),
        actionHead = escape('{"random":"'+random+'"}'),
        actionBody = escape('{"appid":"010002","projectid":"01"}');
      $('#j-executeframe').attr('src', executeServer + '/execute/?action=/cms/start/execute.json&actionHead='+actionHead+'&actionBody='+actionBody+'&callback=loginTokenCallback');
    }
  } else {
    // 获取 random
    $('#j-executeframe').attr('src', executeServer + '/execute/?action=/random/execute.json&callback=loginRandomCallback');
  }
}

