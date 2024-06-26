const returnError = (res, status, err) => {
    return res.status(status).json({
        message: err.message,
        success: false,
        data: null,
        err
    })
}

export default returnError