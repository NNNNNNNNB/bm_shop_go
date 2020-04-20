<template>
    <view class="order">
        <tabs
            :tabs-title="tabsTitle"
            tabs-height="40px"
            font-color="#666"
            active-border-color="red"
            :active-index="activeIndex"
            @currentIndex="getTabsIndex"/>

        <!-- 订单查询项 start -->
        <view class="order-select"
              v-for="(item,index) in orderItem"
              :key="index">
            <view class="order-number-item order-select-item">
                <view class="order-number-text">订单编号</view>
                <view class="order-number-content">{{item.order_number}}</view>
            </view>

            <view class="order-price-item order-select-item">
                <view class="order-price-text">订单价格</view>
                <view class="order-price-content">￥{{item.order_price}}</view>
            </view>

            <view class="order-date-item order-select-item">
                <view class="order-date-text">订单日期</view>
                <view class="order-date-content">{{item.create_time | dateFormat}}</view>
            </view>
        </view>
        <!-- 订单查询项 end -->

    </view>
</template>

<script>
    import tabs from "@/components/tabs/tabs";
    import {getHistoryOrder} from "@/network/Interfaces";
    import {dateFormat} from "@/utils/utils";

    export default {
        name: "order",
        components: {
            tabs
        },
        data() {
            return {
                //tabs选项标题
                tabsTitle: ["全部","待付款","待发货","退款/退货"],
                //第一次打开默认选中的tabs项
                activeIndex: 0,

                //订单item
                orderItem: [],

                //所有订单、待付款、代发货、退货
                allOrder: [],
                pendingPayOrder: [],
                pendingShipmentOrder: [],
                returnOrder: []
            }
        },
        async onLoad(param) {
            this.activeIndex = Number(param.tabsIndex)

            let token = uni.getStorageSync("token")

            var {orders} = await getHistoryOrder(token,1)
            this.allOrder = orders

            var {orders} = await getHistoryOrder(token,2)
            this.pendingPayOrder = orders

            var {orders} = await getHistoryOrder(token,3)
            this.pendingShipmentOrder = orders

            this.selectTabsIndex(this.activeIndex)
        },
        methods: {
            //选中当前tabs显示的内容
            selectTabsIndex(index) {
                switch (index) {
                    case 0:
                        this.orderItem = this.allOrder
                        break
                    case 1:
                        this.orderItem = this.pendingPayOrder
                        break
                    case 2:
                        this.orderItem = this.pendingShipmentOrder
                        break
                    case 3:
                        this.orderItem = this.returnOrder
                        break
                }
            },
            //获取并选中当前订单项
            getTabsIndex(index) {
                this.selectTabsIndex(index)
            }
        },
        filters: {
            //时间格式化
            dateFormat(value) {
                let date = new Date(value *= 1000)
                return dateFormat(date,"YYYY年mm月dd日 HH:MM:SS")
            }
        }
    }
</script>

<style lang="less" scoped>

    /*订单查询项 start*/
    .order-select {
        height: 180rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding: 0 30rpx;
        border-bottom: 1px solid #808080;
    }

    .order-select-item {
        display: flex;
        justify-content: space-between;
    }

    .order-number-text,
    .order-number-content,
    .order-price-text,
    .order-date-text{
        color: #666;
    }

    .order-price-content {
        color: red;
        font-size: 34rpx;
    }
    /*订单查询项 end*/

</style>
