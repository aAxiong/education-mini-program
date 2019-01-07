const urlApi = require('../../utils/api.js');
const util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex: 0,
    name: '', //学生姓名
    tel: '', // 家长电话
    age: '', //学生年级
    address: '', // 详细地址
    loadngMsg: '请稍等',
    loadingFlag: false,
    region: ['广东省', '深圳市', '宝安区'], // 默认地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.kmShowToast = this.selectComponent("#kmShowToast")
    // this.kmShowToast.KMshowToast('弹窗', 1500)
  },
  changeSex(e) {
    this.setData({
      sex: e.currentTarget.dataset.index
    })
  },
  // 编辑框输入
  ChangeInputHander(e) {
    let _e = e.detail.value
    let _val = e.currentTarget.dataset.val
    this.setData({
      [_val]: _e
    })
  },
  bindRegionChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  save() {
    // 参与报名
    let reg = /^1[3|4|5|7|8][0-9]{9}$/
    if (this.data.name === '') {
      this.kmShowToast.KMshowToast('学生姓名不能为空', 1500)
      return
    } else if (this.data.tel === '') {
      this.kmShowToast.KMshowToast('家长电话不能为空', 1500)
      return
    } else if (this.data.age === '') {
      this.kmShowToast.KMshowToast('学生年纪不能为空', 1500)
      return
    } else if (this.data.address === '') {
      this.kmShowToast.KMshowToast('详细地址', 1500)
      return
    } else if (!reg.test(this.data.tel)) {
      this.kmShowToast.KMshowToast('请输入正确的手机号码', 1500)
      return
    }
    let item = {
      "age": this.data.sex, // 1是女  0是男
      "stuName": this.data.name,
      "phone": this.data.tel,
      "age": this.data.age,
      "address": this.data.region.join(',') + this.data.address
      //desc: this.data.region.join(',')
    }
    this.setData({
      loadingFlag: true
    })
    wx.request({
      url: urlApi.WXInsertStuApply,
      data: item,
      header: util.requestHeader(),
      method: 'post',
      success: (res) => {
        if (res.data.code == 200) {
          this.kmShowToast.KMshowToast('报名成功', 1500);
          this.setData({
            loadingFlag: false
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1300)
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

      },
      fail: (res) => {}
    })
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