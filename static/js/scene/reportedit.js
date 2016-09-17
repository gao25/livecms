var newTplform = new cake["tplform-1.0.1"]('j-editform'),
formConfig = {
  "type": "ajax",
  "method": "post",
  "action": "xxx",
  "fields": [{
    "class": "readonly",
    "title": "所属现场",
    "name": "username",
    "type": "text",
    "readonly": true
  }, {
    "class": "readonly",
    "title": "报道人",
    "name": "username",
    "type": "text",
    "readonly": true
  }, {
    "class": "readonly",
    "title": "发布时间",
    "name": "username",
    "type": "text",
    "readonly": true
  }, {
    "title": "稿件类型",
    "name": "type",
    "type": "select",
    "option": [
      {"text": "t1", "value": "v1"},
      {"text": "t2", "value": "v2"}
    ]
  }, {
    "class": "j-state",
    "title": "报道状态",
    "name": "state",
    "type": "radio",
    "option": [
      {"text": "待审核", "value": "v1"},
      {"text": "审核通过", "value": "v2"},
      {"text": "审核失败", "value": "v2"},
      {"text": "已关闭", "value": "v2"}
    ]
  }, {
    "class": "editbar",
    "title": "报道内容(限制300个汉字)",
    "name": "content",
    "type": "textarea"
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
newTplform.render(formConfig, null, function(){
  alert('ajax');
});
newTplform.setval({
  "state": "v1"
});

// 设置、绑定报道状态
$('#j-editform .j-state input').each(function(){
  if ($(this)[0].checked) {
    $(this).parent().addClass('current');
  }
});
$('#j-editform .j-state label').click(function(){
  $(this).addClass('current')
    .siblings().removeClass('current');
});

// 取消
$('.j-cancel').click(function(){
  history.back();
});



