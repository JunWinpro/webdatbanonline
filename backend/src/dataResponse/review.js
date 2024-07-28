const reviewResponse = (data) => {
    let responseData = null
    if (data) {
        if (typeof data.toObject === 'function') {
            responseData = data.toObject();
        } else {
            responseData = data;
        }
        delete responseData.isDeleted
    }
    return responseData
}
export default reviewResponse