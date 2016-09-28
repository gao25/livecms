// 参数
var urlData = lvsCmd['urlParams'];
if (urlData['liveId'] > 0) {
  $('#j-pagetitle').html('发布报道');
} else {
  location.href = 'checkscene.html';
}

// 获取报道人列表 / 生成表单
var newTplform = new cake["tplform-1.0.1"]('j-editform'),
formConfig = {
  "type": "ajax",
  "method": "post",
  "action": "/live-web-cms/report/add.json",
  "fields": [{
    "class": "readonly",
    "title": "所属现场",
    "name": "liveId",
    "type": "text"
  }, {
    "class": "j-type",
    "title": "稿件类型",
    "name": "type",
    "type": "select",
    "option": [
      {"text": "图文", "value": "1"},
      {"text": "音频", "value": "2"},
      {"text": "视频", "value": "4"}
    ]
  }, {
    "class": "uploader j-uploader",
    "title": "上传文件",
    "type": 'html',
    "html": '<div class="filelist" data-filetype="2"></div>'
  }, {
    "class": "editbar",
    "title": "报道内容(限制300个汉字)",
    "name": "content",
    "type": "textarea",
    "maxlength": 300
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
  // 创建上传组件
  var newUpfile = new lvsCmd['upfile']($('.j-uploader .filelist'));
  newTplform.setval({
    "liveId": urlData['liveId']
  });
  // 绑定type变化
  $('.j-type select').change(function(){
    $('.j-uploader .filelist').data('filetype', $(this).val());
  });
  // 取消
  $('.j-cancel').click(function(){
    location.href = document.referrer;
  });
}, function (formInfo) {
  // 获取表单数据
  var formData = formInfo['data'],
    type = formData['type'];
  if (type == 1) {
    formData['pictures'] = '';
    $('.j-uploader .filelist .file').each(function(){
      var fileurl = $(this).data('fileurl');
      if (fileurl) {
        if (formData['pictures'] == '') {
          formData['pictures'] = fileurl;
        } else {
          formData['pictures'] += ',' + fileurl;
        }
      }
    });
  } else {
    var fileurl = $('.j-uploader .filelist .file').eq(0).data('fileurl');
    if (fileurl) {
      if (type == 2) {
        formData['audio'] = fileurl;
      } else if (type == 4) {
        formData['video'] = fileurl;
      }
    }
  }
  formData['source'] = 'PC';
  // 提交表单
  lvsCmd.ajax(formInfo['url'], formData, function (state, res) {
    if (state) {
      if (res['status'] == '0') {
        alert("数据保存成功！");
        // location.reload();
        location.href = document.referrer;
      } else {
        alert(res['errMsg']);
      }
    } else {
      alert("接口请求失败，请检查网络连接！");
    }
  });
});
