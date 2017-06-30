//index.js
//获取应用实例
var app = getApp();
Page({
 data:{school_money:0,saveMoney:0,postData:{'yie':0,'school_num':''}},
  onLoad: function (options) {
    var that = this;
    var subject_id=options.subject_id;
    this.setData({subjectid:subject_id});
   // console.log(options);
    //console.log("subject delata");
    //课程详情
    app.getPageData("Index/subject_detail",{subject_id:subject_id},function(data){
         that.setData(data);
         that.setData({goods_amount:data.data.price,save_money:0});
    });
    //课程列表
     app.getPageData("BoxApi/Subject/lesson",{subject_id:subject_id},function(data){
         that.setData({lesson:data});
    });
    //学员心声
     app.getPageData("BoxApi/Subject/subject_comment",{subject_id:subject_id},function(data){
        if(data && data.list){
          that.setData({listData:data.list});
        }      
    });

    that.setData({sortNav:1});
    that.setData({lessonShow:0});
    var user_info=wx.getStorageSync('user_info');
     that.setData({user_info:user_info});
    
  },
  sortlist:function(event){
    var nav=event.target.dataset.nav;
    this.setData({sortNav:nav});
  },
  lesson_box:function(event){
      var index=event.target.dataset.index;
      if(index==this.data.lessonShow){
        this.setData({lessonShow:-1});
      }else{
        this.setData({lessonShow:index});
      }
      
  },
//显示报名信息
  showPopup:function(){
    console.log(1);
    this.setData({'popup':1});
  },
  //取消
  btn_cancel:function(){
     this.setData({'popup':0});
  },
 //使用代理码
 blurSchoolNum:function(e){
   var num = e.detail.value;
   var _this=this;
   if(num!=""){
      _this.data.postData.school_num=num;
     app.getPageData("Subject/get_card",{subjectid:this.data.data.subjectid,num:num,'type':'school_num'},function(data){
        console.log(data);
         if(data.error==0){
          _this.setData({school_money:data.money});
          _this.setData({saveMoney:data.money});
         // _this.setData({'SchoolNumMsg':""});
         }else{
            app.alert(data.msg);
           // _this.setData({'SchoolNumMsg':data.msg});
         }
     });
   }else{
    //  _this.setData({'SchoolNumMsg':''});
   }
 },
 //使用学币
 yieNumber:function(e){
    var return_value = Number(e.detail.value);
    var yie=this.data.user_info.money;
    var goods_amount=this.data.data.price-this.data.school_money;
    if(yie<return_value){
        return_value=yie;
    }
    if(return_value>goods_amount){
      return_value=goods_amount;
    }
    goods_amount=goods_amount-return_value;
    this.setData({goods_amount:goods_amount});
    this.data.postData.yie=return_value;
    return {
      value:return_value
    }
 },
  //立刻报名
  formSubmit:function(e){
    var postData=e.detail.value;
    this.setData({'loading':1});
    this.setData({'disabled':1});
    var _this=this;
     app.getPageData("Subject/order",{subjectid:this.data.data.subjectid,school_num:this.data.postData.school_num,'yie':this.data.postData.yie},function(data){
         if(data.error==0){//生成订单去支付
            var url=data.msg;
            _this.topay(url);
         }else if(data.error==3){//支付成功
              wx.navigateTo({
                 url: '../subject/index',
             });
         }else{//支付失败
            app.alert(data.msg);
           //   _this.setData({'SchoolNumMsg':data.msg});
         }
         _this.setData({'loading':0});
         _this.setData({'disabled':0});
     });
  },
  //订单url生成支付签名
  topay:function(url){
     wx.showToast({
                title: '加载中...',
                icon: 'loading',
                duration: 10000
            });
      wx.request({
              url: url,
              data: {
                payment_id:44,
                openid:this.data.user_info.openid,
                from_wx_app:1,
              },
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              success: function(res){
                  var res2=res.data;
                  if(typeof(res2)=="object" && res2.error==0){//微信支付
                   var pay_param=res2.data;
                     wx.requestPayment({
                      'timeStamp': pay_param.timeStamp,
                      'nonceStr': pay_param.nonceStr,
                      'package': pay_param.package,
                      'signType': 'MD5',
                      'paySign': pay_param.paySign,
                      'success':function(res){//支付成功
                          wx.navigateTo({
                              url: '../subject/index',
                          });
                      },
                      'fail':function(res){
                            app.alert("支付失败");
                      }
                    })
                  }else{
                     app.alert(res.data);
                  }
              },
              fail: function() {
                 app.alert("支付请求发生错误");
              },
              complete: function(res) {
                 console.log(res);
                 wx.hideToast();
              }
            })
  }

})
