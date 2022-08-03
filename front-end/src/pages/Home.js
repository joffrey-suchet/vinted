import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import logo from "../images/logo.svg";
const Home = () => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await axios.get(
          "https://lereacteur-vinted-api.herokuapp.com/offers"
        );
        // console.log(response.data);
        setData(response.data);
        setIsLoading(false);
      };
      fetchData();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  return (
    <body>
      {isLoading === true ? (
        <h1>En cours de chargement</h1>
      ) : (
        <main>
          <section className="sort">
            <div className="start-offer">
              <h1>Prêts à faire du tri dans vos placards?</h1>
              <button>Commencer à vendre</button>
            </div>
          </section>
          <section className="all-offers">
            {data.offers.map((card, index) => {
              // console.log(card.owner.account.username);
              // console.log(card.product_image);
              return (
                <div key={index}>
                  <Link to={`/offer/${card._id}`}>
                    <div className="offer">
                      {card.owner ? (
                        <div className="seller">
                          <img
                            className="idPicture"
                            alt="offer"
                            src={card.owner?.account?.avatar?.secure_url}
                          />
                          <p>{card.owner.account.username}</p>
                        </div>
                      ) : (
                        <div className="seller">
                          <img className="idPicture" alt="offer" src={logo} />
                          <p>{"Vendeur Vinted"}</p>
                        </div>
                      )}

                      <div>
                        <img
                          className="offerPicture"
                          src={card.product_image.secure_url}
                          alt=""
                        />
                        <p>{card.product_price} €</p>
                        {card.product_details.map((detail, index) => {
                          return (
                            <div key={index}>
                              {detail.TAILLE && <p>{detail.TAILLE}</p>}
                              {detail.MARQUE && <p>{detail.MARQUE}</p>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </section>
        </main>
      )}
    </body>
  );
};

export default Home;
