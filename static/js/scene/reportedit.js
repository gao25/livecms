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
    "option": []
  }, {
    "title": "发布时间",
    "name": "createtime",
    "type": "datetime"
  }, {
    "title": "稿件类型",
    "name": "type",
    "type": "select",
    "disabled": true,
    "option": [
      {"text": "图文", "value": "1"},
      {"text": "音频", "value": "2"},
      {"text": "视频", "value": "4"}
    ]
  }, {
    "class": "uploader j-uploader",
    "title": "上传文件",
    "type": 'html',
    "html": '<div class="filelist"></div>'
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
  // 创建上传组件
  var newUpfile = new lvsCmd['upfile']($('.j-uploader .filelist'));
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
  // 获取表单数据
  var formData = {
    "id": id,
    "createTime": new Date($('#j-editform select[name=userid]').val()).getTime(),
    "content": $('#j-editform textarea[name=content]').val(),
    "state": $('#j-editform input[name=state]').val()
  };
  var selectedIndex = $('#j-editform select[name=userid]')[0].selectedIndex,
    reporterId = $('#j-editform select[name=userid] option').eq(selectedIndex).val(),
    reporter = $('#j-editform select[name=userid] option').eq(selectedIndex).text();
  formData['reporterId'] = reporterId;
  formData['reporter'] = reporter;
  var type = $('#j-editform select[name=type]').val();
  if (type == 1) {
    formData['pictures'] = '';
  } else if (type == 2) {
    formData['audio'] = '';
  } else if (type == 3) {
    formData['video'] = '';
  }
  // 提交表单
  lvsCmd.ajax('/live-web-cms/report/update.json', formData, function (state, res) {
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
  });
});

// 获取数据
lvsCmd.ajax('/live-web-cms/report/get.json', {reportId: id}, function (state, res) {
  if (state) {
    if (res['status'] == '0') {
      var formVal = res['data'];
      // 格式化日期
      formVal['createtime'] = lvsCmd['formatDate'](formVal['createtime'], 'YY-MM-DD hh:mm');
      // 插入报道人
      $('#j-editform select[name=userid]').append('<option value="'+formVal['userid']+'">'+formVal['reporter']+'</option>');
      // 设置表单值
      newTplform.setval(formVal);
      // 绑定状态
      $('#j-editform .j-state input').each(function(){
        if ($(this)[0].checked) {
          $(this).parent().addClass('current');
        }
      });
      // 获取报道人列表
      lvsCmd.ajax('/live-web-cms/report/getReporters.json', {}, function (state, res) {
        if (state) {
          if (res['status'] == '0') {
            var userid = $('#j-editform select[name=userid]').val();
            $('#j-editform select[name=userid]').html('');
            $.each(res['data'], function(){
              $('#j-editform select[name=userid]').append('<option value="'+this['userId']+'">'+this['reporter']+'</option>');
            });
            newTplform.setval({userid:userid});
          }
        }
      });
    } else {
      alert(res['errMsg']);
    }
  } else {
    alert("接口请求失败，请检查网络连接！");
  }
});

