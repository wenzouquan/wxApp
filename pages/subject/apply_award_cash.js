//index.js
//获取应用实例
var app = getApp();
Page({
  onLoad: function (options) {
    var that = this;
    var subject_id=options.subject_id;
   // var where='subjectid'=>$subjectParentId,'type'=>'xuebazi','public'=>1
     app.getPageData("Subject/apply_award_cash",{'subjectid':subject_id},function(data){
         that.setData(data);
     });
  },
  reply:function(){
      wx.showToast({
        title: '您还未达到申请奖学金的标准',
        icon: 'success',
        duration: 2000
        })
  }
})
