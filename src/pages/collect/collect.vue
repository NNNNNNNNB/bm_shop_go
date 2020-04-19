<template>
    <view class="collect">
        <tabs @currentIndex="getTabsIndex" :tabs-title="tabsItem" tabs-height="40px" font-color="#666" active-font-color="red" active-border-color="red"/>

        <view class="comprehensive" v-if="currentTabsIndex === 0">
            <goods-item
                v-for="(item,index) in collectArr"
                :key="index"
                @click.native="gotoGoodsDetail(item.goods_id)"
                :goods-name="item.goods_name"
                :goods-image="item.goods_big_logo"
                :goods-price="item.goods_price"/>
        </view>
    </view>
</template>

<script>
    import tabs from "@/components/tabs/tabs";
    import goodsItem from "@/components/goodsItem/goodsItem";

    export default {
        name: "collect",
        components: {
            tabs,
            goodsItem
        },
        data() {
            return {
                tabsItem: ['商品收藏','品牌收藏','店铺收藏','浏览足迹'],
                collectArr: [],
                currentTabsIndex: 0
            }
        },
        onShow() {
            this.collectArr = uni.getStorageSync("collection")
            if (!Array.isArray(this.collectArr)) {
                this.collectArr = []
            }
        },
        methods: {
            //跳转商品详情
            gotoGoodsDetail(goodsId) {
                uni.navigateTo({
                    url: `/pages/goods_detail/goods_detail?goods_id=${goodsId}`
                })
            },
            //获取tabs当前选项索引
            getTabsIndex(index) {
                this.currentTabsIndex = index
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
