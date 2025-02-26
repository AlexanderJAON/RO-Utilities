import React, { useState } from "react";
import "./OperatorModal.css";

const OperatorModal = ({ setOperatorName, setShift }) => {
  const [operator, setOperator] = useState("");
  const [selectedShift, setSelectedShift] = useState("");

  const handleConfirm = () => {
    if (operator && selectedShift) {
      setOperatorName(operator);
      setShift(selectedShift);
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
          value={operator}
          onChange={(e) => setOperator(e.target.value)}
        />
        <select value={selectedShift} onChange={(e) => setSelectedShift(e.target.value)}>
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
