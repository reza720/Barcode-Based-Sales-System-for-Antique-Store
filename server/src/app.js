import express from "express";
import hpp from "hpp";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import router from "../src/routers/index.js";
import globalErrorHandler from "./middleware/globalErrorHandler.js";

const app = express();

app.use(express.json());
app.use(hpp());
app.use(helmet());
app.use(cookieParser());

app.use("/api", router);

app.use((req, res)=> {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

app.use(globalErrorHandler);

export default app;
