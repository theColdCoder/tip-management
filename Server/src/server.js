import express from "express";
import cors from "cors";
import workerRoutes from "./routes/workerRoutes.js";
import tipRoutes from "./routes/tipRoutes.js";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/workers", workerRoutes);
app.use("/api/tips", tipRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Tip MGT API is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
