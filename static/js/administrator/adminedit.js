// 获取参数
var id = + lvsCmd["urlParams"]["id"];
if (isNaN(id) || id < 1) {
  id = 0;
  $('#j-pagetitle').html('添加管理员');
} else {
  $('#j-pagetitle').html('编辑');
}

// 渲染表单
var newTplform = new cake["tplform-1.0.1"]('j-editform');
function renderForm (state, res) {
  if (!state) {
    alert("接口请求失败，请检查网络连接！");
    return false;
  }
  var orgMap = res['data']['orgMap'],
    roleMap = res['data']['roleMap'],
    orgMapSelect = {
      "class": "j-role",
      "title": "所属机构",
      "name": "orgId",
      "type": "select",
      "option": []
    }, roleMapSelect = {
      "title": "角色",
      "name": "role",
      "type": "select",
      "option": []
    };
  $.each(orgMap, function (key, value) {
    orgMapSelect['option'].push({"text": value, "value": key});
  });
  $.each(roleMap, function (key, value) {
    roleMapSelect['option'].push({"text": value, "value": key});
  });
  var formConfig = {
    "type": "ajax",
    "method": "post",
    "action": "",
    "fields": [{
      "title": "手机",
      "name": "mobile",
      "type": "text",
      "required": true
    }, {
      "title": "真实姓名",
      "name": "nick",
      "type": "text"
    }, {
      "title": "密码",
      "name": "password",
      "type": "password",
      "required": true
    }, {
      "title": "重复密码",
      "name": "password2",
      "type": "password",
      "required": true
    }, orgMapSelect, roleMapSelect, {
      "title": "状态",
      "name": "state",
      "type": "select",
      "option": [
        {"text": "启用", "value": "1"},
        {"text": "禁用", "value": "0"}
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
      $('.j-role').remove();
      getEditData();
    }
    // 取消
    $('.j-cancel').click(function(){
      location.href = document.referrer;
    });
  }, function (formInfo) {
    if (formInfo['data']['password'] != formInfo['data']['password2']) {
      alert('两次密码输入不一致，请重新输入！');
      return false;
    }
    var formData = {
      nick: formInfo['data']['nick'],
      countryMobileCode: '86',
      mobile: formInfo['data']['mobile'],
      state: formInfo['data']['state'],
      password: formInfo['data']['password'],
      orgId: formInfo['data']['orgId'],
      role: formInfo['data']['role']
    };
    if (id > 0) {
      formData['id'] = id;
      var url = "/userupdate/editUser.json";
    } else {
      var url = "/userupdate/createUser.json";
    }
    parent.executeCallback(url, formData, 'saveForm');
  });
}
parent.executeCallback('/userquery/getOrgAndRole.json', {}, 'renderForm');

// 获取/写入数据
function setEditData (state, res) {
  if (state) {
    if (res['status'] == 0) {
      newTplform.setval(res['data']);
    } else {
      alert(res['errMsg']);
    }
  } else {
    alert("接口请求失败，请检查网络连接！");
  }
}
function getEditData(){
  parent.executeCallback('/userquery/getUserById.json', {userId:id}, 'setEditData');
}
// 保存表单
function saveForm (state, res) {
  if (state) {
    if (res['status'] == '0') {
      alert("数据保存成功！");
      if (id > 0) {
        location.href = document.referrer;
      } else {
        location.href = document.URL.substr(0,document.URL.lastIndexOf('/')) + '/administratormanagement.html';
      }
    } else {
      if (res['errCode'] == 'mobile_exist') {
        alert('用户已存在！');
      } else {
        alert(res['errMsg']);
      }
    }
  } else {
    alert("接口请求失败，请检查网络连接！");
  }
}

