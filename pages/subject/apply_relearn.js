//index.js
//获取应用实例
var app = getApp();
Page({
  onLoad: function (options) {
    var that = this;
    var subject_id=options.subject_id;
   // var where='subjectid'=>$subjectParentId,'type'=>'xuebazi','public'=>1
     app.getPageData("Subject/apply_relearn",{'subjectid':subject_id},function(data){
         that.setData(data);
     });
  },
 reply:function(){
      wx.showToast({
        title: '毕业之后，未完成学分的同学才能申请重学',
        icon: 'success',
        duration: 2000
        })
  }

})
