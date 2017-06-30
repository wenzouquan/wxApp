//index.js
//获取应用实例
var app = getApp();
Page({
  data:{
    sortNavLoad:{},
    imageList:[],
    nowPage:[],
    totalPages:[],
    listData:[],
  },
  onLoad: function (options) {
    var that = this;
    var subject_id=options.subjectid;
    that.setData({subject_id:subject_id});
    var rpx=app.globalData.window.rpx;
    var scroll_height=app.globalData.window.windowHeight*rpx-100;
    this.setData({scroll_height:scroll_height});
    this.setData({sortNav:1});
    this.askTopic(1);
  },
  ////我要提问
  reply:function(){
    this.setData({'popup':1,'hidechooseImage':0,'imageList':[],'title':'','content':''});
  },
    //取消
  btn_cancel:function(){
     this.setData({'popup':0});
  },
   //选项卡
  sortlist:function(event){
    var nav=event.target.dataset.nav;
    this.setData({sortNav:nav});
    //console.log("sortlist:"+nav);
    //this.askTopic(nav);
  },
  //swiperChange
  durationChange: function(e) {
    var index=e.detail.current;
    //var sortNavLoad=this.data.sortNavLoad;
    if(!this.data.sortNavLoad[index]){
        this.setData({sortNav:index});
        this.askTopic(index);
    }
  },
  //下拉刷新
  scrolltolower:function(event){
    var index=event.target.dataset.scroll;
    var _this=this;
    var nowPage=_this.data.nowPage[index];
    var totalPages=_this.data.totalPages[index];
    if(totalPages>nowPage){
      var subject_id=_this.data.subject_id;
        nowPage=nowPage+1;
        app.getPageData("BoxApi/Subject/topic",{'pid':this.data.subject_id,type:index,'p':nowPage},function(data){
          if(data.list){
              var listData=_this.data.listData;
              var _listData=listData[index];
              var new_listData=_listData.concat(data.list);
              listData[index]=new_listData;
              _this.setData({'listData':listData});
              var nowPages=_this.data.nowPage;  
              nowPages[index]=nowPage;    
              _this.setData({'nowPage':nowPages});//当前页
          } 
      });
    } 
    console.log(e);
  },
   //问答列表
  askTopic:function(index){
     var that = this;
     this.data.sortNavLoad[index]=1;
     //var index=this.data.sortNav;
       app.getPageData("BoxApi/Subject/topic",{pid:this.data.subject_id,type:index},function(data){
           if(data.pager){
             var nowPages=that.data.nowPage;  
              nowPages[index]=1;  
              var totalPages=that.data.totalPages;  
              totalPages[index]=data.pager.totalPages;    
              that.setData({'nowPage':nowPages});//当前页
              that.setData({'totalPages':totalPages});//总页数
           }
            if(data.list){
              var listData=that.data.listData;
              listData[index]=data.list;
              that.setData({listData:listData});                
            }      
        });
  },
    //上传图片
   chooseImage: function () { 
    var that = this
    var limit=9;
    var imageList=that.data.imageList;
    if(imageList){
        limit=limit-imageList.length;
    }
    wx.chooseImage({
      // sourceType: sourceType[this.data.sourceTypeIndex],
      // sizeType: sizeType[this.data.sizeTypeIndex],
      sizeType:'compressed',
      count: limit,
      success: function (res) {
      console.log(res);
      var newImages=res.tempFilePaths;
       if(imageList){
         for(var i in newImages){
            imageList.push(newImages[i]);
        }
       }else{
         imageList=newImages;
       }
      that.setData({
          imageList: imageList
        });
        if(imageList.length>8){
          that.setData({hidechooseImage: 1})
        } 
      }
    })
  },
  //浏览图片
  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  //提交
  formSubmit:function(e){  
    var postData=e.detail.value;
    if(postData.content=="" || postData.title==""){
      wx.showToast({
        title: '标题和正文不能为空',
        icon: 'success',
        duration: 2000
      })
     return false; 
    }
    this.setData({'loading':1});
    this.setData({'disabled':1});
    var _this=this;
    var param={pid:this.data.subject_id,content:postData.content,title:postData.title,type:'eduAsk'};
    //上传完图片之后
   if(this.data.imageList && this.data.imageList.length>0){
      app.uploadFile(this.data.imageList,function(uploadImages){
        var imgContent="";
         for(var i in uploadImages){
           imgContent+='<img  src="'+uploadImages[i]['file_url']+'" >';
         }
        param['content']+= imgContent;
         _this.postTopic(param);
      });
   }else{
       _this.postTopic(param);
   }
  },
  //发布
  postTopic:function(param){
      var _this=this;
      app.postData("BoxSns/Home/Index/addTopic",param,function(data){
                  _this.setData({'loading':0});
                  _this.setData({'disabled':0});
                  var title="";
                  if(data.error==0){
                      title="提交成功"
                     // _this.setData({'popup':0});
                      _this.setData({'popup':0,'hidechooseImage':0,'imageList':[],'title':'','content':''});
                      _this.setData({sortNav:3});
                      _this.askTopic(3);
                  }else{
                      title=data.msg;
                  }
                  wx.showToast({
                    title: title,
                    icon: 'success',
                    duration: 2000
                  });
      })
  }


  

})
