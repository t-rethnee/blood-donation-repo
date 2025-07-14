import React, { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const FundCheckout = ({ user, amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");

  // ✅ Get real clientSecret from backend
  useEffect(() => {
    if (amount > 0) {
      axios
        .post("http://localhost:5000/create-payment-intent", { amount })
        .then((res) => setClientSecret(res.data.clientSecret));
    }
  }, [amount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    const card = elements.getElement(CardElement);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    });

    if (result.error) {
      alert("Payment failed: " + result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      // ✅ Save fund info in DB
      const fundInfo = {
        name: user?.displayName,
        email: user?.email,
        amount,
        transactionId: result.paymentIntent.id,
        date: new Date(),
      };
      await axios.post("http://localhost:5000/fundings", fundInfo);
      alert("Payment successful!");
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <CardElement className="border p-4 rounded-md bg-white" />
      <button
        type="submit"
        disabled={!stripe || !clientSecret}
        className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Pay ${amount}
      </button>
    </form>
  );
};

export default FundCheckout;
