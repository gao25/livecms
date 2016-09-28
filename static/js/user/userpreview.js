// 获取参数
var identityNo = lvsCmd['urlParams']['identityNo'];
if (!identityNo) {
  location.href = 'usermanagement.html';
}

// juicer函数
juicer.register('formatDate', lvsCmd['formatDate']);
juicer.register('formatState', function(state){
  if (state == 0) {
    return '禁用';
  } else if (state == 1) {
    return '启用';
  }
});

// 渲染列表
var viewTpl = juicer($('#j-preview script').html());
$('#j-preview script').remove();
function previewRender (state, res) {
  if (state) {
    if (res['status'] == '0') {
      if (res['data'] && res['data'].length) {
        var viewHtml = viewTpl.render({data: res['data'][0]});
        $('#j-preview').html(viewHtml);
      }
    } else {
      alert(res['errMsg']);
    }
  } else {
    alert("接口请求失败，请检查网络连接！");
  }
}
parent.executeCallback('/thirduserquery/getList.json', {currentPage:1,pageCount:20,identityNo:identityNo}, 'previewRender');