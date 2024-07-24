const restaurantInfoResponse = (data, user) => {
    let responseData = null
    if (data) {
        if (typeof (data) !== 'object') responseData = data.toObject()
        else responseData = data
        delete responseData.isDeleted
        if (user?.userId !== responseData.restaurant.manager || !user) {
            delete responseData.restaurant.manager
            delete responseData.restaurant.isDeleted
        }
    }
    return responseData
}

export default restaurantInfoResponse