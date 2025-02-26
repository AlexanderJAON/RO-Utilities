import { useState } from "react";
import useInspectionQuestions from "../hooks/useInspectionQuestions";
import OperatorModal from "../components/OperatorModal";
import "./ROPTAI.css";

const questions = [
  "Verificar que la bomba dosificadora de cloro para el agua oxidada esté encendida",
  "Comprobar el nivel de cloro en el tanque",
  "Revisar la presión del sistema de dosificación"
];

function ROPTAI() {
  const { currentQuestion, handleSelection, selectedOption } = useInspectionQuestions(questions);
  const [operatorName, setOperatorName] = useState("");
  const [shift, setShift] = useState("");

  return (
    <>
      {!operatorName || !shift ? (
        <OperatorModal setOperatorName={setOperatorName} setShift={setShift} />
      ) : (
        <main className="inspection-container">
          <div className="inspection-question">
            <p>{currentQuestion}</p>
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
      )}
    </>
  );
}

export default ROPTAI;