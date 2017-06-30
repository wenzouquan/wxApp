//index.js
//获取应用实例
var app = getApp();
Page({
  onLoad: function (options) {
    var that = this;
    var user_info=wx.getStorageSync('user_info');
    that.setData({'user_info':user_info});   
    app.getPageData("BoxApi/Subject/timeline",{'user_id':1,'type':'money'},function(data){
        if(data.list){
            that.setData({'listData':data.list});
        }else{
            that.setData({'listData':[]});
        }  
     });
    that.setData({
          headImage: [user_info.headimg],sex:user_info.sex
        }); 
  },
  popup:function(event){
    var popup=event.target.dataset.popup;
     this.setData({'popup':popup});
  },
  radioChange:function(event){
    var sex=event.target.dataset.sex;
     this.setData({'sex':sex});
  },
    //取消
  btn_cancel:function(){
     this.setData({'popup':0});
  },
   //上传图片
   chooseImage: function () { 
    var that = this
    wx.chooseImage({
      sizeType:'compressed',
      count: 1,
      success: function (res) {
      var newImages=res.tempFilePaths;
      that.setData({headImage: newImages});
      that.setData({hasheadImage:1});
      }
    })
  },
  //浏览图片
  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.headImage
    })
  },
//更新用户数据
 updateInfo:function(param){
    var _this=this;
    app.postData("BoxApi/Index/updateInfo",param,function(data){
      _this.setData({'loading':0});
      _this.setData({'disabled':0});
      var title="";
      if(data.error==0){
          title="保存成功"
          _this.setData({'popup':0});
           var user_info=_this.data.user_info;
           var updateInfo=data.data;
           for(var i in updateInfo){
               user_info[i]=updateInfo[i];
               if(i=='sex'){
                   user_info['sex_str']=updateInfo[i]==1?'男':'女';
               }
           }
           _this.setData({user_info:user_info});
            wx.setStorage({
                  key:"user_info",
                  data:user_info
            });
      }else{
          title=data.msg;
      }
      wx.showToast({
        title: title,
        icon: 'success',
        duration: 2000
      })
    })
 },
  //更新头像
  formSubmitImg:function(){
    var _this=this;
    this.setData({'loading':1});
    this.setData({'disabled':1});
    var hasheadImage=this.data.hasheadImage;
    var headImage=this.data.headImage;
    if(hasheadImage){
        app.uploadFile(headImage,function(uploadImages){
           // var param['content']= uploadImages[0];
          //  _this.postTopic(param);
            _this.updateInfo({'headimg':uploadImages[0]['file_url']});
        });
    }
     
  },

   //提交
  formSubmit:function(e){
    var postData=e.detail.value;
    this.setData({'loading':1});
    this.setData({'disabled':1});
    var _this=this;
    //提交回答
    //console.log(e);
     this.updateInfo(postData);
  },

   //更新性别
  formSubmit_sex:function(e){
    var postData={sex:this.data.sex}
    this.setData({'loading':1});
    this.setData({'disabled':1});
    var _this=this;
    //提交回答
    //console.log(e);
     this.updateInfo(postData);
  },

  


})
