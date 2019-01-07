const app = getApp()
const urlApi = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '', // 答题id或者订单id
    _tp: '', // 类型
    loadngMsg: '加载中',
    isCoverFlag: false,
    imgUrls: [], // 图片list
    maxLength: 3,
    carShow: false,
    animationData: {},
    Proportion: '',
    remark: '',
    videoUrl: [], // 视频list
    showList: []
    // showList: [{
    //   type: 'video',
    //   src: 'https://dogs.xingjinkj.com/xlab/uploadFiles/6dd696a24c914aa2bbb144625feae6f5.mp4'
    // }], //前端展示的数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.kmShowToast = this.selectComponent("#kmShowToast")
    // this.kmShowToast.KMshowToast('弹窗', 1500)
    if (options.id) {
      this.setData({
        id: options.id,
        _tp: options.type
      })
    }
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          Proportion: res.windowWidth / 750,
        })
      },
    })
  },
  // 删除当前图片
  delelteFn(e) {
    console.log(1)
    let _e = e.currentTarget.dataset.ind
    let _showList = this.data.showList
    _showList.splice(_e, 1)
    this.setData({
      showList: _showList
    })
  },
  // 打开选择框
  showAddModal() {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: "ease",
      delay: 0,
      transformOrigin: "50% 50%",
    })
    this.setData({
      carShow: true
    })
    animation.translate(0, -(this.data.Proportion) * 406).step();

    this.setData({
      animationData: animation.export(),
    })
  },
  // 关闭选择框
  closeShopCar: function() {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: "ease",
      delay: 0,
      transformOrigin: "50% 50%",
    })
    animation.translate(0, 0).step();
    this.setData({
      carShow: false,
      animationData: animation.export()
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
  // 录视频
  addVideo(e) {
    let that = this
    wx.chooseVideo({
      sourceType: ['camera'],
      maxDuration: 60,
      camera: 'back',
      success(res) {
        // 当前视频数据
        console.log(res.tempFilePath)
        that.setData({
          isCoverFlag: true
        })
        wx.uploadFile({
          url: urlApi.WXUploadFile, //仅为示例，非真实的接口地址
          filePath: res.tempFilePath,
          header: util.requestHeader(),
          name: 'file',
          formData: {},
          success: function(res) {
            var data = JSON.parse(res.data)
            if (data.code == '200') {
              var pathImg = data.data.server + data.data.path;
              let _li = that.data.videoUrl
              _li.push(pathImg)
              let _showList = that.data.showList
              _showList.push({
                type: 'video',
                src: res.tempFilePath
              })
              that.setData({
                videoUrl: _li,
                showList: _showList,
                isCoverFlag: false,
              })
              that.closeShopCar()
            }
          }
        })

      }
    })
  },
  //我的相册
  addPhoto(e) {

    let _tp = e.currentTarget.dataset.tp
    // 'album', 'camera'
    let that = this
    wx.chooseImage({
      count: this.data.maxLength - this.data.showList.length, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: [_tp], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        that.setData({
          isCoverFlag: true
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths[0])
        wx.uploadFile({
          url: urlApi.WXUploadFile, //仅为示例，非真实的接口地址   urlApi.WXUploadFile
          filePath: tempFilePaths[0],
          header: util.requestHeader(),
          name: 'file',
          formData: {},
          success: function(res) {
            var data = JSON.parse(res.data)
            if (data.code == '200') {
              var pathImg = data.data.server + data.data.path;
              let _li = that.data.imgUrls
              _li.push(pathImg)
              let _showList = that.data.showList
              _showList.push({
                type: 'image',
                src: tempFilePaths
              })
              that.setData({
                imgUrls: _li,
                showList: _showList,
                isCoverFlag: false,
              })
              that.closeShopCar()
            }
          }
        })
      }
    });
  },
  // 保存
  save() {
    if (this.data.remark.trim() === '') {
      this.kmShowToast.KMshowToast('评论内容不能为空', 1500)
      return
    }
    let _url = '' // 当前请求的url
    var comment = {};
    comment.content = this.data.remark //文字内容
    comment.imgUrl = this.data.imgUrls.join(','); //多个图片用逗号隔开传一个字符串
    comment.videoUrl = this.data.videoUrl.join(',') //视频路径 同上
    if (this.data._tp === 'goods') {
      // 商品
      comment.type = 1 //类型ID 默认为1
      comment.goodId = this.data.id //商品Id
      comment.goodDetailId = '' //课程节id
      comment.goodDetailName = '' //课程节名称
    } else {
      // 答题
      comment.type = 2 //类型ID 默认为1
      comment.examQuestionId = this.data.id
      comment.questionName = app.globalData.answerTitle
    }
    this.setData({
      isCoverFlag: true
    })
    wx.request({
      url: urlApi.WXInsertUserComment,
      data: comment,
      header: util.requestHeader(),
      method: 'post',
      success: (res) => {
        this.setData({
          isCoverFlag: false
        })
        if (res.data.code == 200) {
          this.kmShowToast.KMshowToast('评论成功', 1500);
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
            // wx.redirectTo({
            //   url: '/pages/comment-success/comment-success?id=' + this.data.id + '&type=' + this.data._tp,
            // })
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