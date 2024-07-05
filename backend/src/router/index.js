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

const rootRouter = express.Router();
rootRouter.get('/', (_, res) => {
    res.send('Taste Tripper 2024')
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