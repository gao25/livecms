var navConfig = [
  {
    "title": "现场管理",
    "list": [
      {
        "menu": "待签报道",
        "link": "/scene/reportlist.html"
      },
      {
        "menu": "待签现场",
        "link": "/scene/reportlist.html"
      },
      {
        "menu": "成品现场",
        "link": "/scene/reportlist.html"
      },
      {
        "menu": "待审评论",
        "link": "/scene/reportlist.html"
      },
      {
        "menu": "视频素材",
        "link": "/scene/reportlist.html"
      }
    ]
  },
  {
    "title": "用户统计",
    "list": [
      {
        "menu": "用户统计",
        "link": "/scene/reportlist.html"
      }
    ]
  },
  {
    "title": "数据统计",
    "list": [
      {
        "menu": "数据统计",
        "link": "/scene/reportlist.html"
      }
    ]
  },
  {
    "title": "管理员管理",
    "list": [
      {
        "menu": "管理员管理",
        "link": "/scene/reportlist.html"
      }
    ]
  }
];
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

