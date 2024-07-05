const restaurantResponse = (data) => {
    let responseData = null
    if (data) {
        responseData = data.toObject()
        delete responseData.manager
        delete responseData.isDeleted
    }
    return responseData
}

export default restaurantResponse