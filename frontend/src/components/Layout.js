import { Outlet, Link, useNavigate } from "react-router-dom";
import "./Layout.css"; // Pour les styles

function Layout() {
  const navigate = useNavigate();
  return (
    <div className="App">
      <div className="mainContainer">
        {/* Sidebar */}
        <div className="sidePanel">
          <div className="logoContainer">
            <img src="/GooseLogo.png" alt="Logo" />
          </div>
          <div className="menu">
            <ul>
              <li><Link to="/commandes">Commandes</Link></li>
              <li><Link to="/clients">Clients</Link></li>
              <li><Link to="/articles">Articles</Link></li>
              <li><Link to="/stock">Stock</Link></li>
              <li><Link to="/reception">Récéption</Link></li>
            </ul>
          </div>
        </div>

        {/* Contenu dynamique en fonction de la route */}
        <div className="mainPanel">
          <Outlet /> {/* Les pages changeront ici */}
        </div>
      </div>
    </div>
  );
}

export default Layout;
