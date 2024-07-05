const restaurantInfoResponse = (data, user) => {
    let responseData = null
    if (data) {
        responseData = data.toObject()
        delete responseData.isDeleted
        if (user?.userId !== responseData.restaurant.manager || !user) {
            delete responseData.restaurant.manager
            delete responseData.restaurant.isDeleted
        }
    }
    return responseData
}

export default restaurantInfoResponse