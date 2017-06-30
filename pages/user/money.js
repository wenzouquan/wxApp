//index.js
//获取应用实例
var app = getApp();
Page({
 data:{
    nowPage:0,
    totalPages:0,
  },
  onLoad: function (options) {
    var that = this;
     app.getPageData("BoxApi/Subject/timeline",{'user_id':1,'type':'money'},function(data){
        if(data.pager){
           that.setData({'nowPage':1});//当前页
           that.setData({'totalPages':data.pager.totalPages});//总页数
        }
        if(data.list){
            that.setData({'listData':data.list});
        }else{
            that.setData({'listData':[]});
        }  
     });
        //设置滚动高度
    var rpx=app.globalData.window.rpx;
    var scroll_height=app.globalData.window.windowHeight*rpx;
    this.setData({scrollH:scroll_height});
    
  },
    //加载更多
  scrolltolower:function(e){
    var _this=this;
    var nowPage=_this.data.nowPage;
    var totalPages=_this.data.totalPages;
    if(totalPages>nowPage){
        nowPage=nowPage+1;
        app.getPageData("BoxApi/Subject/timeline",{'user_id':1,'type':'money','p':nowPage},function(data){
          if(data.list){
              var listData=_this.data.listData;
              var new_listData=listData.concat(data.list);
              _this.setData({'listData':new_listData});
              _this.setData({'nowPage':nowPage});//当前页
          } 
      });
    }
  }



})
