import { useState } from "react";
import "./ROPTAI.css";
import OperatorModal from "../components/OperatorModal";

function ROPTAI() {
  const [operatorData, setOperatorData] = useState(null);

  const handleOperatorSubmit = (name, shift) => {
    setOperatorData({ name, shift });
  };

  if (!operatorData) {
    return <OperatorModal onSubmit={handleOperatorSubmit} />;
  }

  return (
    <main className="inspection-container">
      <div className="inspection-question">
        <p>
          Verificar que la bomba dosificadora de cloro para el agua oxidada esté encendida
        </p>
      </div>
      <div className="response-buttons">
        <button onClick={() => console.log("No se encontró anomalía")}>No se encontró anomalía</button>
        <button onClick={() => console.log("Se encontró anomalía")}>Se encontró anomalía</button>
        <button onClick={() => console.log("No se realizó")}>No se realizó</button>
      </div>
    </main>
  );
}

export default ROPTAI;
