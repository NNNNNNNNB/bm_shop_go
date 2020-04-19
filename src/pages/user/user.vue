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
                <view class="collection-shop collection-concerns-item">
                    <view class="shop-number">0</view>
                    <view class="shop-text">收藏的店铺</view>
                </view>
                <view class="collection-goods collection-concerns-item">
                    <view class="goods-number">0</view>
                    <view class="goods-text">收藏的商品</view>
                </view>
                <view class="concerns-goods collection-concerns-item">
                    <view class="shop-number">0</view>
                    <view class="shop-text">关注的商品</view>
                </view>
                <view class="my-footprint collection-concerns-item">
                    <view class="shop-number">0</view>
                    <view class="shop-text">我的足迹</view>
                </view>
            </view>
        </view>
        <!-- 用户内容 end -->
    </view>
</template>

<script>
    export default {
        name: "user",
        data() {
            return {
                //用户信息
                userInfo: {},
            }
        },

        onLoad() {
            this.userInfo = uni.getStorageSync("userInfo")
        },
        methods: {
            login(e) {
                this.userInfo = e.detail.userInfo
                uni.setStorageSync("userInfo", this.userInfo)
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

    /*用户内容 end*/

</style>
