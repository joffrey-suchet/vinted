import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Publish = ({ token }) => {
  const navigate = useNavigate();

  //   console.log(token);
  const [picture, setPicture] = useState(null);
  const [title, setTitle] = useState("basket");
  const [description, setDescription] = useState("sport");
  const [mark, setMark] = useState("nike");
  const [size, setSize] = useState("42");
  const [color, setColor] = useState("rouge et blanc");
  const [localisaton, setLocalisation] = useState("paris");
  const [etat, setEtat] = useState("neuf");
  const [price, setPrice] = useState(150);
  const [data, setData] = useState(null);
  const [isPictureSending, setIsPictureSending] = useState(false);

  const handleSend = async (event) => {
    event.preventDefault();
    setIsPictureSending(true);

    const formData = new FormData();
    formData.append("picture", picture);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("mark", mark);
    formData.append("size", size);
    formData.append("color", color);
    formData.append("localisation", localisaton);
    formData.append("etat", etat);
    formData.append("price", price);

    try {
      const response = await axios.post(
        "https://lereacteur-vinted-api.herokuapp.com/offer/publish",
        formData,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      setData(response.data);
      setIsPictureSending(false);
      navigate(`/offer/${response.data._id}`);
    } catch (error) {}
  };
  return (
    <div className="publish">
      <h2>Vends ton articles</h2>
      <form onSubmit={handleSend}>
        <div>
          <input
            type="file"
            onChange={(event) => {
              console.log(event.target.files[0]);
              setPicture(event.target.files[0]);
            }}
          />
        </div>
        {isPictureSending === true ? (
          <h1>Image en cours de chargement</h1>
        ) : (
          data && (
            <img
              src={data.secure_url}
              style={{ width: "200px" }}
              alt="offer_picture"
            />
          )
        )}
        <div>
          <p>Titre</p>
          <input
            type="text"
            placeholder="ex: Chemise"
            onChange={(event) => setTitle(event.target.value)}
            value={title}
          />
          <p>Décris ton article</p>
          <input
            type="text"
            placeholder="ex: porté quelquefois, taille correctement"
            onChange={(event) => setDescription(event.target.value)}
            value={description}
          />
        </div>
        <div>
          <p>Marque</p>
          <input
            type="text"
            placeholder="ex: Zara"
            onChange={(event) => setMark(event.target.value)}
            value={mark}
          />
          <p>Taille</p>
          <input
            type="text"
            placeholder="ex: L / 40 / 12"
            onChange={(event) => setSize(event.target.value)}
            value={size}
          />
          <p>Couleur</p>
          <input
            type="text"
            placeholder="ex: rouge"
            onChange={(event) => setColor(event.target.value)}
            value={color}
          />
          <p>Etat</p>
          <input
            type="text"
            placeholder="ex: neuf avec étiquette"
            onChange={(event) => setEtat(event.target.value)}
            value={etat}
          />
          <p>Lieu</p>
          <input
            type="text"
            placeholder="ex: Paris"
            onChange={(event) => setLocalisation(event.target.value)}
            value={localisaton}
          />
        </div>
        <div>
          <p>Prix</p>
          <input
            type="text"
            placeholder="0.00€"
            onChange={(event) => setPrice(event.target.value)}
            value={price}
          />
          <input type="checkbox" />
          <span>Je suis intéréssé(e) par les échanges</span>
        </div>
        <input type="submit" value="Ajouter" />
      </form>
    </div>
  );
};

export default Publish;
