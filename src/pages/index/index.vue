<template>

    <view>
        <!-- 搜索框 start -->
        <search-input/>
        <!-- 搜索框 end -->

        <!-- 轮播图 start -->
        <swiper circular indicator-dots autoplay class="swiper">
            <swiper-item v-for="(item,index) in swiperData" :key="item.goods_id" class="swiper-item">
                <navigator :url="item.navigator_url">
                    <image :src="item.image_src" class="swiper-image" mode="widthFix"/>
                </navigator>
            </swiper-item>
        </swiper>
        <!-- 轮播图 end -->

        <!-- 分类导航 start -->
        <view class="cate">
            <navigator v-for="(item,index) in cateData" :key="index" class="cate-ator"
                       url="/pages/category/category" open-type="switchTab">
                <image :src="item.image_src" mode="widthFix" class="cate-image" />
            </navigator>
        </view>
        <!-- 分类导航 end -->

        <!-- 楼层 start -->
        <view class="foolr">
            <view class="foolr-item" v-for="(item,index) in foolrData" :key="index">
                <!-- 楼层标题 -->
                <view class="foolr-item-title">
                    <image :src="item.floor_title.image_src" mode="widthFix" />
                </view>

                <!-- 楼层排列图片 -->
                <view class="foolr-item-list">
                    <view class="list-left">
                        <navigator :url="item.product_list[0].navigator_url">
                            <image :src="item.product_list[0].image_src" mode="widthFix" />
                        </navigator>
                    </view>
                    <view class="list-rigth">
                        <navigator
                            v-for="(listImage,index) in item.product_list"
                            :url="listImage.navigator_url"
                            :key="index"
                            v-if="index !== 0">
                            <image :src="listImage.image_src" mode="scaleToFill"/>
                        </navigator>
                    </view>
                </view>
            </view>
        </view>
        <!-- 楼层 end -->
    </view>


</template>

<script>
    import {getSwiperData,getCateData,getFloorData} from "@/network/Interfaces";

    import searchInput from "@/components/searchInput/searchInput";
	export default {
		data() {
			return {
			    //轮播图列表数据
				swiperData: [],
                //分类导航列表数据
                cateData: [],
                //楼层列表数据
                foolrData: []
			}
		},
        components: {
            searchInput
        },
        onLoad() {
            this.getSwiperData()
            this.getCateData()
            this.getFloorData()
		},
		methods: {
		    //获取轮播图数据
            async getSwiperData() {
                let {data: res} = await getSwiperData()
                if(res.meta.status !== 200) {
                    uni.showToast({
                        title: "数据获取失败！",
                        icon: "none"
                    })
                    return
                }
                this.swiperData = res.message

                //替换内部navigator链接地址
                this.swiperData.forEach(v => {
                    v.navigator_url = v.navigator_url.replace(/main/,"goods_detail")
                })
            },
            //获取分类导航数据
            async getCateData() {
                const {data: res} = await getCateData()
                this.cateData = res.message

            },
            //获取楼层数据
            async getFloorData() {
                const {data: res} = await getFloorData()
                this.foolrData = res.message

                //替换内部navigator链接地址
                this.foolrData.forEach(v => {
                    v.product_list.forEach(v => {
                        let index = v.navigator_url.indexOf("?")
                        v.navigator_url = v.navigator_url.slice(0,index) + '/goods_list'  + v.navigator_url.slice(index)
                    })
                })
            }
		}
	}
</script>

<style lang="less" scoped>
    .swiper {
        width: 750upx;
        height: 340upx;
    }

    /*分类导航 start*/
    .cate {
        display: flex;

        .cate-ator {
            flex: 1;
            padding: 20upx;
        }

        .cate-image {
            width: 100%;
        }
    }
    /*分类导航 end*/

    /*楼层 start*/
    .foolr-item {
        margin-top: 10upx;
    }

    .foolr-item-list {
        padding: 0 10upx;
        display: flex;

        .list-left {
            flex: 1;
        }

        .list-rigth {
            flex: 2;
            display: flex;
            flex-wrap: wrap;

            navigator {
                width: 50%;
                padding-left: 10upx;
                image {
                    height: 100%;
                }
            }
            navigator:nth-child(n + 3) {
                padding-top: 10upx;
            }
        }

    }
    /*楼层 end*/

</style>
