import { useState } from "react";
import useInspectionQuestions from "../hooks/useInspectionQuestions";
import useAnomalyHandler from "../hooks/useAnomalyHandler";
import { generateExcel, sendExcelByEmail } from "../hooks/exportToExcel";
import OperatorModal from "../components/OperatorModal";
import QRModal from "../components/QRModal";
import "./ROPTAI.css";

const questions = [
  "Verificar que la bomba dosificadora de cloro para el agua oxidada esté encendida",
  "Comprobar el nivel de cloro en el tanque",
  "Revisar la presión del sistema de dosificación",
];

function ROPTAI() {
  const [qrScanned, setQrScanned] = useState(true);
  const [operatorName, setOperatorName] = useState("");
  const [shift, setShift] = useState("");

  const { currentQuestion, handleSelection: handleQuestionSelection, inspectionCompleted, responses } =
    useInspectionQuestions(questions, operatorName, shift);

  const {
    showAnomalyInput,
    anomalyDescription,
    setAnomalyDescription,
    showNoticeQuestion,
    noticeGiven,
    setNoticeGiven,
    handleSelection,
    handleAnomalySubmit,
  } = useAnomalyHandler();

  const handleExport = () => {
    generateExcel(responses, operatorName, shift);
    sendExcelByEmail(responses, operatorName, shift);
    alert("El reporte de inspección se ha enviado correctamente.");
  };

  return (
    <>
      {!qrScanned ? (
        <QRModal setQrScanned={setQrScanned} />
      ) : !operatorName || !shift ? (
        <OperatorModal setOperatorName={setOperatorName} setShift={setShift} />
      ) : (
        <main className="inspection-container">
          <div className="inspection-content">
            {!inspectionCompleted ? (
              <>
                <div className="inspection-question">
                  <p>{showAnomalyInput ? "Describa la anomalía" : currentQuestion}</p>
                </div>
                <div className="response-buttons">
                  {!showAnomalyInput ? (
                    <>
                      <button onClick={() => handleQuestionSelection("No se encontró anomalía")}>
                        No se encontró anomalía
                      </button>
                      <button onClick={() => handleSelection("Se encontró anomalía")}>Se encontró anomalía</button>
                      <button onClick={() => handleSelection("No se realizó")}>No se realizó</button>
                    </>
                  ) : !showNoticeQuestion ? (
                    <>
                      <textarea
                        placeholder="Describa la anomalía"
                        value={anomalyDescription}
                        onChange={(e) => setAnomalyDescription(e.target.value)}
                      />
                      <button onClick={handleAnomalySubmit}>Aceptar</button>
                    </>
                  ) : (
                    <>
                      <p>¿Se realizó aviso?</p>
                      <button onClick={() => setNoticeGiven("Sí")}>Sí</button>
                      <button onClick={() => setNoticeGiven("No")}>No</button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <h2>Inspección completada</h2>
                <button onClick={handleExport}>Enviar Excel por Correo</button>
              </>
            )}
          </div>
        </main>
      )}
    </>
  );
}

export default ROPTAI;
