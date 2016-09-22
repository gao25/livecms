// filetype: img audio video
var filetype = lvsCmd['urlParams']['filetype'],
  callback = lvsCmd['urlParams']['callback'];

// 文件限制
var filters = {};
if (filetype == 'img') {
  filters['mime_types'] = [
    {title: "Image files", extensions: "jpg,gif,png,bmp"}
  ];
} else if (filetype == 'audio') {
  filters['mime_types'] = [
    {title: "Audio files", extensions: "ogg,mp3,wav"}
  ];
} else if (filetype == 'video') {
  filters['mime_types'] = [
    {title: "Video files", extensions: "3gp,mp4,m3u8,wmv,webm"}
  ];
}
filters['max_file_size'] = '1048576kb'; // 最大只能上传 1024 * 1024kb = 1G 的文件
filters['prevent_duplicates'] = true; // 不允许选取重复文件

// 获取上传 accessid、policyBase64、signature
var multipart_params;
lvsCmd.ajax('/live-web-cms/uploader.json', {}, function (state, res) {
  if (state) {
    if (res['status'] == '0') {
      multipart_params = {
        // 'key' : 'a.png', // 文件路径 文件名
        'OSSAccessKeyId': res['data']['accessid'],
        'policy': res['data']['policyBase64'],
        'signature': res['data']['signature'],
        'success_action_status': '200' //让服务端返回200,不然，默认会返回204
      };
      $('#j-uploader-select').show();
      uploader.init();
    } else {
      alert(res['errMsg']);
    }
  } else {
    alert("接口请求失败，请检查网络连接！");
  }
});

// 生成随机文件名
function fileNameRandom(){
  var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
    maxPos = chars.length,
    random = '';
  for (i = 0; i < 32; i++) {
    random += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return random;
}
function fileNameExt (filename) {
  var pos = filename.lastIndexOf('.'),
    suffix = ''
  if (pos != -1) {
    suffix = filename.substring(pos)
  }
  return suffix;
}

// 创建上传是实例
// http://xinhua-zbcb.oss-cn-hangzhou.aliyuncs.com
var host = 'http://post-test.oss-cn-hangzhou.aliyuncs.com';
var uploader = new plupload.Uploader({
  runtimes: 'html5,flash,silverlight,html4',
  browse_button: 'j-uploader-select',
  multi_selection: false, // 单选
  container: document.getElementById('j-uploader'),
  flash_swf_url: '/lib/plupload-2.1.2/js/Moxie.swf',
  silverlight_xap_url: '/lib/plupload-2.1.2/js/Moxie.xap',
  url: host,
  filters: filters,
  init: {
    PostInit: function(){
      // nothing
    },
    FilesAdded: function (up, files) {
      var file = files[0],
        newFilename = fileNameRandom() + fileNameExt(file.name),
        filesize = Math.ceil(file.size / 1024);
      
      $('#j-uploader-select').hide();
      $('#j-uploader-tip').removeClass('fn-hide').html('文件 ['+newFilename+'/'+filesize+'KB] 正在上传... <em>0%</em>');
      $('#j-uploader-tip').data('filename', newFilename);

      multipart_params['key'] = newFilename;
      up.setOption({
        multipart_params: multipart_params
      });
      up.start();
    },
    /*
    BeforeUpload: function(up, file) {
      // nothing
    },
    */
    UploadProgress: function (up, file) {
      $('#j-uploader-tip em').html(file.percent + '%');
    },
    FileUploaded: function(up, file, info) {
      if (info.status == 200) {
        parent.window.frames['mainframe'][callback]($('#j-uploader-tip').data('filename'));
        parent.window.mainframe.hide();
      } else {
        $('#j-uploader-tip').html(info.response);
      }
    },
    Error: function (up, err) {
      if (err['code'] == -602) {
        // code: -602, message: "Duplicate file error.",
        alert('文件已选择！');
      } else {
        // console.log(err);
        $('#j-uploader-tip').html('文件上传失败：' + err.message);
      }
      // document.getElementById('console').appendChild();
    }
  }
});
