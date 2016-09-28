var newTplform = new cake["tplform-1.0.1"]('j-editform'),
formConfig = {
  "type": "ajax",
  "method": "post",
  "action": "/live-web-cms/live/add.json",
  "fields": [{
    "title": "现场标题",
    "name": "username",
    "type": "text",
    "maxlength": 12,
    "required": true
  }, {
    "class": "readonly",
    "title": "创建人",
    "name": "creatername",
    "type": "text",
    "readonly": true
  }, {
    "class": "j-type",
    "title": "现场类型",
    "name": "type",
    "type": "select",
    "required": true,
    "option": [
      {"text": "图文直播", "value": "v1"},
      {"text": "音频直播", "value": "v2"},
      {"text": "视频直播", "value": "v3"}
    ]
  }, {
    "title": "直播流地址",
    "name": "livelink",
    "type": "text",
    "required": true
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
  // 取消
  $('.j-cancel').click(function(){
    history.back();
  });
}, function(formInfo){
  //获取表单数据
  var formData = formInfo['data'],
    selectedIndex = $('.j-type select[name=type]')[0].selectedIndex,
    type = $('.j-type select[name=type] option').eq(selectedIndex).val();
    reportApproveType = $('.check-style input[name=reportApproveType]:checked').val(),
    commentApproveType = $('.check-style input[name=commentApproveType]:checked').val();
  formData['liveStreamUrl'] = $('.j-livelink input[name=livelink]').val();
  formData['topic'] = $('#j-editform input[name=username').val();
  formData['remark'] = $('.j-remark textarea[name=remark]').val();
  if(type == '图文直播'){
    formData['type'] = 1;
  }else if(type == '音频直播'){
    formData['type'] = 2;
  }else if(type == '视频直播'){
    formData['type'] =3;
  }
  if(reportApproveType == '先审后发'){
    formData['reportApproveType'] = 1;
  }else if (reportApproveType == '先发后审') {
    formData['reportApproveType'] =2;
  }
  if(commentApproveType == '先审后发'){
    formData['commentApproveType'] = 1;
  }else if (commentApproveType == '先发后审') {
    formData['commentApproveType'] =2;
  }
  $('.j-uploader .filelist .file').each(function(){
    var fileurl1 = $(this).eq(0).data('fileurl');
    var fileurl2 = $(this).eq(1).data('fileurl');
    if (fileurl1) {
      if (formData['cover'] == '') {
        formData['cover'] = fileurl1;
      } else {
        formData['cover'] += ',' + fileurl1;
      }
    }
    if(fileurl2){
      if (formData['reviewVideoUrl']) {
        formData['reviewVideoUrl'] = fileurl2;
      }else{
        formData['reviewVideoUrl'] += ',' + fileurl2;
      }
    }
  });
  // 提交表单
  lvsCmd.ajax(formInfo['url'], formData, function (state, res) {
    if (state) {
      if (res['status'] == '0') {
        alert("数据保存成功！");
        // location.reload();
        history.back();
      } else {
        alert(res['errMsg']);
      }
    } else {
      alert("接口请求失败，请检查网络连接！");
    }
  });
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