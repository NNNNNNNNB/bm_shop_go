<template>
    <view class="cart">
        <!-- 获取收货地址 start-->
        <view class="get-add" @click="getAddress" v-show="isUserInfo">添加收货地址</view>
        <!-- 获取收货地址 end-->

        <view class="cart-title">优购生活馆</view>

        <!-- 购物车商品 start -->
        <view class="cart-goods"
              v-for="(item,index) in cart"
              :key="index"
              @click="clickCartGoods(index)">

            <view class="check-goods">
                <view :class="['check-goods-circle',cart[index].checked ? 'check' : '']"></view>
            </view>
            <view class="goods-image">
                <image
                    :src="item.goods_small_logo"
                    mode="scaleToFill"/>
            </view>
            <view class="cart-info">
                <view class="cart-goods-title">{{item.goods_name}}</view>

                <view class="cart-goods-item">
                    <view class="item-price">￥{{item.goods_price}}</view>
                    <view class="item-button">
                        <button class="button-sub" @click.stop="buttonSub(index)">-</button>
                        <text class="item-goods-number">{{item.num}}</text>
                        <button class="button-add" @click.stop="buttonAdd(index)">+</button>
                    </view>
                </view>

            </view>
        </view>
        <!-- 购物车商品 end -->

        <!-- 跳转支付 start -->
        <view class="go-pay">

            <!-- 全选 -->
            <view class="all-select" @click="allSelectClick">
                <view :class="['sleect-item','check-goods-circle',isAllSelect ? 'check' : '']"></view>
                <view class="describe-text">全选</view>
            </view>

            <!-- 合计 -->
            <view class="total">
                <view class="total-item-top">
                    <view class="total-text">合计:</view>
                    <view class="total-price">￥{{totalCommodity}}</view>
                </view>

                <view class="total-item-bottom">
                    <view class="freight-included">包含运费</view>
                </view>

            </view>

            <!-- 结算 -->
            <view class="settlement" @click="gotoPay">结算({{totalNum}})</view>
        </view>
        <!-- 跳转支付 end -->
    </view>
</template>

