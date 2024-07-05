const dataResponse = (res, statusCode, message, data) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data: data || null
    })
}
export default dataResponse