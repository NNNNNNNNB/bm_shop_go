<template>
    <view class="user">
        <!-- 用户信息 start -->
        <view class="user-info">
            <!-- 已登录 -->
            <view class="user-already-logged" v-if="userInfo.avatarUrl">
                <image :src="userInfo.avatarUrl" mode="scaleToFill" class="bg-image"/>
                <image :src="userInfo.avatarUrl" mode="scaleToFill" class="small-image"/>
                <view class="user-name">{{userInfo.nickName}}</view>
            </view>

            <!-- 未登录 -->
            <view class="user-not-logged" v-else>
                <button class="login-btn" type="warn" size="mini" open-type="getUserInfo" @getuserinfo="login">登录
                </button>
            </view>
        </view>
        <!-- 用户信息 end -->

        <!-- 用户内容 start -->
        <view class="user-content">
            <!-- 收藏和关注 -->
            <view class="collection-concerns">
                <view class="collection-shop collection-concerns-item" @click="gotoCollect(2)">
                    <view class="shop-number number-item">0</view>
                    <view class="shop-text text-item">收藏的店铺</view>
                </view>
                <view class="collection-goods collection-concerns-item" @click="gotoCollect(0)">
                    <view class="goods-number number-item">{{collectGoodsArr.length}}</view>
                    <view class="goods-text text-item">收藏的商品</view>
                </view>
                <view class="concerns-goods collection-concerns-item">
                    <view class="shop-number number-item">0</view>
                    <view class="shop-text text-item">关注的商品</view>
                </view>
                <view class="my-footprint collection-concerns-item" @click="gotoCollect(3)">
                    <view class="shop-number number-item">0</view>
                    <view class="shop-text text-item">我的足迹</view>
                </view>
            </view>

            <!-- 我的订单 -->
            <view class="my-order">
                <view class="my-order-item">
                    <view class="my-order-text">我的订单</view>
                </view>

                <view class="my-order-nav">
                    <view class="all-order order-nav-item" @click="gotoOrder(0)">
                        <view class="all-order-font iconfont icon-ding_dan"></view>
                        <view class="all-order-text">全部订单</view>
                    </view>
                    <view class="wait-pay order-nav-item" @click="gotoOrder(1)">
                        <view class="wait-pay-font iconfont icon-fukuantongzhi"></view>
                        <view class="wait-pay-text">待付款</view>
                    </view>
                    <view class="wait-receiving order-nav-item" @click="gotoOrder(2)">
                        <view class="wait-receiving-font iconfont icon-receipt-address"></view>
                        <view class="wait-receiving-text">待收货</view>
                    </view>
                    <view class="return-goods order-nav-item" @click="gotoOrder(3)">
                        <view class="return-goods-font iconfont icon-tuihuotuikuan_dianpu"></view>
                        <view class="return-goods-text">退款退货</view>
                    </view>
                </view>
            </view>

            <!-- 收货地址管理 -->
            <view class="receiving-address" @click="gotoAddress">
                <view class="receiving-address-text">收货地址管理</view>
                <view class="receiving-address-goicon">></view>
            </view>

            <!-- 开发商 -->
            <view class="developers">
                <view class="developers-item" @click="callCustomer">
                    <view>联系客服</view>
                    <view>400-618-4000</view>
                </view>
                <view class="developers-item">
                    <button class="feedback-btn" open-type='feedback'>意见反馈</button>
                    <view>></view>
                </view>
                <view class="developers-item" @click="aboutMe">
                    <view>关于我们</view>
                    <view>></view>
                </view>
            </view>
        </view>
        <!-- 用户内容 end -->
    </view>
</template>

<script>
    import {token} from "@/token/token";

    export default {
        name: "user",
        data() {
            return {
                //用户信息
                userInfo: {},

                //收藏的商品数组
                collectGoodsArr: []

            }
        },
        onShow() {
            this.userInfo = uni.getStorageSync("userInfo")
            this.collectGoodsArr = uni.getStorageSync("collection")
        },
        methods: {
            //登录获取权限
            login(e) {
                this.userInfo = e.detail.userInfo
                uni.setStorageSync("userInfo", this.userInfo)
                uni.setStorageSync("token",token)
            },
            //前往收藏页面
            gotoCollect(tabsIndex) {
                uni.navigateTo({
                    url: "/pages/collect/collect?tabsIndex=" + tabsIndex
                })
            },
            //前往订单页面
            gotoOrder(tabsIndex) {
                uni.navigateTo({
                    url: `/pages/order/order?tabsIndex=${tabsIndex}`
                })
            },
            //前往选择地址页面
            gotoAddress() {
                uni.navigateTo({
                    url: "/pages/selectAddress/selectAddress"
                })
            },
            //拨打客服电话
            callCustomer() {
                uni.makePhoneCall({
                    phoneNumber: "400-618-4000"
                })
            },
            //关于我们
            aboutMe() {
                uni.showModal({
                    title: "关于我们",
                    content: "此程序仅为个人作品展示",
                    showCancel: false
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .user {
        height: 100vh;
        background-color: #edece8;
    }

    /*用户信息 start*/
    .user-info {
        height: 40vh;
    }

    /*已登录*/
    .user-already-logged {
        position: relative;
        height: 100%;

        .bg-image {
            height: 100%;
            filter: blur(5px);
        }

        .small-image {
            position: absolute;
            width: 160rpx;
            height: 160rpx;
            border-radius: 50%;
            left: 50%;
            transform: translate(-50%);
            top: 20%;
        }

        .user-name {
            position: absolute;
            color: white;
            font-size: 32rpx;
            top: 60%;
            left: 50%;
            transform: translate(-50%);
        }
    }

    /*未登录*/
    .user-not-logged {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        background-color: red;

        .login-btn {
            width: 150rpx;
            height: 80rpx;
            font-size: 34rpx;
            padding: 0;
            border-radius: 0;
        }
    }

    /*用户信息 end*/

    /*用户内容 start*/
    .user-content {
        position: relative;
        transform: translate(0,-50rpx);
        padding: 0 20rpx;
    }

    .collection-concerns {
        display: flex;
        background-color: #fff;
        height: 100rpx;
    }

    .collection-concerns-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .number-item {
        color: red;
    }

    .text-item {
        color: #666666;
    }

    /*我的订单*/
    .my-order {
        margin-top: 20rpx;
        background-color: #fff;
    }

    .my-order-item {
        height: 80rpx;
        border-bottom: 1px solid #666;

        .my-order-text {
            color: #666;
            line-height: 80rpx;
            margin-left: 20rpx;
        }
    }

    .my-order-nav {
        display: flex;
        height: 120rpx;
    }

    .order-nav-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #666;
    }

    .iconfont {
        font-size: 40rpx;
        color: var(--themeColor);
    }

    /*收货地址管理*/
    .receiving-address {
        margin-top: 20rpx;
        height: 80rpx;
        padding: 0 20rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
        color: #666;
    }

    /*开发商*/
    .developers {
        background-color: #fff;
        display: flex;
        flex-direction: column;
        margin-top: 20rpx;
    }

    .developers-item {
        height: 80rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #666;
        padding: 0 20rpx;
        color: #666;
    }

    .feedback-btn {
        width: 100%;
        padding: 0;
        margin: 0;
        font-size: 28rpx;
        color: #666;
        background-color: inherit;
        border: none;
        text-align: start;

    }

    .feedback-btn::after {
        border: none;
    }

    /*用户内容 end*/

</style>