<script>
    export default {
        name: "cart",
        data() {
            return {
                //是否有收货地址
                isUserInfo: true,

                //本地缓存的购物车
                cart: [],

                //是否全选商品
                isAllSelect: false,

                //选中商品合计
                selectTotalCommodity: 0
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


            //获取本地缓存购物车，为空等于空数组
            this.cart = uni.getStorageSync("cart")
            if (this.cart.length == 0) {
                this.cart = []
            }

            //保存是否全选状态
            this.isAllSelect = this.isAllSelectCommodity(this.cart)
        },
        //计算属性
        computed: {
            //计算商品总价
            totalCommodity() {
                let price = 0
                for (let i = 0; i < this.cart.length; i++) {
                    if (this.cart[i].checked) {
                        price += this.cart[i].goods_price * this.cart[i].num
                    }
                }
                return price
            },
            //计算商品数量
            totalNum() {
                let num = 0
                for (let i = 0; i < this.cart.length; i++) {
                    if (this.cart[i].checked) {
                        num += this.cart[i].num
                    }
                }
                this.selectTotalCommodity = num
                return num
            }
        },
        methods: {
            //获取收货地址被点击，跳转地址选择页面
            getAddress() {
                uni.navigateTo({
                    url: "/pages/selectAddress/selectAddress"
                })
            },
            //购物商品被点击，取反小红圈，存入缓存
            clickCartGoods(index) {
                this.cart[index].checked = !this.cart[index].checked
                this.isAllSelect = this.isAllSelectCommodity(this.cart)
                uni.setStorageSync("cart",this.cart)
            },
            //按钮减号被点击
            async buttonSub(index) {
                this.cart[index].num -= 1
                if(this.cart[index].num <= 0) {
                    let [error,res] = await uni.showModal({title: '购物车商品',content: '是否删除该商品'})
                    if(res.confirm) {
                        this.cart.splice(index,1)
                    }else {
                        this.cart[index].num = 1
                        return
                    }
                }

                uni.setStorageSync("cart",this.cart)
            },
            //按钮加号被点击
            buttonAdd(index) {
                this.cart[index].num += 1
                uni.setStorageSync("cart",this.cart)
            },
            //全选按钮被点击
            allSelectClick() {
                this.isAllSelect = !this.isAllSelect
                for (let i = 0; i < this.cart.length; i++) {
                    this.cart[i].checked = this.isAllSelect
                }

                uni.setStorageSync("cart",this.cart)
            },
            //结算按钮点击
            gotoPay() {
                if (this.selectTotalCommodity > 0) {
                    uni.navigateTo({
                        url: "/pages/pay/pay"
                    })
                }else {
                    uni.showToast({
                        title: "未选择商品",
                        icon: "none"
                    })
                }
            },

            //判断传入的商品数组是否为全选状态
            isAllSelectCommodity(commodity) {
                if (commodity.length === 0) {
                    return false
                }
                for (let i = 0; i < commodity.length; i++) {
                    if (commodity[i].checked === false) {
                        return false
                    }
                }
                return true
            }
        }
    }
</script>

<style lang="less" scoped>
    .cart {
        padding-bottom: 50px;
    }

    .get-add {
        height: 100upx;
        font-size: 36upx;
        color: red;
        text-align: center;
        line-height: 110upx;
        border: 1px solid red;
        font-weight: 600;
    }

    .cart-title {
        height: 80upx;
        line-height: 80upx;
        margin-left: 20upx;
        font-size: 40upx;
        border-bottom: 1px solid #eee;
    }

    /*购物车商品 start*/
    .cart-goods {
        display: flex;
        height: 200upx;
        border-bottom: 1px solid #eee;
        padding: 10upx 0;
    }

    .check-goods {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 80upx;
    }

    .goods-image {
        width: 180upx;

        image {
            width: 180upx;
            height: 180upx;
        }
    }

    .cart-info {
        flex: 1;
        padding: 0 15upx;

    }

    .cart-goods-title {
        font-size: 32upx;
        font-weight: 500;

        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .cart-goods-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 30upx;
    }

    .item-price {
        flex: 1;
        font-size: 30upx;
        color: red;
    }

    .item-button {
        flex: 1;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .button-sub,  .button-add{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 60upx;
            height: 60upx;
        }

    }
    /*购物车商品 end*/

    /*跳转支付 start*/
    .go-pay {
        display: flex;
        position: fixed;
        height: 50px;
        background-color: #fff;
        left: 0;
        right: 0;
        bottom: 0;

        /*#ifdef H5*/
        bottom: 50px;
        /*#endif*/
    }

    .all-select {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;

        .sleect-item {
            margin-right: 4px;
        }

        .describe-text {
            margin-left: 4px;
            font-size: 34rpx;
        }
    }

    .total {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .total-item-top {
            width: 100%;
            display: flex;
            justify-content: space-between;

            .total-text {
                font-size: 34rpx;
                margin-left: 20rpx;
            }

            .total-price {
                font-size: 34rpx;
                color: red;
                margin-right: 20rpx;
            }
        }

        .total-item-bottom {
            width: 100%;
            display: flex;
            justify-content: flex-end;

            .freight-included {
                font-size: 26rpx;
                color: #666666;
                margin-right: 20rpx;
            }
        }


    }

    .settlement {
        flex: 1;
        background-color: red;
        color: #fff;
        text-align: center;
        line-height: 50px;
        font-size: 34rpx;
    }


    /*跳转支付 end*/

    /* 圆圈通用样式 start*/
    .check-goods-circle {
        width: 30upx;
        height: 30upx;
        border: 1px solid red;
        border-radius: 50%;
    }

    .check {
        background-color: red;
    }

    /* 圆圈通用样式 end*/

</style>
