import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cookies from "js-cookie";

import Home from "./pages/Home";
import Offer from "./pages/Offer";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Header from "./composants/Header";
import Publish from "./pages/publish";
import Payment from "./pages/payment";

function App() {
  const [token, setToken] = useState(Cookies.get("userToken") || null);

  const setUser = (tokenToCheck) => {
    if (tokenToCheck !== null) {
      console.log("Création d'un cookie userToken");
      Cookies.set("userToken", tokenToCheck, { expires: 10 });
    } else {
      console.log("suppression d'un cookies userToken");
      Cookies.remove("userToken");
    }
    setToken(tokenToCheck);
  };
  console.log("token =>", token);

  return (
    <Router>
      {/* <nav>
        <Link className="Home" to="/">
          Home
        </Link>
        <br />
        <Link className="Offer" to="/offer">
          Offer
        </Link>
        <br />
        <Link className="signup" to="/signup">
          signup
        </Link>
      </nav> */}
      <Header token={token} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/offer/:offerId" element={<Offer />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/publish" element={<Publish token={token} />} />
        <Route path="/payment" element={<Payment token={token} />} />
      </Routes>
    </Router>
  );
}

export default App;
