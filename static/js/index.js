// 判断用户权限
var role = lvsCmd['cookie'].get('role');
if (!role) {
  alert('尚未登录或登录过期，请重新登录！');
  parent.location.href = '/login.html';
}

// 获取用户信息
if ($('#j-executeframe').length == 0) {
  $('body').append('<div class="fn-hide"><iframe id="j-executeframe" src="about:blank"></iframe></div>');
}
function executeUserCallback (state, res) {
  if (state) {
    if (res['status'] == 0) {
      var userData = res['data'];
      $('#j-user .uname').html(userData['nick']);
      $('#j-admin .uname').html(userData['accountName']);
      if (userData['portrait']) {
        $('#j-user .headpic img, #j-admin .headpic img').attr('src', userData['portrait']);
      }
    } else {
      alert(res['errMsg']);
    }
  }
}
function executeUserFn(){
  var random = lvsCmd['random'].get();
  if (random) {
    var actionHead = '{"random":"'+random+'","token":"'+lvsCmd['cookie'].get('token')+'"}';
    $('#j-executeframe').attr('src', executeServer + '/execute/?action=/userquery/getUser.json&actionHead='+actionHead+'&callback=executeUserCallback');
  } else {
    setTimeout(executeUserFn, 100);
  }
}
executeUserFn();

// 判断展示菜单
var navAllData = {
  scene: {
    "title": "现场管理",
    "list": [
      {
        "menu": "待签报道",
        "link": "/scene/reportlist.html"
      },
      {
        "menu": "待签现场",
        "link": "../scene/checkscene.html"
      },
      {
        "menu": "成品现场",
        "link": "/scene/endscene.html"
      },
      {
        "menu": "待审评论",
        "link": "/scene/reportlist.html"
      },
      {
        "menu": "视频素材",
        "link": "/scene/videomaterial.html"
      }
    ]
  },
  visitor: {
    "title": "用户管理",
    "list": [
      {
        "menu": "用户管理",
        "link": "/scene/reportlist.html"
      }
    ]
  },
  count: {
    "title": "数据统计",
    "list": [
      {
        "menu": "数据统计",
        "link": "/scene/reportlist.html"
      }
    ]
  },
  admin: {
    "title": "管理员管理",
    "list": [
      {
        "menu": "管理员管理",
        "link": "/scene/reportlist.html"
      }
    ]
  }
};
var roleNav = {
  sysadmin: ["admin"], // 系统管理员
  admin: ["scene", "visitor", "count", "admin"], // 合作方管理员
  approver: ["scene", "visitor", "count"], // 编辑人员
  reporter: [] // 记者
};
var navConfig = [];
if (roleNav[role]) {
  $.each(roleNav[role], function(){
    navConfig.push(navAllData[this]);
  });
}

// 显示菜单
var navObj = $('#j-nav'),
  leftNavObj = $('#j-leftnav');
$.each(navConfig, function(index){
  // 创建顶部菜单
  if (index > 0) {
    navObj.append('<em>/</em>');
  }
  var newNav = $('<a href="javascript:void(0)">'+this['title']+'<em class="arrow"></em></a>'),
    newLeftNavObj = $('<ul class="fn-hide"></ul>');
  navObj.append(newNav);
  // 创建左侧菜单
  $.each(this['list'], function(){
    newLeftNavObj.append('<li><a target="mainframe" href="'+this['link']+'"><em class="line"></em><em class="arrow"></em>'+this['menu']+'</a></li>');
  });
  leftNavObj.append(newLeftNavObj);
  // 绑定顶部和左侧菜单联动
  newNav.click(function(){
    navObj.find('a').removeClass('current');
    $(this).addClass('current');
    leftNavObj.find('ul').addClass('fn-hide');
    newLeftNavObj.removeClass('fn-hide');
    newLeftNavObj.find('a').removeClass('current');
    var firstA = newLeftNavObj.find('a:eq(0)');
    firstA.addClass('current');
    $('iframe[name=mainframe]').attr('src', firstA.attr('href'));
    return false;
  });
  // 绑定左侧菜单样式变化
  newLeftNavObj.find('a').click(function(){
    newLeftNavObj.find('a').removeClass('current');
    $(this).addClass('current');
  });
});

// 默认展示菜单第一项
navObj.find('a:eq(0)').addClass('current');
leftNavObj.find('ul:eq(0)').removeClass('fn-hide');
leftNavObj.find('a:eq(0)').addClass('current');
$('iframe[name=mainframe]').attr('src', leftNavObj.find('a:eq(0)').attr('href'));

// 退出
$('#j-logout').click(function(){
  lvsCmd['cookie'].del('token');
  lvsCmd['cookie'].del('role');
  parent.location.href = '/login.html';
  return false;
});


//个人设置样式
$('.lset').hover(function(){
  $('.lset ul').show();
},function(){
  $('.lset ul').hide();
})
$('.lset li a').hover(function(){
  $(this).css('color','#12bb9a');
},function(){
  $(this).css('color','#f3f3f3');
})





