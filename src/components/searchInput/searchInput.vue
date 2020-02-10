<template>
    <view class="search-input">
        <navigator url="/pages/search/search" open-type="navigate" class="search-item">
            搜索
        </navigator>
    </view>
</template>

<script>
    export default {
        name: "searchInput"
    }
</script>

<style lang="less" scoped>
    .search-input {
        height: 90upx;
        padding: 10upx;
        background-color: var(--themeColor);

        .search-item {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #fff;
            border-radius: 15upx;
            color: #666;
        }
    }
</style>
