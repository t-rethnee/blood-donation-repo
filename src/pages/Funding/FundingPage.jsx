import React, { useEffect, useState, useContext } from "react";
import FundTable from "../../components/FundTable";
import CheckoutForm from "../../components/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../../utils/stripePromise";
import axios from "axios";
import { AuthContext } from "../../provider/AuthProvider";

const FundingPage = () => {
  const { user } = useContext(AuthContext);
  const [funds, setFunds] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  const fetchFunds = async () => {
    try {
      const res = await axios.get("https://blood-donation-server-iota-flame.vercel.app/fundings");
      setFunds(res.data);
    } catch (error) {
      console.error("Failed to fetch funding history", error);
    }
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Fundings</h2>
        <button
          onClick={() => setShowCheckout(true)}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Give Fund
        </button>
      </div>

      {showCheckout ? (
        <Elements stripe={stripePromise}>
          <CheckoutForm
            user={user}
            onSuccess={() => {
              setShowCheckout(false);
              fetchFunds(); // Refresh funding list after successful payment
            }}
          />
        </Elements>
      ) : (
        <FundTable funds={funds} />
      )}
    </div>
  );
};

export default FundingPage;
