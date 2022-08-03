import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

import axios from "axios";

const CheckoutForm = ({ title, total }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [completed, setCompleted] = useState(false);
  const handlePayment = async (event) => {
    try {
      event.preventDefault();
      const cardInfos = elements.getElement(CardElement);
      const stripeResponse = await stripe.createToken(cardInfos);
      console.log(stripeResponse);

      const response = await axios.post(
        "https://lereacteur-vinted-api.herokuapp.com/payment",
        {
          // stripeToken: stripeResponse.token.id,
          title: title,
          amount: total,
          token: stripeResponse.token.id,
        }
      );
      if (response.data.status === "succeeded") {
        console.log("paiement réussi !");
        setCompleted(true);
      }
    } catch (error) {}
  };
  return (
    <div>
      {completed ? (
        <h1>Paiement confirmé !</h1>
      ) : (
        <form onSubmit={handlePayment}>
          <CardElement />
          <button type="submit">Payer</button>
        </form>
      )}
    </div>
  );
};

export default CheckoutForm;
