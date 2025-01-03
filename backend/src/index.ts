import express from "express";
import 'dotenv/config'
import connectDB from "./config/db";
import env from "./config/env";
import morgan from "morgan";
import cors from "cors";
import userRouter from "./routes/userRouter";
import summaryRouter from "./routes/summaryRouter";
import questionsRouter from "./routes/questionsRouter";
// import ngrok from "@ngrok/ngrok";

const app = express();
app.use(morgan("dev"));
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(env.API_PREFIX)

app.get("/hello", (req, res) => {
  res.send("Hello World!");
})

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
})

app.use("/api/auth", userRouter);
app.use("/api/summarize", summaryRouter)
app.use("/api/questions", questionsRouter)
// Errors handler
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? null : error.stack,
  });
})


app.listen(env.PORT, async () => {
  console.log("Server is running on port 3000");
  await connectDB();
});

// // Get your endpoint online
// ngrok.connect({ addr: 3000, authtoken_from_env: true })
// 	.then(listener => console.log(`Ingress established at: ${listener.url()}`));