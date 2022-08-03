import logo from "../images/logo.svg";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ token, setUser }) => {
  const navigate = useNavigate();

  return (
    <header>
      <Link to="/">
        <div>
          <img src={logo} alt="logo" />
        </div>
      </Link>
      <div>
        <input type="text" />
      </div>
      {token === null ? (
        <div>
          <Link className="signup" to="/signup">
            <button>S'inscrire</button>
          </Link>
          <Link className="login" to="/login">
            <button>Se connecter</button>
          </Link>
        </div>
      ) : (
        <button
          onClick={() => {
            setUser(null);
            navigate("/");
          }}
        >
          Se déconnecter
        </button>
      )}

      <div>
        <button
          onClick={() => {
            if (token === null) {
              navigate("/");
            } else {
              navigate("/publish");
            }
          }}
        >
          Vend tes articles
        </button>
      </div>
    </header>
  );
};

export default Header;
