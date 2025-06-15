import { useState } from "react";
import { toast } from "react-toastify";

function ClientForm() {

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (window.api && typeof window.api.addClient === 'function') {
        await window.api.addClient({ is_active: true, });
        toast.success('Client ajouté.')

      } else {
        console.error("window.api.addClient is not available");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du client", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded">
      <h2>Nouveau client :</h2>
      <div className="mb-2">
        <label>Nom :</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-control"
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Ajouter Client
      </button>
    </form>
  );
};

export default ClientForm;
