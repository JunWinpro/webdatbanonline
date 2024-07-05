const messages = {
    name: {
        'any.required': "Name is required",
        'string.pattern.base': "Name can't contain special characters",
        'string.min': "Name must have at least one character",
        'string.empty': "Name can't be empty"
    },

    address: {
        address: {
            'object.base': "Address is object and must include streetAddress, district, and city",
            'any.required': "Address is required",
        },
        streetAddress: {
            'any.required': "Street address is required",
            'string.min': "Street address must have at least one character",
            'string.empty': "Street address can't be empty"
        },
        district: {
            'any.required': "District is required",
            'string.min': "District must have at least one character",
            'string.empty': "District can't be empty",
            'string.pattern.base': "District can't have special character or number"
        },
        city: {
            'any.required': "City is required",
            'string.min': "City must have at least one character",
            'string.empty': "City can't be empty",
            'string.pattern.base': "City can't have special character or number"
        },
    },

    category: {
        'any.required': "Category is required",
        'string.empty': "Category can't be empty",
        'string.alphanum': "Category must not include special characters or spaces"
    },

    totalTable: {
        'any.required': "Total table is required",
        'number.base': "Total table must be a number",
        'number.empty': "Total table can't be empty",
        'number.min': "Total table must be at least 1",
        'number.integer': "Total table must be an integer"
    },

    maxim: {
        'any.required': "Restaurant maxim is required",
        'string.empty': "Restaurant maxim can't be empty"
    },

    description: {
        description: {
            'object.base': "Description element is object and must include both title and content",
            'any.required': "Description is required",
            'array.base': "Description is an array that includes object with title and content"
        },

        title: {
            'any.required': "Title is required",
            'string.empty': "Title can't be empty",
            'string.pattern.base': "Title can't have special characters"
        },

        content: {
            'any.required': "Content is required",
            'string.empty': "Content can't be empty",
            'string.pattern.base': "Content can't have special characters"
        }
    },
    schedule: {
        schedule: {
            'any.required': "Schedule is required",
            'array.unique': "Day of the week is duplicated",
            'array.base': "Schedule is an array of objects with dayOfWeek, isWorkingDay, openTime and closeTime"
        },

        isWorkingDay: {
            'any.required': "Working day is required",
            'boolean.base': "Working day must be a boolean",
            'boolean.empty': "Working day can't be empty"
        },

        dayOfWeek: {
            'number.base': "Day of the week is a number from 0 to 6 (Sunday to Saturday)",
            'number.min': "Day of the week minimum is 0",
            'number.max': "Day of the week maximum is 6",
            'any.required': "Day of the week is required"
        },

        openTime: {
            'number.base': "Open time is a number for hour",
            'number.min': "Open time minimum is 0",
            'number.max': "Open time maximum is less than 24",
            'any.required': "Open time is required"
        },

        closeTime: {
            'number.base': "Close time is a number",
            'number.min': "Close time minimum is 0",
            'number.max': "Close time maximum is less than 24",
            'any.required': "Close time is required"
        },
    },

    description: {
        description: {
            'array.base': "Description must be an array of objects with title and content",
            'object.base': "Missing title or content"
        },
        title: {
            'string.empty': "Title can't be empty",
            'any.required': "Title is required"
        },
        content: {
            'string.empty': "Content can't be empty",
            'any.required': "Content is required"
        }
    },
}

export default messages