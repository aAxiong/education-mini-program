const urlApi = require('../../utils/api.js');
const util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rows: 10, // 每页条目
    totalPage: 0, //总页数
    loadngMsg: '加载中',
    isCoverFlag: false,
    isFromOrder: false, // 是否从确定订单过来
    // addressList: [{
    //   id: 1, // 地址id
    //   name: '周晓', // 名字
    //   sex: 0, // 0 女性  1 男性
    //   desc: '南山南海大道1057号科技大厦二期', // 详细地址
    //   tel: 13682473985, // 电话
    //   area: '广东省深圳市南山区', // 区域
    //   num: 0, //是否默认 num为0则为默认
    // }]
    addressList: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      isFromOrder: options.type === 'fromOrder' ? true : false
    })
    this.page = 1
    this.getList()
  },
  onShow() {
    wx.getStorage({
      // 如果新增了地址或者修改了地址，则重新请求数据
      key: 'updateAddress',
      success: (res) => {
        wx.removeStorage({
          key: 'updateAddress',
          success(res) {
            console.log(res.data)
          }
        })
        this.page = 1;
        this.setData({
          addressList: [],
          isCoverFlag: true
        })
        this.getList()
      }
    })
  },
  // 修改地址
  updateHandle(e) {
    let _ind = e.currentTarget.dataset.ind
    app.globalData.addressItem = this.data.addressList[_ind]
    wx.navigateTo({
      url: '/pages/edit-address/edit-address'
    })
  },
  // 获取数据
  getList() {
    wx.request({
      url: urlApi.WXAddressList,
      data: {
        "pageIndex": this.page,
        "pageRow": this.data.rows
      },
      header: util.requestHeader(),
      method: 'post',
      success: (res) => {
        if (res.data.code == 200) {
          var results = res.data.data.results;
          var addressList = [];
          if (results.length > 0) {
            for (var i = 0; i < results.length; i++) {
              var address = {};
              address.id = results[i].id;
              address.name = results[i].name;
              address.sex = results[i].sex; //// 0 女性  1 男性
              address.address = results[i].address;
              address.mobile = results[i].mobile; //收货地址手机号码
              address.area = results[i].area; //区域
              address.num = results[i].isDefault; //是否默认
              addressList.push(address);
            }
          }
          this.setData({
            totalPage: res.data.data.totalPage, // 总页数
            addressList: addressList, //数据源
            isCoverFlag: false
          })
        } else {
          if (res.data.code == 403) {
            util.resetSessionId();
            return;
          }
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success: function(r) {
              console.log(r);
            }
          });
        }

      }
    })
  },
  // 确定订单过来选择地址
  chooseAddress(e) {
    let _ind = e.currentTarget.dataset.ind
    app.globalData.addressItem = this.data.addressList[_ind]
    if (this.data.isFromOrder) {
      wx.navigateBack({
        delta: 1
      })
    }
  },
  // 上拉加载更多
  onReachBottom() {
    if (this.page >= this.data.totalPage) {
      return
    }
    this.setData({
      isCoverFlag: true
    })
    this.page++;
    this.getListInfo()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '艾克斯科学实验室',
      desc: '最具人气的小程序!',
      path: '/pages/index/index',
      imageUrl: '/images/sharPt.png'
    }
  }

})