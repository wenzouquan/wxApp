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
    var subject_id=options.subject_id;
    this.setData({subject_id:subject_id});
    this.intData();
    //设置滚动高度
    var rpx=app.globalData.window.rpx;
    var scroll_height=app.globalData.window.windowHeight*rpx;
    this.setData({scrollH:scroll_height});
  },
  //动态
  intData:function(){
     var that = this;
     var subject_id=this.data.subject_id;
      app.getPageData("BoxApi/Subject/timeline",{'subjectid':subject_id,'type':'xuebazi','public':1},function(data){
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
  },
//加载更多
  scrolltolower:function(e){
    var _this=this;
    var nowPage=_this.data.nowPage;
    var totalPages=_this.data.totalPages;
    if(totalPages>nowPage){
      var subject_id=_this.data.subject_id;
        nowPage=nowPage+1;
        app.getPageData("BoxApi/Subject/timeline",{'subjectid':subject_id,'type':'xuebazi','public':1,'p':nowPage},function(data){
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
