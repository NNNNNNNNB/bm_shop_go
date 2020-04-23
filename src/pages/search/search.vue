<template>
    <view class="search">
        <view class="search-item">
            <input v-model="inputVal" @input="searchInput" class="search-input" type="text" placeholder="请输入搜索内容" />
            <button @click="clearInput" class="clear-btn">取消</button>
        </view>
        <view class="search-content" :hidden="isNull">
            <navigator
                v-for="(item,index) in searchData"
                :key="index"
                :url="'/pages/goods_detail/goods_detail?goods_id=' + item.goods_id">
                <view class="content-item">{{item.goods_name}}</view>
            </navigator>
        </view>
    </view>
</template>

<script>
    import {getSearchData} from "@/network/Interfaces";

    export default {
        name: "search",
        data() {
            return {
                searchData: [],

                timer: null,

                inputVal: null,
                isNull: true
            }
        },
        methods: {
            //搜索框内容改变触发
            searchInput(e) {
                let searchContent = e.detail.value
                if(!searchContent.trim()) {
                    uni.showToast({
                        title: "请输入要搜索的内容",
                        icon: 'none',
                        mask: true
                    })
                    return
                }


                //防抖处理
                if (this.timer) {
                    clearTimeout(this.timer)
                }
                this.timer = setTimeout(()=> {
                    this.getSearchData(searchContent)
                    this.isNull = false
                },400)



            },
            async getSearchData(query) {
                this.searchData = await getSearchData(query)
            },
            //取消按钮点击清空输入框内容
            clearInput() {
                this.inputVal = null
                this.isNull = true
            }
        }
    }
</script>

<style>
    page{
        background-color: #dedede;
    }
</style>

<style lang="less" scoped>
    .search-item {
        display: flex;
        margin-top: 20rpx;
        padding: 0 20rpx;
    }

    .search-input {
        flex: 1;
        font-size: 28rpx;
        background-color: #fff;
        height: 60rpx;
        padding-left: 20rpx;
    }

    .clear-btn {
        font-size: 26rpx;
        padding: 0;
        margin: 0;
        width: 130rpx;
        margin-left: 20rpx;
    }

    .content-item {
        height: 70rpx;
        font-size: 34rpx;
        border-bottom: 1px solid #666;
        line-height: 70rpx;
        padding: 0 20rpx;

        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
</style>
