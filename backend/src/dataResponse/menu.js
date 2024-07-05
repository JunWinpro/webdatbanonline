const menuResponse = (data) => {
    let responseData = null
    if (data) {
        responseData = data.toObject()
        delete responseData.manager
    }
    return responseData
}
export default menuResponse