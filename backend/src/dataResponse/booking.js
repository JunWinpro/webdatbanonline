const bookingResponse = (data) => {
    let responseData = null
    if (data) {
        responseData = data.toObject()
        delete responseData.isDeleted
    }
    return responseData
}
export default bookingResponse