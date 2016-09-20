// 参数
var id = + lvsCmd['urlParams']['id'];
if (isNaN(id) || id < 1) {
  parent.location.href = '/';
}

// 生成表单
var newTplform = new cake["tplform-1.0.1"]('j-editform'),
formConfig = {
  "type": "ajax",
  "method": "post",
  "action": "/live-web-cms/report/update.json",
  "fields": [{
    "class": "readonly",
    "title": "所属现场",
    "name": "topic",
    "type": "text",
    "readonly": true
  }, {
    "title": "报道人",
    "name": "userid",
    "type": "select",
    "option": [
      {"text": "图文", "value": "1"},
      {"text": "音频", "value": "2"},
      {"text": "视频", "value": "4"}
    ]
  }, {
    "title": "发布时间",
    "name": "createtime",
    "type": "datetime"
  }, {
    "title": "稿件类型",
    "name": "type",
    "type": "select",
    "option": [
      {"text": "图文", "value": "1"},
      {"text": "音频", "value": "2"},
      {"text": "视频", "value": "4"}
    ]
  }, {
    "title": "自定义",
    "name": 'filename',
    "type": 'html',
    "html": '<div id="ossfile">你的浏览器不支持flash,Silverlight或者HTML5！</div><div id="j-filecontainer"><div id="j-selectfiles">选择</div>｜<div id="j-postfiles">上传</div></div>'
  }, {
    "class": "j-state",
    "title": "报道状态",
    "name": "state",
    "type": "radio",
    "option": [
      {"text": "待审核", "value": "1"},
      {"text": "审核通过", "value": "2"},
      {"text": "审核失败", "value": "8"},
      {"text": "已关闭", "value": "0"}
    ]
  }, {
    "class": "editbar",
    "title": "报道内容(限制300个汉字)",
    "name": "content",
    "type": "textarea",
    "maxlength": 1
  }],
  "button": [
    {
      "value": "保存并签发",
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
  // 上传
  loadUploaderSign(function(uploaderSign){
    loadUploaderMod(uploaderSign);
    uploader.init();
  });
  // 状态
  $('#j-editform .j-state label').click(function(){
    $(this).addClass('current')
      .siblings().removeClass('current');
  });
  // 取消
  $('.j-cancel').click(function(){
    history.back();
  });
}, function(){
  // alert('ajax');

  // /live-web-cms/report/update.json


});

// 获取数据
lvsCmd.ajax('/live-web-cms/report/get.json', {reportId: id}, function (state, res) {
  if (state) {
    if (res['status'] == '0') {
      newTplform.setval(res['data']);
      $('#j-editform .j-state input').each(function(){
        if ($(this)[0].checked) {
          $(this).parent().addClass('current');
        }
      });
    } else {
      alert(res['errMsg']);
    }
  } else {
    alert("接口请求失败，请检查网络连接！");
  }
});









