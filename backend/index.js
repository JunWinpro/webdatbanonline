import express from "express"
import dotenv from "dotenv"
import cors from "cors"
dotenv.config()
const app = express();
app.use(cors())
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(process.env.PORT || 8000, () => {
    console.log(`App is running on ${process.env.PORT || 8000}`);
});