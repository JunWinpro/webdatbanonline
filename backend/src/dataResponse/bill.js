const billResponse = (data) => {
    let responseData = null
    if (data) {
        if (typeof (data) !== 'object') responseData = data.toObject()
        else responseData = data
        console.log(data);
    }
    return responseData
}

export default billResponse