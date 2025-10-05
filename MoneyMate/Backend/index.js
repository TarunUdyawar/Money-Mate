import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./Config/Database.js";
import router from "./Routes/TransactionsRoutes.js";
import job from "./cron.js";
dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "DELETE", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


if(process.env.NODE_ENV === 'production') job.start()

const PORT = process.env.PORT || 7000;

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/api/transactions",router)

app.listen(PORT, () => {
  console.log(`Server Running Successfully at http://localhost:${PORT}`);
  connectDB();
});
