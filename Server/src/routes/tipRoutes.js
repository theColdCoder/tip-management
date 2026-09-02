import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { workerId, amount, currency } = req.body;

    if (!workerId || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (amount <= 0) {
      return res
        .status(400)
        .json({ error: "Amount must be greater than zero" });
    }

    const { data, error } = await supabase
      .from("tips")
      .insert({
        worker_id: workerId,
        amount: amount,
        currency: currency || "USD",
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Subabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data);
  } catch (error) {
    console.error("Error server:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
