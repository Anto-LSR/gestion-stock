import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout"; // Le layout global
import Clients from "./pages/Clients"; // Pages à créer
import Articles from "./pages/Articles";
import Commandes from "./pages/Commandes";
import Stock from "./pages/Stock";
import { ToastContainer, toast } from 'react-toastify';
import ClientInfo from "./components/clients/ClientInfo";
import ArticleInfo from "./components/articles/ArticleInfo";
import CommandeInfo from "./components/commandes/CommandeInfo";
import Receptions from "./pages/Receptions";
import ReceptionInfo from "./components/receptions/ReceptionInfo";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="clients" element={<Clients />} />
          <Route path="clients/info/:id" element={<ClientInfo />} />
          <Route path="articles" element={<Articles />} />
          <Route path="articles/info/:id" element={<ArticleInfo />} />
          <Route path="commandes" element={<Commandes />} />
          <Route path="commandes/info/:id" element={<CommandeInfo />} />
          <Route path="stock" element={<Stock />} />
          <Route path="receptions" element={<Receptions />} />
          <Route path="receptions/info/:id" element={<ReceptionInfo />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Router>
  );
}

export default App;
