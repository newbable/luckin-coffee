class Ajax{
  get(url){
    wx.showLoading({
      title: 'loading...',
      mask: true,
    })
    return new Promise((resolve,reject)=>{
      wx.request({
        url,
        data: '',
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {
          resolve(res)
        },
        fail: function(res) {
          reject(res)
        },
        complete: function(res) {
          wx.hideLoading()
        },
      })
    })
  }
}
export default new Ajax()