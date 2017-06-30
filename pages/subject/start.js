//index.js
//获取应用实例
var app = getApp();
Page({
  onLoad: function (options) {
    var that = this;
     var subject_id=options.subject_id;
      //如果有正在学的课程id
    if(!subject_id){
       subject_id = wx.getStorageSync('cur_subject_id');
     }else{
        //存储课程ID 
      wx.setStorage({
            key:"cur_subject_id",//当前课程ID
            data:subject_id,
          }); 
     }
    //没有正在学的课程就要去开通
     if(!subject_id){
        wx.navigateTo({
           url: 'index',
        });
        return false;
    }   
    this.setData({subject_id:subject_id});
    this.intData();
  },
  //下拉刷新
  onPullDownRefresh: function () {
     this.intData();
  },

  intData:function(){
    var that=this;
    var subject_id=this.data.subject_id;
    app.getPageData("Subject/index",{subjectid:subject_id},function(data){
         that.setData(data);
          wx.setNavigationBarTitle({title:that.data.subjectInfo.subject});
          wx.stopPullDownRefresh();
     });
  },

  onReady:function(){
   
  }

})
