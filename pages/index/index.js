//index.js
//获取应用实例
var app = getApp();
Page({
  data: {
    motto: '你好啊！！！ World',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
   // wx.showToast();
    console.log('onLoad')
    var that = this
    //课程列表
    app.getPageData("Index/subjectList",function(data){
         that.setData({
              subjectList:data.subjectList
         });
    });
  }
  
})
