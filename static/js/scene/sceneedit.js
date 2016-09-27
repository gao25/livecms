// 获取参数
var id = + lvsCmd["urlParams"]["id"];
if (isNaN(id) || id < 1) {
  id = 0;
  $('#j-pagetitle').html('创建现场');
} else {
  $('#j-pagetitle').html('编辑');
}

// 渲染表单
var newTplform = new cake["tplform-1.0.1"]('j-editform'),
formConfig = {
  "type": "ajax",
  "method": "post",
  "action": "/live-web-cms/live/add.json",
  "fields": [{
    "title": "现场标题",
    "name": "topic",
    "type": "text",
    "required": true
  }, {
    "class": "uploader j-uploader",
    "title": "现场封面",
    "type": 'html',
    "html": '<div class="filelist" data-filetype="5"></div>'
  }, {
    "class": "readonly j-createrName",
    "title": "创建人",
    "name": "createrName",
    "type": "text",
    "readonly": true
  }, {
    "title": "现场类型",
    "name": "type",
    "type": "select",
    "option": [
      {"text": "图文直播", "value": "1"},
      {"text": "音频直播", "value": "2"},
      {"text": "视频直播", "value": "4"}
    ]
  }, {
    "class": 'j-remark',
    "title": "描述",
    "name": "remark",
    "type": "textarea"
  }, {
    "class": 'j-liveLink',
    "title": "直播流地址",
    "name": "liveStreamUrl",
    "type": "text"
  }, {
    "class": "uploader j-uploader-review",
    "title": "回顾视频",
    "type": 'html',
    "html": '<div class="filelist" data-filetype="6"></div>'
  }, {
    "class": "check-style",
    "title": "报道审核",
    "name": "reportApproveType",
    "type": "radio",
    "value": "先审后发",
    "option": [
      {"text": "先审后发", "value": "1"},
      {"text": "先发后审", "value": "2"}
    ],
    "value": 1
  }, {
    "class": "check-style",
    "title": "评论审核",
    "name": "commentApproveType",
    "type": "radio",
    "value": "先审后发",
    "option": [
      {"text": "先审后发", "value": "1"},
      {"text": "先发后审", "value": "2"}
    ],
    "value": 1
  }, {
    "class": "j-state",
    "title": "直播状态",
    "name": "state",
    "type": "radio",
    "option": [
      {"text": "待审核", "value": "1"},
      {"text": "审核通过", "value": "2"},
      {"text": "审核失败", "value": "4"},
      {"text": "已关闭", "value": "8"}
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
newTplform.render(formConfig, function(){
  // 创建、编辑 的不同
  if (id > 0) {
    // nothing
  } else {
    $('.j-createrName').remove();
    $('.j-state').remove();
    $('.j-liveLink').hide();
    $('.j-uploader-review').hide();
  }
  // $('#j-editform input[name=startTime]').val(lvsCmd.formatDate(null,'YY-MM-DD hh:mm'));
  // 创建上传组件
  var newUpfile = new lvsCmd['upfile']($('.j-uploader .filelist')),
    newUpfileReview = new lvsCmd['upfile']($('.j-uploader-review .filelist'));
  // 绑定现场类型
  $('#j-editform select[name=type]').change(function(){
    var type = $(this).val();
    if (type == 1) {
      $('.j-remark').show();
      $('.j-liveLink').hide();
      $('.j-uploader-review').hide();
    } else {
      $('.j-remark').hide();
      $('.j-liveLink').show();
      $('.j-uploader-review').show();
    }
  });
  // 取消
  $('.j-cancel').click(function(){
    history.back();
  });
}, function (formInfo) {
  var formData = {};
  var formData = {
    topic: formInfo['data']['topic'],
    type: formInfo['data']['type'],
    commentApproveType: formInfo['data']['commentApproveType'],
    reportApproveType: formInfo['data']['reportApproveType']
  }
  if (formData['type'] == 1) {
    formData['remark'] = formInfo['data']['remark'];
  } else if (formData['type'] == 2) {
    formData['liveStreamUrl'] = '';
  } else if (formData['type'] == 3) {
    formData['liveStreamUrl'] = '';
  }
  if (id > 0) {
    var formData = formInfo['data'];
    var url = "/live-web-cms/live/update.json";
  } else {
    var url = formInfo['url'];
  }  
  // formData['startTime'] = new Date(formData['startTime']).getTime();
  if (id > 0) {
    formData['id'] = id;
  } else {
    formData['state'] = 2;
  }
  var cover = $('.j-uploader .filelist .file').eq(0).data('fileurl');
  if (cover) {
    formData['cover'] = cover;
  }
  var reviewVideoUrl = $('.j-uploader-review .filelist .file').eq(0).data('fileurl');
  if (reviewVideoUrl) {
    formData['reviewVideoUrl'] = reviewVideoUrl;
  }
  console.log(formData);
  // 提交表单
  lvsCmd.ajax(url, formData, function (state, res) {
    if (state) {
      if (res['status'] == '0') {
        alert("数据保存成功！");
        if (id > 0) {
          // location.reload();
          history.back();
        } else {
          location.href = 'checkscene.html';
        }
      } else {
        alert(res['errMsg']);
      }
    } else {
      alert("接口请求失败，请检查网络连接！");
    }
  });
});

// 获取数据
function getData(){
  lvsCmd.ajax('/live-web-cms/live/get.json', {id: id}, function (state, res) {
    if (state) {
      if (res['status'] == 0) {
        var formVal = res['data'];
        // 格式化日期
        formVal['startTime'] = lvsCmd['formatDate'](formVal['startTime'], 'YY-MM-DD hh:mm');
        // 设置表单值
        newTplform.setval(formVal);
        // 判断现场类型
        if (formVal['type'] == 1) {
          $('.j-liveLink').hide();
          $('.j-uploader-review').hide();
        } else {
          $('.j-remark').hide();
        }
        // 绑定状态
        $('#j-editform .j-state input').each(function(){
          if ($(this)[0].checked) {
            $(this).parent().addClass('current');
          }
        });
        $('#j-editform .j-state label').click(function(){
          $(this).addClass('current')
            .siblings().removeClass('current');
        });
      } else {
        alert(res['errMsg']);
      }
    } else {
      alert("接口请求失败，请检查网络连接！");
    }
  });
}
if (id > 0) {
  getData();
}

