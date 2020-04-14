<template>
    <view class="picker-address">
        <!-- #ifdef H5 -->
        <picker
            mode="multiSelector"
            :range="address"
            range-key="label"
            :value="customIndex"
            @columnchange="columnChange"
            @change="sendData"
            @cancel="close">
            <slot></slot>
        </picker>
        <!-- #endif -->

        <!-- #ifdef MP -->
        <picker
            mode="region"
            :value="mpValue"
            @change="mpSendData">
            <slot></slot>
        </picker>
        <!-- #endif -->
    </view>
</template>

<script>
    import provinceData from "./addressData/province";
    import cityData from "./addressData/city";
    import areaData from "./addressData/area";

    export default {
        name: "pickerAddress",
        data() {
            return {
                //#ifdef H5
                //选择器数据
                address: [
                    [],
                    [],
                    []
                ],
                customIndex: [0,0,0],
                //滑动选择的省、市、区
                provinceListIndex:0,
                cityListIndex:0,
                areaListIndex:0,
                //#endif

                //#ifdef MP
                //微信平台
                mpValue: []

                //#endif

            }
        },
        created() {
            //#ifdef H5
            this.address[0] = provinceData
            this.address[1] = cityData[this.cityListIndex]
            this.address[2] = areaData[this.cityListIndex][this.areaListIndex]
            //#endif
        },
        methods: {
            //#ifdef H5
            //滑动时列值改变则触发
            columnChange(e) {
                switch (e.detail.column) {
                    case 0: {
                        this.cityListIndex = e.detail.value
                        this.address[1] = cityData[this.cityListIndex]
                        this.address[2] = areaData[this.cityListIndex][this.areaListIndex]
                        break
                    }
                    case 1: {
                        this.areaListIndex = e.detail.value
                        this.address[2] = areaData[this.cityListIndex][this.areaListIndex]
                        break
                    }
                }
            },
            //确定按钮，将选中的区域传递给父组件，传递数据为：省、市、区、邮政编码
            sendData(e) {
                let letCustomIndex = e.detail.value
                let province = this.address[0][letCustomIndex[0]].label
                let city = this.address[1][letCustomIndex[1]].label
                let area = this.address[2][letCustomIndex[2]].label
                let postalCode = this.address[2][letCustomIndex[2]].value
                this.$emit('regionData',province,city,area,postalCode)


                this.customIndex = [0,0,0]
                this.address[0] = provinceData
                this.address[1] = cityData[this.customIndex[1]]
                this.address[2] = areaData[this.customIndex[1]][this.customIndex[2]]

            },
            //关闭触发，恢复初始状态
            close() {
                this.customIndex = [0,0,0]
                this.address[0] = provinceData
                this.address[1] = cityData[this.customIndex[1]]
                this.address[2] = areaData[this.customIndex[1]][this.customIndex[2]]
            },
            //#endif

            //#ifdef MP
            //小程序平台value改变触发事件
            mpSendData(e) {
                let province = e.detail.value[0]
                let city = e.detail.value[1]
                let area = e.detail.value[2]
                let postalCode = e.detail.postcode
                this.$emit('regionData',province,city,area,postalCode)
            }

            //#endif
        }
    }
</script>

<style scoped>

</style>
