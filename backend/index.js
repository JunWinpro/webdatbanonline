import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import rootRouter from "./src/router/index.js";
dotenv.config()
const app = express();
app.use(cors())
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World");
});
app.use(rootRouter)
app.listen(process.env.PORT || 8000, () => {
    console.log(`App is running on ${process.env.PORT || 8000}`);
});