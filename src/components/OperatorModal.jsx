import React, { useState } from "react";
import "./OperatorModal.css";

const OperatorModal = ({ setOperatorName, setShift, setDate }) => {
  const [operator, setOperator] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const handleConfirm = () => {
    if (operator && selectedShift && selectedDate) {
      setOperatorName(operator);
      setShift(selectedShift);
      setDate(selectedDate);
    } else {
      alert("Por favor, ingrese su nombre, seleccione un turno y una fecha.");
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
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <button onClick={handleConfirm}>Confirmar</button>
      </div>
    </div>
  );
};

export default OperatorModal;
