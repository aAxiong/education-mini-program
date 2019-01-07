// components/showToastComponents/showToastComponents.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
	  showToastFLag:false,
	  showToastMsg:'这是展示的内容'
  },

  /**
   * 组件的方法列表
   */
  methods: {
		KMshowToast:function(msg,time){
			if(!msg){
				return;
			};
      if (!time){
        time=2000;
      };
			this.setData({
				showToastMsg: msg,
				showToastFLag:true
			});
			setTimeout(()=>{
				this.setData({
					showToastFLag: false
				});
			}, time);
		}
  },
})
