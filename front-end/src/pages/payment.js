import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../composants/CheckoutForm";
import { Navigate, useLocation } from "react-router-dom";
const stripePromise = loadStripe(
  "pk_test_51HCObyDVswqktOkX6VVcoA7V2sjOJCUB4FBt3EOiAdSz5vWudpWxwcSY8z2feWXBq6lwMgAb5IVZZ1p84ntLq03H00LDVc2RwP"
);

const Payment = ({ token }) => {
  //   console.log(token);
  const location = useLocation();
  const { title } = location.state;
  const { price } = location.state;
  const { picture } = location.state;
  const deliveryCost = (Number(price) * 0.1).toFixed(2);
  const protectiveCost = (Number(price) * 0.05).toFixed(2);
  const total = (
    Number(price) +
    Number(protectiveCost) +
    Number(deliveryCost)
  ).toFixed(2);

  return token ? (
    <div className="payment">
      <h1>Paiement</h1>
      <img src={picture} alt="pictureOffer" style={{ width: "200px" }} />
      <h4>{title}</h4>

      <h4>Commande</h4>
      <span>{price} €</span>

      <h4>Frais protection acheteurs</h4>
      <span>{protectiveCost}</span>
      <h4>Frais de port</h4>
      <span>{deliveryCost}</span>
      <h3>total</h3>
      <span>{total}</span>
      <Elements stripe={stripePromise}>
        <CheckoutForm title={title} total={total} />
      </Elements>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default Payment;
