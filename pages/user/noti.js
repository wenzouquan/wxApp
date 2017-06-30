//index.js
//获取应用实例
var app = getApp();
Page({
  onLoad: function (options) {
    var that = this;
     app.getPageData("User/noti",function(data){
        if(data.data){
            that.setData({'listData':data.data});
        }else{
            that.setData({'listData':[]});
        }  
     });
    
  }


})
