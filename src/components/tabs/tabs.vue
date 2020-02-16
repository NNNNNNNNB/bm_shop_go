<template>
    <!-- 将父组件传入的数据定义为css变量，方便使用到<style>中，由于高只能使用px单位，所以还是需要到内联样式中使用 -->
    <view class="tabs"
          :style="{
                '--tabs-height': tabsHeight,
                '--font-color': fontColor,
                '--bg-color': bgColor,
                '--active-font-color': activeFontColor,
                '--active-bg-color': activeBgColor,
                '--active-border-color': activeBorderColor}">

        <view class="tabs-title">
            <view
                :class="['title-item',activeIndex == index ? 'active-bg-color' : '']"
                :style="{'height': 'var(--tabs-height)','lineHeight': 'var(--tabs-height)'}"
                v-for="(item,index) in tabsTitle"
                :key="index"
                @click="tabsItemClick(index)">
                <text :class="['title-text',activeIndex == index ? 'active' : '']">{{item}}</text>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "tabs",
        data() {
            return {
                activeIndex: 0
            }
        },
        props: {
            //item标题文字
            tabsTitle: {
                type: Array,
                default: []
            },
            //item标题高度
            tabsHeight: {
                type: String,
                default: "30px"
            },
            //字体颜色
            fontColor: {
                type: String,
                default: "#000"
            },
            //背景颜色
            bgColor: {
                type: String,
                default: "#fff"
            },
            //被选中的字体颜色
            activeFontColor: {
                type: String,
                default: "#eb4450"
            },
            //被选中的背景颜色
            activeBgColor: {
                type: String,
                default: "#fff"
            },
            //选中的底部边框线颜色
            activeBorderColor: {
                type: String,
                default: "#000"
            }
        },
        methods: {
            //tabs某个选项被点击
            tabsItemClick(index) {
                this.activeIndex = index

                //返回当前选中的索引
                this.$emit("currentIndex",index)
            }
        }
    }
</script>

<style scoped lang="less">
    .tabs-title {
        background-color: var(--bg-color);
        display: flex;
        justify-content: center;
        align-items: center;

        .title-item {
            flex: 1;
            text-align: center;
            font-size: 30upx;

            .title-text {
                display: inline-block;
                padding: 0 40upx;
                height: 100%;
                color: var(--font-color);
            }
        }
    }

    /*被选中改变item背景色*/
    .active-bg-color {
        background-color: var(--active-bg-color);
    }

    /*被选中改变文字颜色和增加下边框*/
    .active {
        color: var(--active-font-color) !important;
        border-bottom: 3px solid var(--active-border-color);
    }
</style>
