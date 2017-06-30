//logs.js
var app = getApp();
Page({
  data: {
    logs: [],
    listData:[],
  },
  onLoad: function (options) {
    //问题详情
     var that = this;
    that.setData({id:options.topic_id});
     app.getPageData("Group/topic",{id:options.topic_id},function(data){
         that.setData(data);
    });
    //评论列表
    app.getPageData("BoxApi/Sns/comment",{topic_id:options.topic_id,'type':"eduAsk"},function(data){
        if(data){
          that.setData({listData:data['list']});
        }      
    });
  },
//回答
  reply:function(){
    this.setData({'popup':1});
    this.setData({'to_comment_id':0});
    this.setData({'reply':{value:'',placeholder:'请输入你的答案答案...'}})
  },
 //回复
  to_reply:function(event){
    var to_comment_id=event.target.dataset.comment_id;
    var to_nickname=event.target.dataset.nickname;
    this.setData({'popup':1});
    this.setData({'to_comment_id':to_comment_id});
    this.setData({'reply':{value:'',placeholder:'@'+to_nickname}})
  },
 //删除
 del_comment:function(event){
  var that = this;
  var idx=event.target.dataset.key;
  var comment_id=event.target.dataset.comment_id;
  wx.showModal({
  title: '提示',
  content: '确认删除吗？',
  success: function(res) {
        if (res.confirm) {
          //删除评论
          app.getPageData("BoxSns/Home/Index/del_comment",{comment_id:comment_id},function(data){
             //删了出错
              if(data.error>0){
                  wx.showToast({
                    title: data.msg,
                    icon: 'success',
                    duration: 2000
                  });
              }else{
                  wx.showToast({
                    title: '操作成功',
                    icon: 'success',
                    duration: 2000
                  })
                  var listData=that.data.listData;
                  listData[idx]['none']=1;
                  that.setData({listData:listData});
              }      
          });   
        }
       }
  })
 },

  //取消
  btn_cancel:function(){
     this.setData({'popup':0});
  },
  //提交
  formSubmit:function(e){
    var postData=e.detail.value;
    if(postData.content==""){
      wx.showToast({
        title: '回复答案不能为空',
        icon: 'success',
        duration: 2000
      })
     return false; 
    }
    this.setData({'loading':1});
    this.setData({'disabled':1});
    var _this=this;
    //提交回答
    app.postData("BoxSns/Home/Index/do_comment",{to_comment_id:this.data.to_comment_id,pid:this.data.id,content:postData.content,type:'eduAsk'},function(data){
      _this.setData({'loading':0});
      _this.setData({'disabled':0});
      var title="";
      if(data.error==0){
          title="提交成功"
          _this.setData({'popup':0});
           var listData=_this.data.listData;
           var len=listData.length;
           data.msg['del_act']=1;
           listData[len]=data.msg;
           console.log(listData);
           _this.setData({listData:listData});
      }else{
          title=data.msg;
      }
      wx.showToast({
        title: title,
        icon: 'success',
        duration: 2000
      })
    })
    console.log(e);
  },
   //浏览图片
  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.data.imageList
    })
  },

})
