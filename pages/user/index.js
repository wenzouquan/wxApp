//index.js
//获取应用实例
var app = getApp();
Page({
  data: {
   'text':'<view>你好</view>',
  },
   //下拉刷新
  onPullDownRefresh: function () {
     this.intData();
  },
  
  intData:function(){
   var that = this;
    app.getPageData("User/index",function(data){
                that.setData(data);
                wx.setStorage({
                  key:"user_info",
                  data:data.user_info
                });
               that.setData({'user_info':data.user_info});  
               wx.stopPullDownRefresh();
        });
  },
  onLoad: function () {
    var that = this;
    var user_info=wx.getStorageSync('user_info');
    console.log(user_info);
    if(user_info){
        that.setData({'user_info':user_info});  
    }else{
        that.intData();
    }
   
  }
})
