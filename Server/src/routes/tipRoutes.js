import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

// Get /api/tips/:id

router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("tips")
      .select(
        `
        id,
        amount,
        currency,
        status,
        stripe_session_id,
        stripe_payment_intent_id,
        created_at,
        worker:workers (
          id,
          name
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tips:", error);

      return res.status(500).json({
        error: error.message,
      });
    }

    res.json(data);
  } catch (error) {
    console.error("Server error:", error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Post /api/tips
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
