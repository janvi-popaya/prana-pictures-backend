import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import routes from "./routes/routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";


const app=express();

app.use(express.json({limit:"1mb"}));
app.use(helmet());
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}));
app.use(morgan("dev"));
routes(app);    
app.use(errorHandler);

export default app;
