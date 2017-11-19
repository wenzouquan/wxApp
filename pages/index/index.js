//index.js
//获取应用实例
var app = getApp();
//console.log(app.globalData);
Page({
  data: {
    userInfo: {},
    markers: [
    ]
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  //事件处理函数
  bindViewTap: function() {
  },
  //跳到用户中心
  jumpUser:function(){
    wx.navigateTo({
      url: '../user/index'
    })
  },
  //跳转到发布
  jumpIssue:function(){
    wx.navigateTo({
      url: '../index/issue'
    })
  },

  // onLoad: function () {
  //   var that = this;
  //   console.log(this.data);
  // },
  onLoad:function(e){
    var that = this;
    app.getLocation(function (res) {
        wx.setStorageSync("userLocation", res);
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        });
        that.addMarkers();
    });
    
    
  },

  // onReady: function (e) {
  //   var userLocation = wx.getStorageSync("userLocation");
  //   this.data.longitude = userLocation.latitude;
  //   this.data.latitude = userLocation.longitude;
  //   console.log(userLocation);
  //   this.setData({
  //     longitude: this.data.longitude,
  //     latitude: this.data.latitude
  //   });
  //   // 使用 wx.createMapContext 获取 map 上下文
  //   this.mapCtx = wx.createMapContext('map');
  //   this.mapCtx.moveToLocation();
  //  // console.log(this.mapCtx);
  //  // this.includePoints();
  //   this.translateMarker();
  // },
  // translateMarker: function () {
  //   this.mapCtx.translateMarker({
  //     markerId: 0,
  //     autoRotate: true,
  //     duration: 1000,
  //     destination: {
  //       latitude: this.data.latitude,
  //       longitude: this.data.longitude,
  //     },
  //     animationEnd() {
  //       console.log('animation end')
  //     }
  //   })
  // },
  addMarkers(){
    var marker = {
      iconPath: "/image/pin.png",
      id: 0,
      latitude: app.globalData.userLocation.latitude,
      longitude: app.globalData.userLocation.longitude,
      width: 45,
      height: 45
    };
    this.data.markers.push(marker);
    this.setData({
      markers: this.data.markers
    });
  },
  // includePoints: function () {
  //   var userLocation = wx.getStorageSync("userLocation");
  //   this.mapCtx.includePoints({
  //     padding: [10],
  //     points: [{
  //       iconPath: "/image/pin.png",
  //       latitude: userLocation.latitude,
  //       longitude: userLocation.longitude,
  //     }]
  //   })
  // }
  
})
