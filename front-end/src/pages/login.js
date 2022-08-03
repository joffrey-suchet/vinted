import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    try {
      const response = await axios.post(
        "https://lereacteur-vinted-api.herokuapp.com/user/login",
        { email: email, password: password }
      );
      if (response.data) {
        console.log("utilisateur connecter");
        // console.log(typeof response.data.token);
        Cookies.set("userToken", response.data.token, { expires: 3 });
        navigate("/");
      } else {
        console.log("Utilisateur non reconnue");
        setErrorMessage("Le compte ou le mot de passe est incorrect");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="loginSubmit">
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <input type="submit" value="Se connecter" />
        <p>{errorMessage}</p>
      </form>
    </div>
  );
};

export default Login;
