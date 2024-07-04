const date = (checkinTime) => {
    const date = new Date(checkinTime)
    const minutes = date.getMinutes()
    const hour = date.getHours()
    const day = date.getDay()
    const second = date.getSeconds()

    return { minutes, hour, day, second }
}
export default date