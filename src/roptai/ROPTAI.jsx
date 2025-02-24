import { useState } from "react";
import "./ROPTAI.css";

function ROPETAI() {
  const [selectedOpction, setSelectedOption] = useState("null");

  const handleSelection = (option) => {
    setSelectedOption(option);
    console.log("Opcion seleccionada:", option);
  };
  return (
      <main className="inspection-container">
        <div className="inspection-question">
          <p>
            Verificar que la bomba dosificadora de cloro para el agua oxidada
            esté encendida
          </p>
        </div>
        <div className="response-buttons">
          <button onClick={() => handleSelection("No se encontró anomalía")}>
            No se encontró anomalía
          </button>
          <button onClick={() => handleSelection("Se encontró anomalía")}>
            Se encontró anomalía
          </button>
          <button onClick={() => handleSelection("No se realizó")}>
            No se realizó
          </button>
        </div>
      </main>
  );
}
export default ROPETAI;
