<template>
    <view>
        <search-input/>
        <tabs
            @currentIndex="tabsItemClick"
            :tabs-title="tabsTitle"
            tabs-height="40px"
            font-color="#000"
            bg-color="#fff"
            active-font-color="#eb4450"
            active-bg-color="#fff"
            active-border-color="#eb4450"/>

        <!-- 综合选项卡区域 start -->
        <view class="comprehensive" v-if="tabsIndex === 0">
            <goods-item
                v-for="(item,index) in goodsList"
                :key="index"
                @click.native="gotoGoodsDetail(item.goods_id)"
                :goods-name="item.goods_name"
                :goods-image="item.goods_big_logo"
                :goods-price="item.goods_price"/>
        </view>
        <!-- 综合选项卡区域 end -->

        <!-- 热门选项卡区域 start -->
        <view class="comprehensive" v-if="tabsIndex === 1">
            <goods-item
                v-for="(item,index) in goodsList"
                :key="index"
                @click.native="gotoGoodsDetail(item.goods_id)"
                :goods-name="item.goods_name"
                :goods-image="item.goods_big_logo"
                :goods-price="item.goods_price"/>
        </view>
        <!-- 热门选项卡区域 end -->

        <!-- 价格选项卡区域 start -->
        <view class="comprehensive" v-if="tabsIndex === 2">
            <goods-item
                v-for="(item,index) in goodsList"
                :key="index"
                @click.native="gotoGoodsDetail(item.goods_id)"
                :goods-name="item.goods_name"
                :goods-image="item.goods_big_logo"
                :goods-price="item.goods_price"/>
        </view>
        <!-- 价格选项卡区域 end -->
    </view>
</template>

<script>
    import searchInput from "@/components/searchInput/searchInput";
    import tabs from "@/components/tabs/tabs";
    import goodsItem from "@/components/goodsItem/goodsItem";

    import {getGoodsSearchData} from "@/network/Interfaces";

    export default {
        name: "goods_list",
        data() {
            return {
                //选项卡标题
                tabsTitle: ['综合','销量','价格'],
                //选项卡当前页签
                tabsIndex: 0,

                //搜索商品参数
                goodsSearchParams: {
                    query: '',
                    cid: 0,
                    pagenum: 1,
                    pagesize: 10
                },
                //总商品数量
                total: 0,
                //商品列表
                goodsList: []

            }
        },
        onLoad(params) {
            this.goodsSearchParams.cid = params.cat_id || ""
            this.goodsSearchParams.query = params.query || ""
            this.getGoodsSearchData(this.goodsSearchParams)

        },
        //上拉加载
        onReachBottom() {
            let pages = parseInt(this.total / this.goodsSearchParams.pagesize)
            if(this.goodsSearchParams.pagenum < pages) {
                this.goodsSearchParams.pagenum += 1
                this.getGoodsSearchData(this.goodsSearchParams)
            }
        },
        //下拉刷新
        onPullDownRefresh() {
            this.goodsList = []
            this.goodsSearchParams.pagenum = 1
            this.getGoodsSearchData(this.goodsSearchParams)
            uni.stopPullDownRefresh()
        },
        components: {
            searchInput,
            tabs,
            goodsItem
        },
        methods: {
            //tabs选项卡被点击
            tabsItemClick(index) {
                this.tabsIndex = index
            },
            //获取商品搜索数据
            async getGoodsSearchData(params) {
                uni.showLoading({
                    title: '加载中...'
                })
                const {data: res} = await getGoodsSearchData(params)
                if(res.meta.status !== 200) {
                    this.getGoodsSearchData(params)
                    return
                }
                this.goodsList.push(...res.message.goods)
                this.total = res.message.total
                uni.hideLoading()
            },
            //跳转商品详情
            gotoGoodsDetail(goodsId) {
                uni.navigateTo({
                    url: `/pages/goods_detail/goods_detail?goods_id=${goodsId}`
                })
            }
        }
    }
</script>

<style scoped>

</style>
