import express from "express";
import cors from "cors";
import { supabase } from "./supabaseClient.js";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());



app.get("/", async (req, res) => {

    const { data, error } = await supabase.from("workers").select("*");

    if (error) {
        return res.status(500).json({ error: error.message });
    }
  res.json({
    message: "Tip MGT API is running",
    workers: data
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});