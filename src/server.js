
import express from "express";
import Stripe from "stripe";
import bodyParser from "body-parser";
import dotenv from "dotenv";

const app = express();
const PORT = 4000;

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

const stripe = new Stripe(stripeSecretKey);

app.use(bodyParser.json());
app.use(express.static("public")); // 

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { priceId } = req.body; 
    console.log("📦 priceId:", priceId);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId, 
          quantity: 1,
        },
      ],
      success_url: "/success.html?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "/cancel.html",
      subscription_data: {
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("❌ Error creating checkout session:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
