// 提交审核
function verifyFn(){
  lvsCmd.ajax('/live-web-cms/comment/approve.json', formData, function (state, res) {
    if (state) {
      if (res['status'] == '0') {
        parent.window.frames[iframe][callback]();
        parent.window.mainOverlay.hide();
      } else {
        alert(res['errMsg']);
      }
    } else {
      alert("接口请求失败，请检查网络连接！");
    }
  });
}
$('#j-pass').click(function(){
  // 审核通过
  formData['state'] = 2;
  verifyFn();
});
$('#j-back').click(function(){
  // 审核不通过
  parent.window.mainOverlay.show('<div class="lvs-overlay"><div class="title">评论审核<em class="j-overlay-close">X</em></div><iframe scrolling="auto" frameborder="0" width="640" height="400" src="scene/reportverifyback.html?reportId='+urlData['reportId']+'&callback='+urlData['callback']+'"></iframe></div>');
});