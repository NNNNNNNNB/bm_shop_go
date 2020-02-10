<template>
    <view class="category">
        <search-input/>

        <!-- 屏幕Y轴滑动 start -->
        <view class="scroll">
            <scroll-view scroll-y show-scrollbar class="left-menu">
                <view
                    @click="categoryClick(index)"
                    :class="['menu-item',{'active': currentIndex === index}]"
                    v-for="(item,index) in leftMenuList"
                    :key="index">
                    {{item.cat_name}}
                </view>
            </scroll-view>

            <scroll-view
                scroll-y
                show-scrollbar
                class="right-menu"
                :scroll-top="scrollTop" @scroll="scroll">
                <view class="goods-group" v-for="(item,index) in rightGoodsList" :key="index">
                    <view class="goods-title">
                        <text class="delimiter">/</text>
                        <text class="goods-name">{{item.cat_name}}</text>
                        <text class="delimiter">/</text>
                    </view>

                    <view class="goods-list">
                        <navigator v-for="(goods,index) in item.children" :key="index">
                            <image :src="goods.cat_icon" mode="widthFix"/>
                            <view>{{goods.cat_name}}</view>
                        </navigator>
                    </view>
                </view>
            </scroll-view>
        </view>
        <!-- 屏幕Y轴滑动 end -->

    </view>
</template>

<script>
    import {getCategoryData} from "@/network/Interfaces";

    import searchInput from "@/components/searchInput/searchInput";

    export default {
        name: "category",
        data() {
            return {
                //左侧数据
                leftMenuList: [],
                //右侧数据，(基于左侧数据的索引数组，children子对象)
                rightGoodsList: [],
                //当前左侧选中的索引
                currentIndex: 0,

                //滚动条位置
                scrollTop:0,
                old: {
                    scrollTop: 0
                }
            }
        },
        onLoad() {
            this.getCategoryData()
        },
        components: {
            searchInput
        },
        methods: {
            //获取分类数据
            async getCategoryData() {
                const {data: res} = await getCategoryData()
                this.leftMenuList = res.message
                this.rightGoodsList = this.leftMenuList[this.currentIndex].children
            },
            //分类选项被点击
            categoryClick(index) {
                this.currentIndex = index
                this.rightGoodsList = this.leftMenuList[this.currentIndex].children

                //刷新滚动条位置
                this.scrollTop = this.old.scrollTop
                this.$nextTick(function() {
                    this.scrollTop = 0
                });
            },
            //右侧区域滚动触发
            scroll(e) {
                this.old.scrollTop = e.detail.scrollTop
            }
        }
    }
</script>

<style lang="less" scoped>
    .category {
        height: 100%;
    }

    .scroll {
        display: flex;

        /*由于滚动条在不同的平台视口不同，所以使用条件编译*/
        /* #ifdef H5 */
        height: ~"calc(100vh - 90upx - 50px - 44px)";
        /* #endif */

        /* #ifdef MP */
        height: ~"calc(100vh - 90upx)";
        /* #endif */

        .left-menu {
            flex: 2;

            .menu-item {
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 28upx;
                height: 80upx;
                background-color: #f4f4f4;
            }
        }

        .right-menu {
            flex: 5;

            .goods-title {
                text-align: center;
                margin-top: 30upx;

                .delimiter {
                    color: #ccc;
                }

                .goods-name {
                    font-size: 28upx;
                    padding: 0 20upx;
                }
            }
        }

        .goods-list {
            display: flex;
            flex-wrap: wrap;
            margin-top: 30upx;

            navigator {
                width: 33.33%;
                text-align: center;

                image {
                    width: 50%;
                }

                view {
                    font-size: 24upx;
                }
            }
        }
    }

    .active {
        color:var(--themeColor);
        background-color: #fff !important;
        font-weight: 600;
        border-left: 4rpx solid var(--themeColor);
    }
</style>
