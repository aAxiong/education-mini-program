// project.config.jsoncomponents/comfirm/comfirm.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '是否删除该信息'
    },
    cancalText: {
      type: String,
      value: '取消'
    },
    sureText: {
      type: String,
      value: '确定'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    showFlag: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancalHandler() {
      this.triggerEvent('cancelFn')
    },
    sureHandler() {
      this.triggerEvent('surelFn')
    },
    show() {
      this.setData({
        showFlag: true
      })
    },
    hide() {
      this.setData({
        showFlag: false
      })
    }
  }
})