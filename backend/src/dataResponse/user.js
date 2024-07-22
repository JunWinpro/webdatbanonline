const userResponse = (data) => {
    let responseData = null;
    if (data) {
        responseData = data.toObject()
        delete responseData.password
        delete responseData.isDeleted
        delete responseData.resetPassworken
        delete responseData.resetPasswordExpireIn
        delete responseData.veryficationToken
    }
    return { userInfo: responseData }
}

export default userResponse