import express from "express";
import cors from "cors";
import workerRoutes from "./routes/workerRoutes.js";
import tipRoutes from "./routes/tipRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { supabase } from "./config/supabase.js";
import stripe from "./config/stripe.js";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());

// & "C:\Users\USER\AppData\Local\Microsoft\WinGet\Packages\Stripe.StripeCli_Microsoft.Winget.Source_8wekyb3d8bbwe\stripe.exe" listen --forward-to localhost:3000/api/payments/webhook

// Stripe webhook MUST come before express.json()
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (error) {
      console.error("Webhook signature verification failed:", error.message);
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    console.log("Stripe event received:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const tipId = session.metadata?.tip_id;

      if (!tipId) {
        console.error("No tip_id found in Stripe metadata");
        return res.sendStatus(400);
      }

      const { error } = await supabase
        .from("tips")
        .update({
          status: "completed",
          stripe_payment_intent_id: session.payment_intent,
        })
        .eq("id", tipId);

      if (error) {
        console.error("Failed to update tip:", error);
        return res.sendStatus(500);
      }

      console.log(`Tip ${tipId} marked as completed`);
    }

    res.json({ received: true });
  },
);

// Normal JSON parsing for the rest of the API
app.use(express.json());

// Use the worker, tip, and payment routes
app.use("/api/workers", workerRoutes);
app.use("/api/tips", tipRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Tip MGT API is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
