//index.js
//获取应用实例
var app = getApp();
Page({
  data:{url:1},
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo');
  },
  onLoad: function (options) {
    var rpx=app.globalData.window.rpx;
    var video_height=app.globalData.window.windowWidth*0.5625*rpx;
    var scroll_height=app.globalData.window.windowHeight*rpx-video_height-100;
    this.setData({video_height:video_height});
    this.setData({scroll_height:scroll_height});
   
    var that = this;
    var subject_id=options.subjectid;
    var knowsid=options.knowsid?options.knowsid:0;
    that.setData({subject_id:subject_id});
    //章节详情
    app.getPageData("Subject/lesson_detail",{subjectid:subject_id,knowsid:knowsid},function(data){
         that.setData(data);
          wx.setNavigationBarTitle({title:data.knowsData.knows});
         var video_info = data.knowsData.video_info;
          if (!video_info) {
              video_info = {};
          }
         var  play_url = video_info.url;
          if (typeof(play_url) != "string" || play_url=="") {
                //alert(typeof(video_info.url));
                play_url = 'http://movie.ks.js.cn/flv/other/1_0.mp4';
          }
          that.setData({video_info:video_info});
          that.setData({play_url:play_url});
          that.setData({knowsid:data.knowsid});
         //加载问答
          that.askTopic();
    });
    //课程列表
     app.getPageData("BoxApi/Subject/lesson",{subject_id:subject_id},function(data){
         that.setData({lesson:data});
    });
    that.setData({sortNav:1});
    that.setData({lessonShow:0});
  },

  //问答列表
  askTopic:function(){
     var that = this;
     console.log({pid:this.data.subject_id,pid3:this.data.knowsid});
       app.getPageData("BoxApi/Subject/topic",{pid:this.data.subject_id,pid3:this.data.knowsid},function(data){
            if(data.list){
                that.setData({listData:data.list});
            }      
        });
  },
  //选项卡
  sortlist:function(event){
    var nav=event.target.dataset.nav;
    this.setData({sortNav:nav});
  },
  //课程列表
  lesson_box:function(event){
      var index=event.target.dataset.index;
      if(index==this.data.lessonShow){
        this.setData({lessonShow:-1});
      }else{
        this.setData({lessonShow:index});
      }  
  },
  ////写笔记
  reply:function(){
    this.setData({'popup':1});
  },
    //取消
  btn_cancel:function(){
     this.setData({'popup':0});
  },
  //提交笔记
  formSubmit:function(e){
    var postData=e.detail.value;
    if(postData.content==""){
      wx.showToast({
        title: '笔记内容不能为空',
        icon: 'success',
        duration: 2000
      })
     return false; 
    }
    this.setData({'loading':1});
    this.setData({'disabled':1});
    var _this=this;
    //提交回答
    app.postData("BoxApi/Subject/save_note",{knowsid:this.data.knowsid,notes:postData.content},function(data){
      _this.setData({'loading':0});
      _this.setData({'disabled':0});
      var title="";
      if(data.error==0){
          title="提交成功"
          _this.setData({'popup':0});
           _this.setData({notes:postData.content});
      }else{
          title=data.msg;
      }
      wx.showToast({
        title: title,
        icon: 'success',
        duration: 2000
      })
    })
    console.log(e);
  },
  //播放
  myplay:function(e){
    console.log("播放");
    console.log(e);
  },
   pause:function(e){
     console.log("播放暂停");
    console.log(e)
  },
  
   durationchange:function(e) {
     console.log("durationchange");
     console.log(e)
   },
   ended:function(e){
     console.log("播放完");
    console.log(e)
  },
   bindSendDanmu: function () {
     this.videoContext.play();
     this.videoContext.seek(12);
     console.log(this.videoContext);
   },
   test:function(){
     console.log('playbackRate');
     this.videoContext.playbackRate=1.5;
    // console.log();
   },

  error:function(e){
     console.log("播放错误");
    console.log(e)
  }

})
