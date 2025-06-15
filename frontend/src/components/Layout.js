import { Outlet, NavLink } from "react-router-dom";
import "./Layout.css"; // Pour les styles
import logo from '../assets/logovin.png';

function Layout() {
  return (
    <div className="App">
      <div className="mainContainer">
        {/* Sidebar */}
        <div className="sidePanel">
          <div className="logoContainer">
            <img src={logo} alt="Logo" />
          </div>
          <div className="menu">
            <ul>
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => isActive ? "active-link" : undefined}
                >
                  Tableau de bord
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/commandes"
                  className={({ isActive }) => isActive ? "active-link" : undefined}
                >
                  Commandes
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/clients"
                  className={({ isActive }) => isActive ? "active-link" : undefined}
                >
                  Clients
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/articles"
                  className={({ isActive }) => isActive ? "active-link" : undefined}
                >
                  Articles
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/stock"
                  className={({ isActive }) => isActive ? "active-link" : undefined}
                >
                  Stock
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/receptions"
                  className={({ isActive }) => isActive ? "active-link" : undefined}
                >
                  Récéptions
                </NavLink>
              </li>
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
