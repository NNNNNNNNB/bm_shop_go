<template>
    <view class="goods-detail">
        <!-- 轮播图 start -->
        <swiper circular indicator-dots autoplay class="swiper-goods">
            <swiper-item
                v-for="(item,index) in goodsDetailData.pics"
                :key="index"
                class="swiper-item-image"
                @click="showImage(index)">
                <image :src="item.pics_mid" mode="widthFix"/>
            </swiper-item>
        </swiper>
        <!-- 轮播图 end -->

        <!-- 商品价格、名称、收藏 start -->
        <view class="goods-price">￥{{goodsDetailData.goods_price}}</view>
        <view class="goods-describe">
            <view class="goods-title">{{goodsDetailData.goods_name}}</view>
            <view class="goods-collection">
                <view class="font-icon iconfont icon-shoucang"></view>
                <view class="collection">收藏</view>
            </view>
        </view>
        <!-- 商品价格、名称、收藏 end -->

        <!-- 图文详情 start -->
        <view class="detail-text">图文详情</view>
        <view class="detail-ima">
            <rich-text :nodes="goodsDetailData.goods_introduce"></rich-text>
        </view>
        <!-- 图文详情 end -->

        <!-- 工具栏 start -->
        <view class="tools">
            <view class="tools-icon">
                <view class="customer">
                    <view class="iconfont icon-kefu"></view>
                    <view class="customer-text">联系客服</view>
                    <button open-type="contact" @click="showErr"></button>
                </view>
                <view class="share">
                    <view class="iconfont icon-yixianshi-"></view>
                    <view class="share-text">分享</view>
                    <button open-type="share" @click="showErr"></button>
                </view>
                <view class="cart" @click="gotoCart">
                    <view class="iconfont icon-gouwuche"></view>
                    <view class="cart-text">购物车</view>
                </view>
            </view>

            <view class="tools-click">
                <view class="addcart" @click="addCart">加入购物车</view>
                <view class="purchase">立即购买</view>
            </view>
        </view>
        <!-- 工具栏 end -->
    </view>
</template>

<script>
    import {getGoodsDetailData} from "@/network/Interfaces";

    export default {
        name: "goods_detail",
        data() {
            return {
                //商品详情详细
                goodsDetailData: {}
            }
        },
        onLoad(params) {
            this.getGoodsDetailData(params.goods_id)
        },
        methods: {
            //获取商品详情数据
            async getGoodsDetailData(goodsId) {
                const {data: res} = await getGoodsDetailData(goodsId)
                if(res.meta.status !== 200) {
                    this.getGoodsDetailData(goodsId)
                    return
                }
                this.goodsDetailData = res.message
                this.goodsDetailData.goods_introduce = this.goodsDetailData.goods_introduce.replace(/\.webp/g, ".jpg")
                // console.log(this.goodsDetailData)
            },
            //预览图片
            showImage(index) {
                let images = []
                this.goodsDetailData.pics.forEach(res => {
                    images.push(res.pics_mid)
                })
                uni.previewImage({
                    current: index,
                    urls: images
                })
            },
            //H5端显示
            //#ifdef H5
            showErr() {
                uni.showToast({
                    title: 'H5端未开放，可登录小程序平台',
                    icon: 'none'
                })
            },
            //#endif
            //跳转购物车
            gotoCart() {
                uni.switchTab({
                    url: "/pages/cart/cart"
                })
            },
            //加入购物车
            addCart() {
                //获取缓存中购物车总商品
                let cart = uni.getStorageSync("cart") || []
                let index = cart.findIndex(v => v.goods_id === this.goodsDetailData.goods_id)

                //第一次添加商品
                if(index === -1) {
                    this.goodsDetailData.num = 1
                    this.goodsDetailData.checked = true
                    cart.push(this.goodsDetailData)

                //本来就存在购物车中
                }else {
                    cart[index].num++
                }

                uni.setStorageSync("cart",cart)
                uni.showToast({
                    title: "加入成功",
                    icon: "success",
                    mask: true
                })
            }
        }
    }
</script>

<style scoped lang="less">

    /*轮播图 start*/
    .swiper-goods {
        height: 65vw;

        .swiper-item-image {
            display: flex;
            justify-content: center;
            align-items: center;

            image {
                width: 60%;
            }
        }
    }
    /*轮播图 end*/

    /*商品价格、名称、收藏 start*/
    .goods-price {
        padding: 15upx;
        padding-bottom: 0;
        font-size: 34upx;
        font-weight: 700;
        color: var(--themeColor);
    }

    .goods-describe {
        display: flex;
        padding: 15upx 0;
        border-bottom: 5px solid #dedede;

        .goods-title {
            flex: 5;
            color: #434343;
            padding: 0 10upx;
            font-size: 28upx;

            display: -webkit-box;
            overflow: hidden;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;

        }

        .goods-collection {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-left: 1px solid #000;

            .collection {
                color: #434343;
            }
        }
    }
    /*商品价格、名称、收藏 end*/

    .detail-text {
        font-size: 34upx;
        color: var(--themeColor);
        padding: 15upx;
    }

    .detail-ima {
        padding-bottom: 100upx;
    }

    /*工具栏 start*/
    .tools {
        display: flex;
        background-color: #fff;
        height: 100upx;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;

        .tools-icon {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24upx;


            .customer {
                flex: 1;
                text-align: center;
                position: relative;

                button {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                }
            }

            .share {
                flex: 1;
                text-align: center;
                position: relative;

                button {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                }
            }

            .cart {
                flex: 1;
                text-align: center;
            }

        }

        .tools-click {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 32upx;
            color: #fff;

            .addcart {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #FCAA23;
                height: 100%;
            }

            .purchase {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #EA4350;
                height: 100%;
            }
        }
    }
    /*工具栏 end*/
</style>
