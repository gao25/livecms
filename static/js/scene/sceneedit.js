var newTplform = new cake["tplform-1.0.1"]('j-editform'),
formConfig = {
  "type": "ajax",
  "method": "post",
  "action": "xxx",
  "fields": [{
    "class": "readonly",
    "title": "现场标题",
    "name": "username",
    "type": "text",
    "readonly": true
  }, {
    "class": "readonly",
    "title": "创建人",
    "name": "creatername",
    "type": "text",
    "readonly": true
  }, {
    "class": "readonly",
    "title": "发布时间",
    "name": "username",
    "type": "text",
    "readonly": true
  }, {
    "title": "现场类型",
    "name": "type",
    "type": "select",
    "option": [
      {"text": "图文直播", "value": "v1"},
      {"text": "音频直播", "value": "v2"},
      {"text": "视频直播", "value": "v3"}
    ]
  }, {
    "class": "readonly",
    "title": "直播流地址",
    "name": "livelink",
    "type": "text",
    "readonly": true
  }, {
    "class": "check-style",
    "title": "报道审核",
    "name": "reportcheck",
    "type": "radio",
    "value": "先审后发",
    "option": [
      {"text": "先审后发", "value": "先审后发"},
      {"text": "先发后审", "value": "v2"}
    ]
  }, {
    "class": "check-style",
    "title": "评论审核",
    "name": "commentcheck",
    "type": "radio",
    "value": "先审后发",
    "option": [
      {"text": "先审后发", "value": "先审后发"},
      {"text": "先发后审", "value": "v2"}
    ]
  }, {
    "class": "live-state",
    "title": "直播状态",
    "name": "livestate",
    "type": "radio",
    "value": "关闭",
    "option": [
      {"text": "开启", "value": "v1"},
      {"text": "关闭", "value": "关闭"}
    ]
  }, {
    "class": "j-state",
    "title": "现场状态",
    "name": "state",
    "type": "radio",
    "option": [
      {"text": "待审核", "value": "v1"},
      {"text": "审核通过", "value": "v2"},
      {"text": "审核失败", "value": "v2"},
      {"text": "已关闭", "value": "v2"}
    ]
  }],
  "button": [
    {
      "value": "保存",
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
