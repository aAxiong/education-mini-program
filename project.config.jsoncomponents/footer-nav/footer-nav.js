const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    active: 'index'
  },
  attached() {},
  ready() {
    wx.getStorage({
      key: 'pageNumber',
      success: (e) => {
        this.setData({
          active: e.data
        })
      }
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _goPage(e) {
      let _page = e.currentTarget.dataset.topage
      if (this.data.active === _page) return
      wx.setStorage({
        key: 'pageNumber',
        data: _page,
        success: () => {
          wx.switchTab({
            url: `/pages/${_page}/${_page}`,
          })
        }
      })
    }
  },


})