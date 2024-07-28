const menuResponse = (data) => {
    let responseData = null
    if (data) {
        if (typeof data.toObject === 'function') {
            responseData = data.toObject();
        } else {
            responseData = data;
        }
        delete responseData.manager
    }
    return responseData
}
export default menuResponse