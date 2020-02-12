<template>
    <view class="goods-item">
        <view class="goods-image">
            <image mode="widthFix" :src="goodsImage ? goodsImage : 'https://ww1.sinaimg.cn/large/007rAy9hgy1g24by9t530j30i20i2glm.jpg'" />
        </view>

        <view class="goods-describe">
            <view class="goods-name">{{this.goodsName}}</view>
            <view class="goods-price">￥{{this.goodsPrice}}</view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "goodsItem",
        props: {
            goodsName: {
                type: String
            },
            goodsImage: {
                type: String
            },
            goodsPrice: {
                type: Number
            }
        }
    }
</script>

<style scoped lang="less">
    .goods-item {
        display: flex;
        height: 230upx;
        border-top: 1px solid #ccc;

        .goods-image {
            display: flex;
            justify-content: center;
            align-items: center;
            flex: 1;
            margin: 0 50upx;

            image {
                height: 100%;
                width: 100%;
            }
        }

        .goods-describe {
            flex: 3;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 25upx 0;

            .goods-name {
                font-size: 28upx;
                display: -webkit-box;
                overflow: hidden;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
            }

            .goods-price {
                font-size: 35upx;
                color: var(--themeColor);
            }
        }
    }
</style>
