const billResponse = (data) => {
    let responseData = null
    if (data) {
        if (typeof data.toObject === 'function') {
            responseData = data.toObject();
        } else {
            responseData = data;
        }
    }
    return responseData
}

export default billResponse