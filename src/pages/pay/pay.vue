<template>
    <view class="pay">
        <!-- 默认收货地址 start -->
        <view class="def-address" v-show="!isUserInfo" @click="getAddress">

            <view class="address-left">
                <view class="user-info">
                    <view class="user-name">收件人: {{defaultAddress.userName}}</view>
                    <view class="user-phone">{{defaultAddress.userPhone}}</view>
                </view>

                <view class="address">{{defaultAddress.province}} {{defaultAddress.city}} {{defaultAddress.area}} {{defaultAddress.userDetailedAddress}}</view>
            </view>

            <view class="address-rigth">
                <view class="def-text">更改地址</view>
            </view>
        </view>
        <!-- 默认收货地址 end -->

        <view class="total-commodity-text">商品合计</view>

        <!-- 结算的商品 start -->
        <view class="commodity"
              v-for="(item,index) in payCommodity"
              :key="index">
            <!-- 图片 -->
            <view class="commodity-image">
                <image mode="scaleToFill" :src="item.goods_small_logo" />
            </view>

            <!-- 商品描述 -->
            <view class="commodity-describe">
                <view class="commodity-title">{{item.goods_name}}</view>

                <!-- 价格及数量 -->
                <view class="commodity-price">
                    <view class="price-item">￥{{item.goods_price}}</view>
                    <view class="num-item">x{{item.num}}</view>
                </view>
            </view>
        </view>

        <!-- 结算的商品 end -->

        <!-- 底边栏 start -->
        <view class="bottom-sidebar">
            <view class="sidebar-total">
                <view class="sidebar-total-item">
                    <view class="sidebar-total-text">合计:</view>
                    <view class="sidebar-total-price">￥{{payPrice}}</view>
                </view>

                <view class="freight-text">包含运费</view>
            </view>

            <button class="sidebar-pay" open-type="getUserInfo" @getuserinfo="getUserInfo" type="warn" size="mini">支付({{payNum}})</button>
        </view>
        <!-- 底边栏 end -->

    </view>
</template>

<script>
    import {createOrder,getPayParam} from "@/network/Interfaces";
    import {token} from "@/token/token";

    export default {
        name: "pay",
        data() {
            return {
                //是否有收货地址
                isUserInfo: true,

                defaultAddress: {},

                //购物车中的商品
                cartCommodity: [],

                //将要付款的商品
                payCommodity: [],

                //付款价格和商品数量
                payPrice: 0,
                payNum: 0
            }
        },
        onShow() {
            //判断是否存有收货地址，关联到显示的标签
            let addressList = uni.getStorageSync("receivingAddress")
            if(addressList.length !== 0) {
                this.isUserInfo = false
            }else {
                this.isUserInfo = true
            }

            //找出地址列表中默认选择的收货地址，如果没有默认地址，就将第一个地址作为默认的
            addressList.forEach(res => {
                if (res.isDefaultAddress == true) {
                    this.defaultAddress = res
                }
            })
            if (JSON.stringify(this.defaultAddress) == "{}") {
                addressList[0].isDefaultAddress = true
                this.defaultAddress = addressList[0]
                uni.setStorageSync("receivingAddress",addressList)
            }

            //取出购物车中要购买的商品
            this.cartCommodity = uni.getStorageSync("cart")
            for (let i = 0; i < this.cartCommodity.length; i++) {
                if (this.cartCommodity[i].checked) {
                    this.payPrice += this.cartCommodity[i].goods_price * this.cartCommodity[i].num
                    this.payNum += this.cartCommodity[i].num
                    this.payCommodity.push(this.cartCommodity[i])
                }
            }
        },
        methods: {
            //获取收货地址被点击，跳转地址选择页面
            getAddress() {
                uni.navigateTo({
                    url: "/pages/selectAddress/selectAddress"
                })
            },
            //微信支付
            async getUserInfo(e) {
                //获取用户信息
                const {encryptedData,rawData,iv,signature,errMsg,userInfo} = e.detail
                if(errMsg !== 'getUserInfo:ok') {
                    uni.showToast({
                        title: '已取消微信授权登录,请登录后购买',
                        icon: 'none'
                    })
                    return
                }

                //将用户信息和token存入缓存
                uni.setStorageSync("userInfo",userInfo)
                uni.setStorageSync("token",token)

                //创建订单
                let orderArr = []
                this.payCommodity.forEach(v => {
                    orderArr.push({
                        goods_id: v.goods_id,
                        goods_number: v.num,
                        goods_price: v.goods_price
                    })
                })

                this.defaultAddress.all = function() {
                    return this.province + this.city + this.area + this.userDetailedAddress
                }
                let {data: orderRes} = await createOrder(token,this.payPrice,this.defaultAddress.all(),orderArr)
                let order_number = orderRes.message.order_number

                //付款
                let {data: payParamRes} = await getPayParam(token,order_number)
                let pay = payParamRes.message.pay
                uni.requestPayment({
                    // timeStamp: pay.timeStamp,
                    // nonceStr: pay.nonceStr,
                    // package: pay.package,
                    // signType: pay.signType,
                    // paySign: pay.paySign,
                    ...pay,

                    success: res => {
                        uni.navigateTo({
                            url: "/pages/order/order"
                        })
                    },
                    fail: err => {
                        uni.showToast({
                            title: "已取消支付",
                            icon: "none"
                        })
                    }
                })



                /*
                    ***用于没有token，只能用别人的
                //获取用户登录code
                let [err,success] = await uni.login({
                    provider: "weixin"
                })
                let {code} = success

                //将用户信息发送后台注册，返回用户token
                let {data: res} = await getUserToken({
                    encryptedData,
                    rawData,
                    iv,
                    signature,
                    code
                })
                console.log(res)
                Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo
                 */

            }
        }
    }
