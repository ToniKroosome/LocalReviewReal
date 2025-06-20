## Payment Setup

Shop owners can edit the PayPal address used for receiving payments directly on the shop detail page. After entering an address, click **Send Verification Code** to simulate sending an email with a one-time code. Entering the displayed code marks the address as verified and ready to receive funds.

## Buying Credits

Use the **Buy Credits** button in the header to open the payment page. Select QR code, Stripe, or PayPal and follow the prompts to complete payment. The QR option generates a PromptPay code for manual payment. Stripe payments display a card form powered by Stripe Elements for a professional checkout experience.

## Running the Stripe demo server

A minimal Express server is provided in `server/index.js` to create Stripe payment intents used by the card form.

```bash
npm install
node server/index.js
```

Set `STRIPE_SECRET_KEY` in your environment with your Stripe test secret key. The frontend expects the server at `http://localhost:4242`.