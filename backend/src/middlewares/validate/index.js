import employeeValidateData from './employee/employee.js';
import menuValidateData from './menu/menu.js';
import objectIdValidate from './params/objectId.js';
import restaurantValidateData from './restaurant/restaurant.js';
import userValidateData from './user/user.js';
const validateData = {
    objectId: objectIdValidate,
    user: userValidateData,
    employee: employeeValidateData,
    restaurant: restaurantValidateData,
    menu: menuValidateData
}

export default validateData