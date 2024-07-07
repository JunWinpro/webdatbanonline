const returnError = (res, status, error) => {
    return res.status(status).json({
        message: error.message,
        success: false,
        data: null,
        error
    })
}

export default returnError