</script>

<style lang="less" scoped>

    .pay {
        padding-bottom: 50px;
    }

    /*默认收货地址 start*/
    .def-address {
        display: flex;
        justify-content: flex-start;
        height: 100upx;
        border-bottom: 1px solid red;
    }

    .address-left {
        flex: 1;
    }

    .user-info {
        display: flex;
        justify-content: space-between;
        margin-top: 10upx;

        .user-name {
            margin-left: 20upx;
        }

        .user-phone {
            margin-right: 20upx;
            color: #666;
            font-size: 26upx;
        }
    }

    .address {
        margin-left: 20upx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
    }

    .address-rigth {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 160upx;
        background-color: #eee;

        .def-text {
            color: #666;
        }
    }
    /*默认收货地址 end*/

    .total-commodity-text {
        height: 80rpx;
        line-height: 80rpx;
        font-size: 34rpx;
        font-weight: 500;
        padding-left: 20rpx;
        border-bottom: 1px solid red;
    }

    /*结算的商品 start*/
    .commodity {
        display: flex;
        height: 220rpx;
        align-items: center;
        border-bottom: 1px solid #eeeeee;
    }

    .commodity-image {
        margin: 0 40rpx;
        width: 180rpx;

        image {
            width: 180rpx;
            height: 180rpx;
        }
    }

    .commodity-describe {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 180rpx;
    }

    .commodity-title {
        font-size: 30rpx;
        color: #666666;

        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }


    .commodity-price {
        width: 100%;
        display: flex;
        justify-content: space-between;

        .price-item {
            font-size: 36rpx;
            color: red;
        }

        .num-item {
            font-size: 30rpx;
            color: #666666;
            align-self: flex-end;
            margin-right: 20rpx;
        }
    }

    /*结算的商品 end*/

    /*底边栏 start*/
    .bottom-sidebar {
        display: flex;
        justify-content: flex-end;
        height: 50px;
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #fff;
    }

    .sidebar-total {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0 20rpx;

        .sidebar-total-item {
            display: flex;
            justify-content: space-between;
        }

        .sidebar-total-text {
            font-size: 32rpx;
            margin-right: 10rpx;
        }

        .sidebar-total-price {
            font-size: 36rpx;
            color: red;
        }

        .freight-text {
            font-size: 28rpx;
            color: #666666;
            align-self: flex-end;
        }
    }


    .sidebar-pay {
        width: 180rpx;
        font-size: 36rpx;
        background-color: red;
        color: #fff;
        text-align: center;
        line-height: 50px;

        /*重置按钮样式*/
        border-radius: 0;
        margin: 0;
        padding: 0;

    }
    /*底边栏 end*/

</style>
