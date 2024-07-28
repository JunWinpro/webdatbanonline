const employeeResponse = (data) => {
    let responseData = null
    if (data) {
        if (typeof data.toObject === 'function') {
            responseData = data.toObject();
        } else {
            responseData = data;
        }
        delete responseData.password
        delete responseData.isDeleted
    }
    return responseData
}

export default employeeResponse