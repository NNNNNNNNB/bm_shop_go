<template>
    <view class="edit-address">
        <form @submit="formSubmit" @reset="formReset">
            <view class="name">
                <input :value="userName" ref="nameInput" placeholder="收件人昵称" name="userName" class="name-input" confirm-type="next" type="text" maxlength="8" minlength="2"/>
            </view>
            <view class="phone">
                <input :value="userPhone" ref="phoneInput" placeholder="联系人手机号" name="userPhone" class="phone-input" confirm-type="next" type="number" maxlength="11" minlength="11"/>
            </view>

            <picker-address @regionData="getRegionData">
                <view class="address">
                    <view class="address-left">
                        <view class="province">{{province}}</view>
                        <view class="city">{{city}}</view>
                        <view class="area">{{area}}</view>
                    </view>
                    <view class="address-right">
                        <view class="font">></view>
                    </view>
                </view>
            </picker-address>

            <view class="detailed-address">
                <input :value="userDetailedAddress" ref="detailedAddressInput" placeholder="详细地址街道" name="userDetailedAddress" class="address-input" confirm-type="next" type="text"/>
            </view>

            <view class="postal-code">
                <input :value="postalCode" name="postalCode" placeholder="邮政编码" class="postal-input" confirm-type="next" type="number" maxlength="6" minlength="6">
            </view>

            <view class="button-bottom">
                <view class="button-style">
                    <button form-type="submit" type="warn">保存地址</button>
                </view>
                <view class="button-style">
                    <!-- #ifdef H5 -->
                    <button @click="formReset">重置表单</button>
                    <!-- #endif -->

                    <!-- #ifdef MP -->
                    <button form-type="reset">重置表单</button>
                    <!-- #endif -->
                </view>
            </view>
        </form>
    </view>
</template>

<script>
    import pickerAddress from "@/components/pickerAddress/pickerAddress";
    export default {
        name: "editAddress",
        data() {
            return {
                //修改或增加
                isEdit: false,
                editIndex: 0,

                //收件人姓名、电话、街道地址
                userName: '',
                userPhone: '',
                userDetailedAddress: '',

                //省、市、区、邮编
                province: '省',
                city: '市',
                area: '区',
                postalCode: '',

                //是否为默认地址
                isDefaultAddress: false

            }
        },
        onLoad(params) {
            if (params.editIndex) {
                this.isEdit = true
                this.editIndex = params.editIndex
                let addressList = []
                let addressInfo = {}
                addressList = uni.getStorageSync("receivingAddress")
                addressInfo = addressList[params.editIndex]

                this.userName = addressInfo.userName
                this.userPhone = addressInfo.userPhone
                this.userDetailedAddress = addressInfo.userDetailedAddress
                this.province = addressInfo.province
                this.city = addressInfo.city
                this.area = addressInfo.area
                this.postalCode = addressInfo.postalCode
                this.isDefaultAddress = addressInfo.isDefaultAddress
            }
        },
        components: {
            pickerAddress
        },
        methods: {
            //表单发送事件
            formSubmit(e) {
                //将当前新添加的地址保存为对象
                let userInfo = {
                    userName: e.detail.value.userName,
                    userPhone: e.detail.value.userPhone,
                    userDetailedAddress: e.detail.value.userDetailedAddress,
                    postalCode: e.detail.value.postalCode,
                    province: this.province,
                    city: this.city,
                    area: this.area,
                    isDefaultAddress: this.isDefaultAddress

                }

                //判断是否为第一次添加地址，为空则是
                let addressList = uni.getStorageSync("receivingAddress")
                if(addressList == '' || addressList == null) {
                    addressList = []
                }
                //将当前收货信息存入列表，再将列表放入本地缓存
                if (this.isEdit) {
                    addressList[this.editIndex] = userInfo
                }else {
                    addressList.push(userInfo)
                }

                uni.setStorageSync("receivingAddress",addressList)
                uni.navigateBack({
                    delta: 1
                })
            },
            //表单重置
            //#ifdef H5
            formReset() {
                this.$refs.nameInput.inputValue = ''
                this.$refs.phoneInput.inputValue = ''
                this.$refs.detailedAddressInput.inputValue = ''
                this.province = '省'
                this.city = '市'
                this.area = '区'
                this.postalCode = ''
            },
            //#endif

            //#ifdef MP
            formReset() {
                this.province = '省'
                this.city = '市'
                this.area = '区'
            },
            //#endif
            //获取地区选择器传来的数据
            getRegionData(province,city,area,postalCode) {
                this.province = province
                this.city = city
                this.area = area
                this.postalCode = postalCode
            }
        }
    }
</script>

<style lang="less" scoped>

    /*#ifdef H5*/
    page {
        background-color: #eee;
    }
    /*#endif*/

    /*#ifdef MP*/
    .edit-address {
        height: 100vh;
        background-color: #eee;
    }
    /*#endif*/

    .name {
        background-color: #fff;
        padding: 20upx 30upx;
        border-bottom: 1px solid #666;
    }

    .phone {
        margin-top: 20upx;
        background-color: #fff;
        padding: 20upx 30upx;
        border-bottom: 1px solid #666;
    }

    /*地区选择器 start*/
    .address {
        display: flex;
        margin-top: 20upx;
        padding: 40upx 20upx;
        background-color: #fff;
        border-bottom: 1px solid #666;
        font-size: 32upx;

        .address-left {
            flex: 5;
        }

        .address-right {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;

        }
    }
    /*地区选择器 end*/

    .detailed-address {
        background-color: #fff;
        padding: 20upx 30upx;
        border-bottom: 1px solid #666;
    }

    .postal-code {
        background-color: #fff;
        padding: 20upx 30upx;
        border-bottom: 1px solid #666;
    }

    .button-bottom {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .button-style {
        margin-top: 10upx;
        padding: 0 20upx;
    }
</style>
