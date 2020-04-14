<template>
    <view class="select-address">
        <view class="address-list" v-for="(item,index) in userInfoList" :key="index" @click="selectAddress(index)">
            <view class="user-name">
                <view>{{item.userName}}</view>
            </view>

            <view class="user-info">
                <text class="info-name">{{item.userName}}</text>
                <text class="info-phone">{{item.userPhone}}</text>
                <text class="info-address">{{item.province}} {{item.city}} {{item.area}} {{item.userDetailedAddress}}</text>
            </view>

            <view class="address-edit" @click.stop="editInfo(index)">
                <view>编辑</view>
            </view>

            <view class="address-delete" @click.stop="deleteInfo(index)">
                <view>删除</view>
            </view>
        </view>
        <view class="add-address" @click="addAddress">添加地址</view>
    </view>
</template>

<script>
    export default {
        name: "selectAddress",
        data() {
            return {
                //收件人信息列表
                userInfoList: []
            }
        },
        // created() {
        //     this.userInfoList = uni.getStorageSync('receivingAddress')
        // },
        onShow() {
            this.userInfoList = uni.getStorageSync('receivingAddress')
        },
        methods: {
            //添加地址被点击，跳转编辑地址页面
            addAddress() {
                uni.navigateTo({
                    url: "/pages/editAddress/editAddress"
                })
            },
            //选择默认地址
            selectAddress(index) {
                //将选中的设为默认地址
                for (let i =0; i < this.userInfoList.length; i++) {
                    this.userInfoList[i].isDefaultAddress = false
                }
                this.userInfoList[index].isDefaultAddress = true

                //保存缓存并返回上一页
                uni.setStorageSync("receivingAddress",this.userInfoList)
                uni.navigateBack()
            },
            //编辑收件信息
            editInfo(index) {
                uni.navigateTo({
                    url: '/pages/editAddress/editAddress?editIndex=' + index
                })
            },
            //删除收货地址
            deleteInfo(index) {
                uni.showModal({
                    title: '提示',
                    content: '是否删除收件信息',
                    success: res => {
                        if (res.confirm) {
                            let addressList = uni.getStorageSync("receivingAddress")
                            addressList.splice(index, 1)
                            this.userInfoList = addressList
                            uni.setStorageSync("receivingAddress",addressList)
                        }
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .select-address {
        margin-bottom: 80upx;
    }

    /*收件人列表 start*/
    .address-list {
        display: flex;
        height: 160upx;
        border-bottom: 1px solid #eee;
        padding: 20upx 0;
    }

    .user-name {
        display: flex;
        width: 120upx;
        align-items: center;
        justify-content: center;
        padding: 20upx;

        view {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #666;
            color: #fff;
            font-size: 26upx;
        }
    }

    .user-info {
        flex: 1;

        .info-name {
            font-size: 32upx;
            margin-right: 25upx;
        }

        .info-phone {
            font-size: 26upx;
            color: #666;
        }

        .info-address {
            display: inline-block;
            font-size: 28upx;
            padding-right: 20upx;

            /*文字超出两行隐藏*/
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
    }

    .address-edit {
        width: 100upx;
        display: flex;
        align-items: center;

        view {
            width: 100%;
            text-align: center;
            display: block;
            padding: 10upx;
            border-left: 1px solid #666;
            font-size: 28upx;
            color: #666;
        }
    }

    .address-delete {
        width: 100upx;
        display: flex;
        align-items: center;

        view {
            width: 100%;
            text-align: center;
            display: block;
            padding: 10upx;
            font-size: 28upx;
            color: #666;
        }
    }

    /*收件人列表 end*/

    .add-address {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 80upx;
        line-height: 80upx;
        text-align: center;
        color: #fff;
        background-color: red;
        font-size: 30upx;
    }
</style>
