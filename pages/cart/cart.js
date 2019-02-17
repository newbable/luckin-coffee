// pages/cart/cart.js
import ajax from '../../utils/ajax.js'
const app=getApp()
Page({
  // 改变选中框的选中状态
  checkboxChange(e) {
    // console.log(e)
    let carts = this.data.cartList
    const {id,count,price,checked}=e.target.dataset
    carts=carts.map(item=>{
      if (item.id === e.target.dataset.id){
        item.checked=!item.checked
        console.log(item.checked)
      }
      return item
    })
    const hasSelect=carts.some(item=>item.checked===true)
    if(hasSelect){
      this.setData({
        selectWare:true
      })
    }else{
      this.setData({
        selectWare:false
      })
    }
    this.calcaulateTotalPrice()
  },
  // 计算选中商品的总价
  calcaulateTotalPrice() {
    let carts = this.data.cartList
    let total = 0
    for (let i = 0; i < carts.length; i++) {
      if (carts[i].checked) {
        total += carts[i].count * carts[i].price
      }
    }
    this.setData({
      cartList: carts,
      totalPrice: total.toFixed(2)
    })
  },
  // 进入购物车页面通过商品ID重新请求数据
  cart:[],
  fetchCartList(){
    const requests = this.cart.map(item => {
      return ajax.get(`http://www.xiongmaoyouxuan.com/api/detail?id=${item.id}&normal=1&sa=`)
    })
    Promise.all(requests)
      .then(resp => {
        const cartList = resp.map((item,index) => {
          const {
            id,
            price,
            title,
            count
          } = item.data.data.detail
          return {
            id,
            price,
            title,
            count: this.cart[index].count,
            checked:this.data.checked
          }
        })
        this.setData({
          cartList
        })
        // console.log(this.data.cartList)
      })
  },
  // 点击按钮减少商品数量
  handleDecrease(e){
    const index = e.target.dataset.index
    let carts = this.data.cartList
    // 先改变storage中状态
    let current = this.cart[index]
    if(current.count>1){
      current.count-=1
    }else{
      current.count=1
      // wx.showModal({
      //   title: '删除商品',
      //   content: carts[index].title,
      //   showCancel: true,
      //   cancelText: '取消',
      //   cancelColor: '#09f',
      //   confirmText: '删除',
      //   confirmColor: '#f00',
      //   success:(res)=>{
      //     if(res.confirm){
      //       console.log('confirm')
      //       current.count=0
      //       wx.setStorageSync('store', JSON.stringify(this.cart))
      //       console.log(this.cart)
      //       this.cart=this.cart.filter(item=>item.count!==0)
      //       carts=carts.filter(item=>item.count!==0)
      //       this.setData({
      //         cartList: carts
      //       })
      //     }else if(res.cancel){
      //       console.log('cancel')
      //     }
      //   },
      // })
    }
    wx.setStorageSync('store', JSON.stringify(this.cart))
    // this.cart.map(item=>{
    //   if(e.target.dataset.id===item.id){
    //     if(item.count>1){
    //       item.count -= 1
    //     }else{
    //       item.count = 1
    //     }
    //   }
    // })
    // wx.setStorageSync('store', JSON.stringify(this.cart))
    // 改变页面数据渲染
    // 通过当前下标的元素的数量设置为storage中当前下标的元素的count
    carts[index].count=this.cart[index].count
    this.setData({
      cartList:carts
    })
    app.setBadge()
    this.calcaulateTotalPrice()
  },
  // 点击按钮增加商品数量
  handleIncrease(e){
    const index = e.target.dataset.index
    let carts = this.data.cartList
    this.cart.map(item => {
      if (e.target.dataset.id === item.id) {
        item.count += 1
      }
    })
    wx.setStorageSync('store', JSON.stringify(this.cart))
    carts[index].count = this.cart[index].count
    this.setData({
      cartList: carts
    })
    app.setBadge()
    this.calcaulateTotalPrice()
  },
  /**
   * 页面的初始数据
   */
  data: {
    cartList:[],
    totalPrice:0,
    checked:false,
    selectWare:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.cart = wx.getStorageSync('store') ? JSON.parse(wx.getStorageSync('store')) : []
    console.log(this.cart)
    if (this.cart.length) {
      this.fetchCartList()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})