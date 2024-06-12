const sortModelType = (type) => {
    if (type === 'asc') {
        return 1
    }
    if (type === 'desc') {
        return -1
    }
}

export default sortModelType