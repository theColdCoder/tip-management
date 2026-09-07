import express from "express";
import stripe from "../config/stripe.js";
import { supabase } from "../config/supabase.js";

const router = express.Router();

//
router.post("/checkout", async (req, res) => {
  try {
    const { workerId, amount } = req.body;

    if (!workerId || !amount) {
      return res.status(400).json({
        error: "Worker and amount are required",
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        error: "Amount must be greater than zero",
      });
    }

    // 1. Create pending tip
    const { data: tip, error: tipError } = await supabase
      .from("tips")
      .insert({
        worker_id: workerId,
        amount: Number(amount),
        currency: "USD",
        status: "pending",
      })
      .select()
      .single();

    if (tipError) {
      console.error("Tip creation error:", tipError);

      return res.status(500).json({
        error: tipError.message,
      });
    }

    // 2. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",

            product_data: {
              name: "Tip",
            },

            unit_amount: Math.round(Number(amount) * 100),
          },

          quantity: 1,
        },
      ],

      success_url: "http://localhost:5173/tip/success",

      cancel_url: "http://localhost:5173/tip/cancel",

      metadata: {
        tip_id: tip.id.toString(),
        worker_id: workerId.toString(),
      },
    });

    // 3. Save Stripe session ID
    await supabase
      .from("tips")
      .update({
        stripe_session_id: session.id,
      })
      .eq("id", tip.id);

    // 4. Send checkout URL to React
    res.status(201).json({
      checkoutUrl: session.url,
    });
  } catch (error) {
    console.error("Checkout error:", error);

    res.status(500).json({
      error: "Unable to create checkout session",
    });
  }
});

export default router;
