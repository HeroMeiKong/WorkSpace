// component/newsList/newsList.js
const app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // newList: {
        //     type: Array,
        //     value: [
        //         {
        //             bigImgUrl: 'https://alipic.lanhuapp.com/SketchSlicePngbbfdef7a37828f247d88bff1772fbd7f'
        //         },
        //         {
        //             bigImgUrl: 'https://alipic.lanhuapp.com/SketchSlicePngbbfdef7a37828f247d88bff1772fbd7f',
        //             Title: '商务部澄清：有关“美方取消与中方经贸磋商”报道不实'
        //         },
        //         {
        //             bigImgUrl: 'https://alipic.lanhuapp.com/SketchSlicePngbbfdef7a37828f247d88bff1772fbd7f',
        //             Title: '商务部澄清：有关“美方取消与中方经贸磋商”报道不实商务部澄清：有关“美方取消与中方经贸磋商”报道不实商务部澄清：有关“美方取消与中方经贸磋商”报道不实'
        //         }
        //     ],
        // },
    },

    /**
     * 组件的初始数据
     */
    data: {
        newList:[]
    },

    lifetimes: {
        attached() {
            console.log(app.globalData);
            wx.showLoading({
                title: '加载中...'
            });
            let currSite = app.globalData.currSite;
            if (!currSite){
                wx.showToast({
                  title: '系统繁忙...'
                });
                wx.hideLoading();
                return
            }
            let currSiteList=[];
            /*获取数据*/
            wx.request({
                url:"https://app.cctv.com/2019car/list/index.json",
                success:res=>{
                    let newsList = res.data.data.itemList;
                    // console.log(newsList)
                    // console.log(currSite)
                    for (let i in newsList){
                        if (currSite===newsList[i].site){
                            // console.log(newsList[i])
                            // newsList.bigImgUrl.replace('http://','https://')
                            wx.hideLoading();
                            currSiteList.push(newsList[i])
                        }
                    }
                    // console.log(currSiteList);
                    this.setData({
                        newList:currSiteList
                    })
                }
            })
            setTimeout(function () {
                wx.hideLoading()
            },5000)
        },
        detached() {
            // 在组件实例被从页面节点树移除时执行
        },
    },
    /**
     * 组件的方法列表
     */
    methods: {
        // 前往资讯页
        goDetail(event) {
            let Url = event.currentTarget.dataset.id;
            let listUrl = Url.replace('http:','https:')
            // console.log(listUrl)
            // wx.setStorageSync('webview_src', listUrl);
            wx.navigateTo({
                url: '/pages/webview/webview?listUrl='+listUrl
            })
        }
    },

})
