const userResponse = (data) => {
    let responseData = null;
    if (data) {
        if (typeof (data) !== 'object') responseData = data.toObject()
        else responseData = data
        delete responseData.password
        delete responseData.isDeleted
        delete responseData.resetPassworken
        delete responseData.resetPasswordExpireIn
        delete responseData.veryficationToken
    }
    return { userInfo: responseData }
}

export default userResponse