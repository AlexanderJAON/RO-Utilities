import React, { useState } from "react";
import "./OperatorModal.css";

const OperatorModal = ({ onSubmit }) => {
  const [operatorName, setOperatorName] = useState("");
  const [shift, setShift] = useState("");

  const handleConfirm = () => {
    if (operatorName && shift) {
      onSubmit(operatorName, shift);
    } else {
      alert("Por favor, ingrese su nombre y seleccione un turno.");
    }
  };

  return (
    <div className="modal-container">
      <div className="modal-content">
        <h2>Ingrese sus datos</h2>
        <input
          type="text"
          placeholder="Nombre del operario"
          value={operatorName}
          onChange={(e) => setOperatorName(e.target.value)}
        />
        <select value={shift} onChange={(e) => setShift(e.target.value)}>
          <option value="">Seleccione un turno</option>
          <option value="mañana">Mañana</option>
          <option value="tarde">Tarde</option>
          <option value="noche">Noche</option>
        </select>
        <button onClick={handleConfirm}>Confirmar</button>
      </div>
    </div>
  );
};

export default OperatorModal;