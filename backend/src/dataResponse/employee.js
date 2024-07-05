const employeeResponse = (data) => {
    let responseData = null
    if (data) {
        responseData = data.toObject()
        delete responseData.password
        delete responseData.isDeleted
    }
    return responseData
}

export default employeeResponse