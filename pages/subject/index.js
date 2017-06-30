//index.js
//获取应用实例
var app = getApp();
Page({
  data: {
    motto: '你好啊！！！ World',
    userInfo: {}
  },

  onLoad: function (options) {
     //如果有正在学的课程id
    // var value = wx.getStorageSync('cur_subject_id');
    // if (value) {
    //   console.log(value);
    //    wx.navigateTo({
    //        url: 'start?subject_id='+value,
    //     });
    //     return false;
    // }

   
     this.setData({navCur:1});
     this.intData();
  },
  //下拉刷新
  onPullDownRefresh: function () {
     this.intData();
  },
  //
  intData:function(){
    var that = this
      //我的课程列表
        app.getPageData("BoxApi/Subject/my_subject",function(data){
            that.setData({list:data});
             wx.stopPullDownRefresh();
        });
  },
   sortlist:function(event){
    var nav=event.target.dataset.nav;
    this.setData({navCur:nav});
  },
})
