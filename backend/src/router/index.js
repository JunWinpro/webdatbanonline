import express from "express";
import renewAccessToken from "./routes/renewAcessToken.route.js";
import userRoute from "./routes/user.route.js";
import managerRoute from "./routes/manager.route.js";
import menuRoute from "./routes/menu.route.js";
import employeeRoute from "./routes/employee.route.js";
import bookingRoute from "./routes/booking.route.js";
import billRoute from "./routes/bill.route.js";
import restaurantRoute from "./routes/restaurant.route.js";
import reviewRoute from "./routes/review.route.js";
import dataResponse from "../dataResponse/data.response.js";

const rootRouter = express.Router();
rootRouter.get('/', (_, res) => {
    const message = 'Taste Tripper 2024 Services'
    dataResponse(res, 200, message)
})
rootRouter.use('/renew-access-token', renewAccessToken)
rootRouter.use('/users', userRoute);
rootRouter.use('/reviews', reviewRoute);
rootRouter.use('/restaurants', restaurantRoute);
rootRouter.use('/bills', billRoute);
rootRouter.use('/bookings', bookingRoute);
rootRouter.use('/employees', employeeRoute);
rootRouter.use('/menus', menuRoute);
rootRouter.use('/managers', managerRoute);

export default rootRouter 