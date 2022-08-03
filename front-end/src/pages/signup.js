import axios from "axios";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = (setUser) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newsletter, setNewsletter] = useState(false);

  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");

  const handleSignup = async (event) => {
    try {
      event.preventDefault();
      setErrorMessage("");

      const response = await axios.post(
        "https://lereacteur-vinted-api.herokuapp.com/user/signup",
        {
          email: email,
          username: username,
          password: password,
          newsletter: newsletter,
        }
      );
      if (response.data) {
        console.log("J'ai reussi à créer un compte !");
        setUser(response.data.token);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 409) {
        setErrorMessage("cet email a déjà un compte !");
      }
    }
  };

  return (
    <div className="form">
      <div>
        <h1>S'inscrire</h1>
      </div>
      <form className="input" onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <div>
          <input
            type="checkbox"
            placeholder="test"
            value={newsletter}
            onChange={(event) => setNewsletter(event.target.checked)}
          />
          <span>S'inscrire à notre newsletter</span>
        </div>
        <p>
          En m'inscrivant je confirme avoir lu et accepté les Termes &
          Conditions et Politique de Confidentialité de Vinted. Je confirme
          avoir au moins 18 ans.
        </p>
        <input type="submit" value="S'inscrire" />
        <p style={{ color: "red" }}>{errorMessage}</p>
      </form>
    </div>
  );
};

export default Signup;
