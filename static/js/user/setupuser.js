// 生成表单
var newTplform = new cake["tplform-1.0.1"]('j-editform'),
formConfig = {
  "type": "ajax",
  "method": "post",
  "action": "/userupdate/setupUser.json",
  "fields": [{
    "class": "uploader j-uploader",
    "title": "头像",
    "type": 'html',
    "html": '<div class="filelist" data-filetype="1" data-iframe="setupuserFrame"></div>'
  }, {
    "title": "昵称",
    "name": "nick",
    "type": "text",
    "required": true
  }, {
    "class": "check-style",
    "title": "性别",
    "name": "sex",
    "type": "radio",
    "required": true,
    "option": [
      {"text": "男", "value": "男"},
      {"text": "女", "value": "女"}
    ]
  },{
    "title": "年龄",
    "name": "age",
    "type": "text"
  }, {
    "class": "readonly",
    "title": "所属",
    "name": "orgName",
    "type": "text",
    "readonly": true,
    "value": lvsCmd.cookie.get('orgName')
  }],
  "button": [
    {
      "value": "确定",
      "type": "submit"
    },
    {
      "class": "j-cancel",
      "value": "取消",
      "type": "button"
    }
  ]
};
newTplform.render(formConfig, function(){
  // 创建上传组件
  var newUpfile = new lvsCmd['upfile']($('.j-uploader .filelist'));
  // 取消
  $('.j-cancel').click(function(){
    parent.closeUseroverly();
  });
}, function (formInfo) {
  var formData = {
    nick: formInfo['data']['nick'],
    portrait: 'live-img/201609/20160924_112753_4327.jpg',
    age: formInfo['data']['age'],
    sex: formInfo['data']['sex']
  };
  parent.executeCallback(formInfo['url'], formData, 'setupUser', "setupuserFrame");
});

// 更新用户信息
function setupUser (state, res) {
  if (state) {
    if (res['status'] == '0') {
      alert("数据保存成功！");
      location.reload();
    } else {
      alert(res['errMsg']);
    }
  } else {
    alert("接口请求失败，请检查网络连接！");
  }
}

// 获取用户信息
function getUser (state, res) {
  if (state) {
    if (res['status'] == '0') {
      newTplform.setval(res['data']);
    } else {
      alert(res['errMsg']);
    }
  } else {
    alert("接口请求失败，请检查网络连接！");
  }
}
parent.executeCallback('/userquery/getUser.json', {}, 'getUser', "setupuserFrame");

