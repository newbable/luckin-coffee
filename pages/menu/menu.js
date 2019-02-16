// pages/menu/menu.js
import ajax from '../../utils/ajax.js'
const app=getApp()
// console.log(app)
Page({
  choosePosition(){
    wx.chooseLocation({
      success: (res)=> {
        console.log(res)
        const {latitude,longitude}=res
        const R = 6371.004
        const lat1 = (Math.PI / 180) * this.data.currLatitude
        const lat2 = (Math.PI / 180) * latitude

        const lon1 = (Math.PI / 180) * this.data.currLongitude
        const lon2 = (Math.PI / 180) * longitude
        const d = Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)) * R;
        const newDistance = (d * 1000).toString().slice(0, 5) + 'm'
        this.setData({
          distance: newDistance
        })
        
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  changeIndicatorDots(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange(e) {
    this.setData({
      duration: e.detail.value
    })
  },
  changeCate(e){
    // console.log(e)
    this.setData({
      currCate:e.target.dataset.tabid,
      scrolltop:0,
    },()=>{
      this.fetchWaresList()
    })
  },
  start:0,
  fetchWaresList(isLoadMore=false){
    const { currCate}=this.data
    ajax.get(`http://www.xiongmaoyouxuan.com/api/tab/${currCate}?start=${this.start}`)
      .then(resp=>{
        const type = resp.data.data.items.list.filter(item => item.type === 1)
        this.start=resp.data.data.items.nextIndex
        const menuList = isLoadMore === true ? this.data.menuList.concat(type) : type
        // console.log(menuList)
        this.setData({
          menuList,
          isEnd:resp.data.data.items.isEnd,
        })
      })
  },
  loadMore(){
    this.fetchWaresList(true)
  },

  handleShowModal(e) {
    // console.log(e)
    this.setData({
      showModal: true,
      amount:1
    })
    const { id, currwareimg, currwaretitle, currwareprice } = e.target.dataset
    this.setData({
      currWareId:id,
      currWarImg:currwareimg,
      currWareTitle:currwaretitle,
      currWarePrice:currwareprice
    })
  },

  preventTouchMove() {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal() {
    setTimeout(()=>{
      this.setData({
        showModal: false
      });
    },400)
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel() {
    this.hideModal();
  },
  handleChoose(e){
    // console.log(e)
    this.setData({
      option:e.target.dataset.option,
      select: e.target.dataset.select,
      isChoosed:!this.data.isChoosed
    })
  },
  handleReduce(){
    const {amount}=this.data
    let newAmount=parseInt(amount)-1
    if(newAmount>1){
      this.setData({
        amount: newAmount
      })
    }else{
      this.setData({
        amount:1
      })
    }
  },
  handleAdd(){
    const { amount } = this.data
    let newAmount = amount + 1
    if (newAmount <= 99) {
      this.setData({
        amount: newAmount
      })
    } else {
      this.setData({
        amount: "99+"
      })
    }
  },
  addToCart(e){
    let cart = wx.getStorageSync('store') ? JSON.parse(wx.getStorageSync('store')) : []
    const isInCart = cart.some(item => item.id === this.data.currWareId)
    if (isInCart) {
      cart = cart.map(item => {
        if (item.id ===this.data.currWareId) {
          item.count+=parseInt(this.data.amount)
        }
        return item
      })
    } else {
      cart.push({
        id:this.data.currWareId,
        count:this.data.amount
      })
    }
    wx.setStorageSync('store', JSON.stringify(cart))
    app.setBadge()
    wx.showToast({
      title: '成功加入购物车',
      icon: 'success',
      image: '',
      duration: 1500,
      mask: true,
      success: (res)=> {
        this.hideModal()
      },
        fail: function(res) {},
        complete: function(res) {},
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    isPositionCompleted:false,
    currentCity:'',
    currentDistrict:'',
    distance:'200m',
    currLatitude:'',
    currLongitude:'',
    cateList:[],
    currCate:1,
    menuList:[],
    isEnd:false,
    scrolltop:0,
    showModal:false,
    isChoosed:false,
    option:'0',
    select:'2',
    amount:1,
    currWareId:'',
    currWarImg:'',
    currWareTitle:'',
    currWarePrice:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.getLocation({
      type: 'wgs84',
      altitude: true,
      success: (res)=> {
        const{ latitude, longitude}=res
        ajax.get(`https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=JE2BZ-EM3L4-IZMUI-DYPKJ-BXJ6F-2OBJ7&get_poi=1`)
        .then(resp=>{
          // console.log(resp)
          this.setData({
            currentCity:resp.data.result.address_component.city,
            currentDistrict: resp.data.result.address_component.district,
            currLatitude: resp.data.result.location.lat,
            currLongitude: resp.data.result.location.lng
          })
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    ajax.get(`http://www.xiongmaoyouxuan.com/api/tab/1?start=0`)
      .then(resp=>{
        // console.log(resp)
        this.setData({
          imgUrls:resp.data.data.banners
        })
      })
    ajax.get(`http://www.xiongmaoyouxuan.com/api/tabs?sa=`)
      .then(resp=>{
        // console.log(resp)
        this.setData({
          cateList:resp.data.data.list,
          currCate:resp.data.data.list[0].id
        },()=>{
          this.fetchWaresList()
        })
      })
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