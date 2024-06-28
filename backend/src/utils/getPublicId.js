const getPublicId = (url) => {
    const arr = url.split('/')
    return arr.splice(7, arr.length - 1).join("/").split('.')[0]
}

export default getPublicId