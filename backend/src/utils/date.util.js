const date = (checkinTime) => {
    const date = new Date(checkinTime)
    const minutes = date.getMinutes()
    const hour = date.getHours()
    const day = date.getDay()
    const second = date.getSeconds()
    const dateTime = date.getDate()
    const month = date.getMonth()
    return { minutes, hour, day, second, dateTime, month }
}
export default date