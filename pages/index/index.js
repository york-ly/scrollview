//index.js
//获取应用实例
const app = getApp()
var sub = require("../../utils/subjects.js");
var count = 4
var start = 0;

Page({
    data: {
        movies: [],
        scrollTop: 0,
        height: 0,
        total:0
    },
    onLoad: function () {
        // 这里要注意，微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    height: res.windowHeight
                })
            }
        })
        this.loadMore();
    },
    onShow:function(){

    },
    onReady:function(){

    },

    scroll: function (e) {
        //该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
        this.setData({
            scrollTop: e.detail.scrollTop
        });
    },
    //页面滑动到底部
    loading: function () {
        start +=4
        if(start<=this.data.total){
            wx.showToast({
                title: '加载更多',
                icon:"loading",
                duration:10000
            })
            this.loadMore();
        }else{
            wx.showToast({
                title: '没有更多了',
                icon:"none",
                duration:1000
            })
        }

    },

    refresh: function () {
        start = 0;
        wx.showNavigationBarLoading();
        //   该方法绑定了页面滑动到顶部的事件，然后做上拉刷新
        this.loadMore();
    },

    // 可以把上拉和下拉放到一个函数中。关键就是对请求到数组的处理，请求数据
    loadMore: function () {;
        var page = this

        wx.request({
            url: "https://douban.uieee.com/v2/movie/in_theaters?count="+count+"&start="+start,
            header:{"content-type":"json"},
            data: {},
            success: function (res) {
                page.setData({total:res.data.total})
                if(start==0){
                    page.setData({movies:new Array()})
                }
                var subjects = page.data.movies;
                for (var i = 0; i < res.data.subjects.length; i++) {
                    subjects.push(res.data.subjects[i]);
                }
                sub.processSubjects(subjects)
                page.setData({movies:subjects})


                /*var subjects = res.data.subjects;
                sub.processSubjects(subjects)
                page.setData({movies:page.data.movies.concat(subjects)})
                这样写也是可以的
                */
            },
            complete:function(){
                wx.hideNavigationBarLoading();
                wx.hideToast()
            }
        })
    }

})