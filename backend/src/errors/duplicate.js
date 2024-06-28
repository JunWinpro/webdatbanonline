const duplicateErr = (err) => {
    if (err?.code === 11000) {
        err.message = `${Object.keys(err.keyPattern)[0]} is already exist`
    }
    return err
}

export default duplicateErr