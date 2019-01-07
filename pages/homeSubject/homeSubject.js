const urlApi = require('../../utils/api.js');
const util = require('../../utils/util.js');
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    types: '',
    isShowPlaying: true,
    optionNum: 0, // 选择的答案
    allList: [], // 答题数据源
    IsRecord: 0, // 已答题数
    optionList: [{
      id: '0', // 题目id
      question: '你认为黑客是?', //问题
      number: 4, //第几题
      Total: 12,
      headerImg: '/images/head_img.png', //头像
      imagurl: '/images/defaultimg.png', //问题图片
      nowQuestion: 1, //当前第几题
      list: [{ //题目选项
        id: '1',
        opt: "A", //选项
        content: '计算机很厉害的人'
      }, {
        id: '2',
        opt: "B",
        content: '长得黑的人'
      }, {
        id: '3',
        opt: "C",
        content: '喜欢穿黑衣服的人'
      }],
      myAnswer: 'A', //我选择的答案
      PointAnswer: 'A', // 提示正确答案啊
      PointAnswerIndex: '0', //正确答案下标
      PointAnswerText: '', // 答案解读
      showAnswerInfo: false, // 是否显示答案
      // 评论列表
    }],
    IsShowFailModal: false, // 是否显示错误提示
    commentList: [],
    // commentList: [{ //评论数组
    //   id: 1, //id
    //   nickName: 'lzx', //评论者姓名
    //   avatar: 'https://dogs.xingjinkj.com/xlabweb//opt/uploadFiles/img/88f5e14b37ee4b6683243266755aa05c.png', //评论者头像
    //   videoUrl: 'https://dogs.xingjinkj.com/xlabweb//opt/uploadFiles/video/90f9b9d9475c45b3b8e074da5300651c.mp4,https://dogs.xingjinkj.com/xlabweb//opt/uploadFiles/video/90f9b9d9475c45b3b8e074da5300651c.mp4', //评论视频
    //   imgurl: 'https://dogs.xingjinkj.com/xlabweb//opt/uploadFiles/img/88f5e14b37ee4b6683243266755aa05c.png,https://dogs.xingjinkj.com/xlabweb//opt/uploadFiles/img/88f5e14b37ee4b6683243266755aa05c.png', //评论图片
    //   content: 'asdasdsa', //评论内容
    //   recoveryList: [{ //二级评论数组
    //     name: 'zzx', //二级评论者姓名
    //     content: '123' //二级评论者评论内容
    //   }]
    // }, { //评论数组
    //   id: 1, //id
    //   nickName: 'lzx', //评论者姓名
    //   avatar: 'https://dogs.xingjinkj.com/xlabweb//opt/uploadFiles/img/88f5e14b37ee4b6683243266755aa05c.png', //评论者头像
    //   videoUrl: 'https://dogs.xingjinkj.com/xlabweb//opt/uploadFiles/video/90f9b9d9475c45b3b8e074da5300651c.mp4,https://dogs.xingjinkj.com/xlabweb//opt/uploadFiles/video/90f9b9d9475c45b3b8e074da5300651c.mp4', //评论视频
    //   imgurl: 'https://dogs.xingjinkj.com/xlabweb//opt/uploadFiles/img/88f5e14b37ee4b6683243266755aa05c.png,https://dogs.xingjinkj.com/xlabweb//opt/uploadFiles/img/88f5e14b37ee4b6683243266755aa05c.png', //评论图片
    //   content: 'asdasdsa', //评论内容
    //   recoveryList: [{ //二级评论数组
    //     name: 'zzx', //二级评论者姓名
    //     content: '123' //二级评论者评论内容
    //   }]
    // }], //评论详情列表
    loadngMsg: '加载中',
    isCoverFlag: false,
    row: 10,
    totalPage: 1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.kmShowToast = this.selectComponent("#kmShowToast")
    this.id = options.id
    this.page = 1
    this.setData({
      isCoverFlag: true,
      types: options.type
    })
    if (options.type == 0) {
      wx.setNavigationBarTitle({
        title: '家庭作业'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '在线答题'
      })
    }
    this.getListInfo(options.id)
  },
  choseOpt(e) { //选项切换
    if (this.data.IsShowFailModal) {
      return
    }
    this.setData({
      optionNum: e.currentTarget.dataset.index
    })
    this.subAnswer()
  },
  jumpComment() { //跳转到评论
    // console.log(app.globalData.answerTitle)
    wx.navigateTo({
      url: '/pages/comment/comment?id=' + this.id
    })
  },
  subAnswer(str) { //提交答案
    if (this.data.optionNum < 0) {
      this.kmShowToast.KMshowToast('请选择答案', 1500)
      return
    }

    let types = this.data.types
    let list = this.data.optionList // 拿到当前题目对象
    let _answerId = list[0].list[this.data.optionNum].opt // 拿到当前回答的答案  答案为其中一个：'A', 'B','C'
    if (_answerId !== list[0].PointAnswer && str !== 'dump') {
      list[0].showAnswerInfo = true
      this.setData({
        IsShowFailModal: true,
        optionList: list
      })
      let _record = list[0].nowQuestion - 1
      let _data = this.data.allList
      _data[_record].xlabExamRecordDetail.myAnswer = _answerId
      this.setData({
        allList: _data
      })
      this.kmShowToast.KMshowToast('答案错误', 1500)
      wx.request({
        url: urlApi.WXInsertExamRecord + '/' + list[0].id,
        data: {
          answer: _answerId
        },
        header: util.requestHeader(),
        method: 'POST',
        success: (res) => {
          if (res.data.code == 200) {
            this.setData({
              IsRecord: res.data.data.totalRocord.currentQuestionNum
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
      return
    }
    this.setData({
      isCoverFlag: true
    })
    let _now = list[0].nowQuestion - 1
    let allList = this.data.allList
    allList[_now].xlabExamRecordDetail.myAnswer = _answerId
    this.setData({
      allList: allList,
    })
    wx.request({
      url: urlApi.WXInsertExamRecord + '/' + list[0].id,
      data: {
        answer: _answerId
      },
      header: util.requestHeader(),
      method: 'POST',
      success: (res) => {
        if (res.data.code == 200) {
          let data = res.data.data.totalRocord
          if (list[0].nowQuestion == list[0].Total) {
            wx.redirectTo({
              url: '/pages/finshHomeTask/finshHomeTask?type=' + types + '&id=' + list[0].id + '&num=' + data.correctQuestionNum + '&score=' + data.totalScore
            })
          } else {
            this.reserAnswerQuestion()
          }
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
  Lastquestion() { //上一题
    this.setData({
      isCoverFlag: true
    })
    this.reserAnswerQuestion('del')
  },

  getListInfo: function(id) {
    wx.request({
      url: urlApi.WXQueryExamQuestions + '/' + id,
      header: util.requestHeader(),
      method: 'POST',
      success: (res) => {
        if (res.data.code == 200) {
          let _record = res.data.data.record // res.data.data.record || 0 // 当前答题数
          let _data = res.data.data.questions // 返回来的数据
          this.setData({
            allList: _data,
            optionList: [{
              nowQuestion: _record
            }],
            IsRecord: _record // 已答题数
          })
          if (_record === _data.length) {
            this.kmShowToast.KMshowToast('当前题目已经答完', 1500)
            this.setData({
              isCoverFlag: false
            })
            return
          }
          this.reserAnswerQuestion()
          this.getCommentListInfo(this.id, "");
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
  getCommentListInfo(id, detailId) { //加载评论详情
    let _commentList = this.data.commentList
    wx.request({
      url: urlApi.WXQueryQuestionCommentByPage,
      data: {
        "examQeustionId": id,
        "pageIndex": this.page,
        "pageRow": this.data.row,
        "type": 2
      },
      header: util.requestHeader(),
      method: 'POST',
      success: (res) => {
        this.setData({
          isCoverFlag: false
        })
        if (res.data.code == 200) {
          let commentList = res.data.data.results
          for (var i = 0; i < commentList.length; i++) {
            commentList[i].imgurl = commentList[i].imgUrl && commentList[i].imgUrl.split(',')
            commentList[i].videoUrl = commentList[i].videoUrl && commentList[i].videoUrl.split(',')
          }
          _commentList.push(...commentList)
          this.setData({
            totalPage: res.data.data.totalPage,
            // commentList: res.data.data.commentList, //数据源
            commentList: _commentList, //数据源
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
  reserAnswerQuestion(tp) {
    let list = this.data.optionList // 拿到当前题目对象
    let _record = list[0].nowQuestion - 1
    if (!tp) {
      _record++
    } else {
      _record--
    }
    let _data = this.data.allList
    if (_data.length === 0) {
      return
    }
    let _PointAnswer = _data[_record].correctAnswer.toUpperCase()
    let optionList = [{
      id: _data[_record].id, // 题目id
      question: _data[_record].questionName, //问题
      number: _record + 1, //第几题
      Total: _data.length, // 总题目数
      headerImg: app.globalData.userInfo.avatarUrl, //头像
      imagurl: _data[_record].questionImageUrl, //问题图片
      nowQuestion: _record + 1, //当前第几题
      score: _data[_record].score, //当前题目分数
      list: [],
      myAnswer: _data[_record].xlabExamRecordDetail.myAnswer && _data[_record].xlabExamRecordDetail.myAnswer.toUpperCase(), // 我选择的答案
      PointAnswer: _PointAnswer, // 正确答案啊
      PointAnswerText: _data[_record].answerPoint,
      PointAnswerIndex: _PointAnswer === 'A' ? 0 : (_PointAnswer === 'B' ? 1 : _PointAnswer === 'C' ? 2 : _PointAnswer === 'D' ? 3 : ''), // 正确答案下标
      showAnswerInfo: false
    }]
    if (_data[_record].answerA) {
      optionList[0].list.push({ //题目选项
        id: '1',
        opt: "A", //选项
        content: _data[_record].answerA
      })
    }
    if (_data[_record].answerB) {
      optionList[0].list.push({
        id: '2',
        opt: "B",
        content: _data[_record].answerB
      })
    }
    if (_data[_record].answerC) {
      optionList[0].list.push({
        id: '3',
        opt: "C",
        content: _data[_record].answerC
      })
    }
    if (_data[_record].answerD) {
      optionList[0].list.push({
        id: '4',
        opt: "D",
        content: _data[_record].answerD
      })
    }

    // 已答题 1  当前 1
    if (tp || this.data.IsRecord > _record) {
      optionList[0].showAnswerInfo = true
      this.setData({
        IsShowFailModal: true,
        isCoverFlag: false,
        optionList: optionList,
        optionNum: optionList[0].myAnswer === 'A' ? 0 : (optionList[0].myAnswer === 'B' ? 1 : optionList[0].myAnswer === 'C' ? 2 : optionList[0].myAnswer === 'D' ? 3 : '')
      })
    } else {
      optionList[0].showAnswerInfo = false
      this.setData({
        IsShowFailModal: false,
        isCoverFlag: false,
        optionList: optionList,
        optionNum: -1
      })
    }
  },
  //视频播放事件
  videoTap(e) {
    this.videoContext = wx.createVideoContext(e.currentTarget.id, this)
    this.videoContext.requestFullScreen()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.page >= this.data.totalPage) {
      return
    }
    this.setData({
      isCoverFlag: true
    })
    this.page++;
    this.getCommentListInfo(this.id, '');
  },
  // 下一题
  nextOptionList() {
    this.subAnswer('dump')
  },
  // 提示答案
  showAnswerInfoHandle() {
    let _optionList = this.data.optionList
    _optionList[0].showAnswerInfo = true
    this.setData({
      optionList: _optionList
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