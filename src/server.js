import express from "express";
import Stripe from "stripe";
import bodyParser from "body-parser";
import dotenv from "dotenv";

const app = express();
const PORT = process.env.PORT || 4000;

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const URL = process.env.URL;

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

const stripe = new Stripe(stripeSecretKey);

app.use(bodyParser.json());
app.use(express.static("public")); // serve static assets, including success and cancel pages

// Tworzenie sesji Stripe
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
      success_url: `http://${URL}/order/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://${URL}/cancel.html`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("❌ Error creating checkout session:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Returns customer details for success.html
app.get("/order/success", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    const customer = await stripe.customers.retrieve(session.customer);

    res.json({
      name: customer.name || "klient",
      email: customer.email,
    });
  } catch (err) {
    console.error("❌ Error retrieving session:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

