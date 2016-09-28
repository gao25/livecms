// 参数
var urlData = lvsCmd['urlParams'];
if (urlData['reportId'] > 0) {
  $('#j-pagetitle').html('编辑报道');
} else {
  location.href = 'reportlist.html';
}

// 获取报道人列表 / 生成表单
var newTplform = new cake["tplform-1.0.1"]('j-editform');
lvsCmd.ajax('/live-web-cms/report/getReporters.json', {}, function (state, res) {
  var reporterData = [];
  if (res['status'] == '0') {
    $.each(res['data'], function(){
      reporterData.push({
        "text": this['reporter'],
        "value": this['userId']
      });
    });
  }
  var formConfig = {
    "type": "ajax",
    "method": "post",
    "action": "/live-web-cms/report/update.json",
    "fields": [{
      "class": "readonly",
      "title": "所属现场",
      "name": "topic",
      "type": "text",
      "disabled": true
    }, {
      "title": "报道人",
      "name": "reporterId",
      "type": "select",
      "option": reporterData
    }, {
      "title": "发布时间",
      "name": "createTime",
      "type": "datetime"
    }, {
      "class": 'readonly j-type',
      "title": "稿件类型",
      "name": "type",
      "type": "text",
      "disabled": true
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
    // 取消
    $('.j-cancel').click(function(){
      location.href = document.referrer;
    });
    getData();
  }, function (formInfo) {
    // 获取表单数据
    var formData = formInfo['data'],
      type = $('.j-type').data('type');
    formData['id'] = urlData['reportId'];
    formData['createTime'] = new Date(formData['createTime']).getTime();
    var selectedIndex = $('#j-editform select[name=reporterId]')[0].selectedIndex,
      reporterId = $('#j-editform select[name=reporterId] option').eq(selectedIndex).val(),
      reporter = $('#j-editform select[name=reporterId] option').eq(selectedIndex).text();
    formData['reporterId'] = reporterId;
    formData['reporter'] = reporter;
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
});

// 获取数据
function getData(){
  lvsCmd.ajax('/live-web-cms/report/get.json', {reportId: urlData['reportId']}, function (state, res) {
    if (state) {
      if (res['status'] == 0) {
        var formVal = res['data'];
        // 格式化日期
        formVal['createTime'] = lvsCmd['formatDate'](formVal['createTime'], 'YY-MM-DD hh:mm');
        // 插入报道人
        $('#j-editform select[name=reporterId]').append('<option value="'+formVal['userId']+'">'+formVal['reporter']+'</option>');
        // 设置表单值
        newTplform.setval(formVal);
        $('.j-type').data('type', formVal['type']);
        if (formVal['type'] == 1) {
          $('.j-type input').val("图文");
          $('.j-uploader .filelist').data('filetype', 2);
        } else if (formVal['type'] == 2) {
          $('.j-type input').val("音频");
          $('.j-uploader .filelist').data('filetype', 3);
        } else if (formVal['type'] == 4) {
          $('.j-type input').val("视频");
          $('.j-uploader .filelist').data('filetype', 4);
        }
        // 创建上传组件
        var newUpfile = new lvsCmd['upfile']($('.j-uploader .filelist'));
        if (formVal['pictures']) {
          var pictures = formVal['pictures'].split(',');
          $.each(pictures, function(){
            newUpfile.addfile(this);
          });
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
