import employeeValidateData from './employee/employee.js';
import restaurantValidateData from './restaurant/restaurant.js';
import userValidateData from './user/user.js';
const validateData = {
    user: userValidateData,
    employee: employeeValidateData,
    restaurant: restaurantValidateData
}

export default validateData