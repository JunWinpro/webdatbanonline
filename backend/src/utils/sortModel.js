const sortModelType = (type) => {
    if (type === 'asc') {
        return 1
    }
    else if (type === 'desc') {
        return -1
    }
    else throw new Error("Sort type is incorrect")
}

export default sortModelType