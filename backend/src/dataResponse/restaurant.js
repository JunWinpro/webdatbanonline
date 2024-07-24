const restaurantResponse = (data) => {
    let responseData = null
    if (data) {
        if (typeof (data) !== 'object') responseData = data.toObject()
        else responseData = data
        delete responseData.manager
        delete responseData.isDeleted
    }
    return responseData
}

export default restaurantResponse