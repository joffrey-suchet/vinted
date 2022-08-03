import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Offer = () => {
  const { offerId } = useParams();
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOffer = async () => {
      const response = await axios.get(
        `https://lereacteur-vinted-api.herokuapp.com/offer/${offerId}`
      );
      // console.log(response.data);
      setData(response.data);
      setIsLoading(false);
    };
    fetchOffer();
  }, [offerId]);

  return isLoading === true ? (
    <div>En cours de chargement</div>
  ) : (
    <div>
      <div>
        <img src={data.product_image.url} alt="" />
      </div>
      <div className="card">
        <div>
          <div>
            <h2>{data.product_price} €</h2>
          </div>
          {data.product_details.map((detail) => {
            //   console.log(detail);
            const keys = Object.keys(detail);
            return (
              <ul className="details">
                <li>
                  <span>{keys[0]} :</span>
                  <span>{detail[keys[0]]}</span>
                </li>
              </ul>
            );
          })}
        </div>
        <div>
          <h2>{data.product_name}</h2>
          <p>{data.product_description}</p>
          <div>
            <img
              className="idPicture"
              src={data.owner?.account?.avatar?.url}
              alt=""
            />
            <p></p>
          </div>
          <Link
            to="/payment"
            state={{
              price: data.product_price,
              picture: data.product_image.url,
              title: data.product_name,
            }}
          >
            <button>Acheter</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Offer;
