/* filetype:
  USER_PORTRAIT(1,"xinhua-usercenter","portrait","用户头像"),
  REPORT_PIC(2,"xinhua-zbcb","report-img","报道图片"),
  REPORT_AUDIO(3,"xinhua-zbcb","report-audio","报道音频"),
  REPORT_VIDEO(4,"xinhua-zbcb","report-video","报道视频"),
  LIVE_COVER(5,"xinhua-zbcb","live-img","现场封面"),
  LIVE_VIDEO(6,"xinhua-zbcb","live-video","现场回看视频");
*/

var filetype = lvsCmd['urlParams']['filetype'],
  callback = lvsCmd['urlParams']['callback'],
  iframe = lvsCmd['urlParams']['iframe'];
if (!iframe) iframe = 'mainframe';

// 文件限制
var filters = {};
if (filetype == 1 || filetype == 2 || filetype == 5) {
  filters['mime_types'] = [
    {title: "Image files", extensions: "jpg,gif,png,bmp"}
  ];
} else if (filetype == 3) {
  filters['mime_types'] = [
    {title: "Audio files", extensions: "ogg,mp3,wav"}
  ];
} else if (filetype == 4 || filetype == 6) {
  filters['mime_types'] = [
    {title: "Video files", extensions: "3gp,mp4,m3u8,wmv,webm,mov"}
  ];
}
filters['max_file_size'] = '1048576kb'; // 最大只能上传 1024 * 1024kb = 1G 的文件
filters['prevent_duplicates'] = true; // 不允许选取重复文件

// 获取上传 accessid、policyBase64、signature
var host = '',
  dir = '',
  multipart_params;
function getUploaderSign (state, res) {
  if (state) {
    if (res['status'] == '0') {
      host = res['data']['host'];
      dir = res['data']['dir'];
      multipart_params = {
        // 'key' : 'a.png', // 文件路径 文件名
        'OSSAccessKeyId': res['data']['accessId'],
        'policy': res['data']['policy'],
        'expire': res['data']['expire'],
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
}
function getUploaderSignFn(){
  parent.executeCallback('/osspolicy/getPolicy.json', {"fileType":filetype}, 'getUploaderSign', 'uploaderFrame');
  setTimeout(getUploaderSignFn, 540000); // 实际过期时间10分钟，每9分钟重新获取一次
}
getUploaderSignFn();

// 生成文件名
function fileNameRandom(){
  var randomName = '/' + lvsCmd['cookie'].get('orgId');
  if (filetype == 1) {
    randomName +=  '/' + lvsCmd['cookie'].get('userId') + '/' + new Date().getTime();
  } else if (filetype == 5) {
    randomName += '/' + new Date().getTime();
  } else {
    randomName += '/' + new Date().getTime();
  }
  return randomName;
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
var uploader = new plupload.Uploader({
  runtimes: 'html5,flash,silverlight,html4',
  browse_button: 'j-uploader-select',
  multi_selection: false, // 单选
  container: document.getElementById('j-uploader'),
  flash_swf_url: '/lib/plupload-2.1.2/js/Moxie.swf',
  silverlight_xap_url: '/lib/plupload-2.1.2/js/Moxie.xap',
  url: 'http://xinhua.oss-cn-hangzhou.aliyuncs.com',
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
      $('#j-uploader-tip').removeClass('fn-hide').html('文件 ['+file.name+'/'+filesize+'KB] 正在上传... <em>0%</em>');

      multipart_params['key'] = dir + newFilename;
      up.setOption({
        url: host,
        multipart_params: multipart_params
      });

      // console.log(multipart_params);

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
        parent.window.frames[iframe][callback]('/' + multipart_params['key']);
        parent.window.mainOverlay.hide();
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
