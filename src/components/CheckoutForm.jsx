import React, { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const CheckoutForm = ({ user = {}, onSuccess = () => {} }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [amount, setAmount] = useState(10);
  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const name = user?.displayName || "Anonymous";
  const email = user?.email || "anonymous@example.com";

  // Create payment intent on amount change
  useEffect(() => {
    if (amount > 0) {
      axios
        .post("https://blood-donation-server-iota-flame.vercel.app/create-payment-intent", { amount })
        .then((res) => {
          setClientSecret(res.data.clientSecret);
        })
        .catch((err) => {
          console.error("Error creating payment intent", err);
        });
    }
  }, [amount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError("");
    setSuccess("");

    if (!stripe || !elements || !clientSecret) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          name,
          email,
        },
      },
    });

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
      return;
    }

    // Payment succeeded
    if (paymentIntent.status === "succeeded") {
      setSuccess("Payment successful!");
      setProcessing(false);

      // Save funding to DB
      try {
        await axios.post("https://blood-donation-server-iota-flame.vercel.app/fundings", {
          name,
          email,
          amount,
          transactionId: paymentIntent.id,
        });

        onSuccess(); // Refresh list and close form
      } catch (err) {
        console.error("Error saving fund to DB", err);
        setError("Payment succeeded but failed to save data.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 space-y-4 bg-white rounded shadow"
    >
      <div>
        <label className="block mb-1 font-medium">Amount (USD)</label>
        <input
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="border px-3 py-2 rounded w-full"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Card Info</label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#32325d",
                fontFamily: "Arial, sans-serif",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#fa755a",
              },
            },
          }}
          className="border p-3 rounded bg-white"
        />
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <button
        type="submit"
        disabled={!stripe || !clientSecret || processing}
        className={`w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition ${
          processing ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {processing ? "Processing..." : `Pay $${amount}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
