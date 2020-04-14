const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"

//获取轮播图数据
export async function getSwiperData() {
    let [err,success] = await uni.request({
        url: baseUrl + "/home/swiperdata",
        method: "GET"
    })
    return success
}

//获取分类导航数据
export async function getCateData() {
    let [err,success] = await uni.request({
        url: baseUrl + "/home/catitems",
        method: "GET"
    })
    return success
}

//获取楼层数据
export async function getFloorData() {
    let [err,success] = await uni.request({
        url: baseUrl + "/home/floordata",
        method: "GET"
    })
    return success
}

//获取商品分类数据
export async function getCategoryData() {
    let [err,success] = await uni.request({
        url: baseUrl + "/categories",
        method: "GET"
    })
    return success
}

//获取商品搜索数据
export async function getGoodsSearchData(option = {}) {
    let [err,success] = await uni.request({
        url: baseUrl + "/goods/search" + `?query=${option.query}&cid=${option.cid}&pagenum=${option.pagenum}&pagesize=${option.pagesize}`,
        method: "GET",
        timeout: 5000
    })
    return success
}

//获取商品详细数据
export async function getGoodsDetailData(goodsId) {
    let [err,success] = await uni.request({
        url: baseUrl + "/goods/detail" + `?goods_id=${goodsId}`,
        method: "GET"
    })
    return success
}

//获取用户token
// export async function getUserToken(option = {}) {
//     console.log(option)
//     let [err,success] = await uni.request({
//         url: baseUrl + "/users/wxlogin",
//         method: "POST",
//         data: {
//             "encryptedData": option.encryptedData,
//             "rawData": option.rawData,
//             "iv": option.iv,
//             "signature": option.signature,
//             "code": option.code
//         }
//     })
//     return success
// }


//创建订单
export async function createOrder(token,orderPrice,consigneeAddr,orderArr) {
    let [err,success] = await uni.request({
        url: baseUrl + "/my/orders/create",
        method: "POST",
        header: {
            Authorization: token
        },
        data: {
            order_price: orderPrice,
            consignee_addr: consigneeAddr,
            goods: orderArr
        }
    })

    return success
}

//获取预支付参数
export async function getPayParam(token,orderNumber) {
    let [err,success] = await uni.request({
        url: baseUrl + "/my/orders/req_unifiedorder",
        method: "POST",
        header: {
            Authorization: token
        },
        data: {
            order_number: orderNumber
        }
    })
    return success
}

