import { useState } from "react";
import useInspectionQuestions from "../hooks/useInspectionQuestions";
import useAnomalyHandler from "../hooks/useAnomalyHandler";
import { generateExcel, sendExcelByEmail } from "../hooks/exportToExcel";
import OperatorModal from "../components/OperatorModal";
import QRModal from "../components/QRModal";
import "./ROPTAI.css";

const questions = [
  "Verificar que la bomba dosificadora de cloro para el agua oxidada esté encendida [ON]",
  "Verificar que la bomba dosificadora de cloro para el agua suave esté encendida[ON]",
  "Verificar la presión de los prefiltros[65-70 psi]",
  "Verificar la presión de los postfiltros[60-65 psi]",
  "Verificar la presión de las premembranas[120-150 psi]",
  "Verificar que la presión de las postmembrana[100-120 psi]",
  "Verificar que el flujo de entrada[60-65 gal x min]",
  "Verificar que el flujo de permeado[35-40 gal x min]",
  "Verificar que el flujo de rechazo[25-30 gal x min]",
  "Verificar la presión de los tres suavizadores[20-35 psi]",
  "¿Se registraron los parametros (ORP, pH, conductividad) del 3D TRAESER?[OK]",
  "¿Se verificó que el equipo 3D TRASAR en las torres de Enfriamiento no estén alarmados?[OK]",
  "Verificar que la flota de la válvula del agua de reposición(make-up) esté funcionando normalmente[OK]",
  "Verificar que la secuencia de los equipos de las torres de enfriamiento  se encuentren en uso adecuado, por ejemplo: Bombas de back-up en línea y no se requieran, todos los ventiladores en línea y la temperatura por debajo de lo normal. etc. etc.[OK]",
  "Verificar que los flujos de salida y retorno en las torres de enfriamiento se mantengan adecuados al proceso, esto se puede evidenciar con el flujo de reposición ( make-up) ideal: bajo flujo[OK]",
  "Verificar el nivel del tambor del químico Nalco PC-191[>10%]",
  "Verificar el nivel del tambor del qupimico Nalco 7408[>10%]",
  "Realizar el lavado de las mallas de la Tayco 1000[OK]"
];

function ROPTAI() {
  const [qrScanned, setQrScanned] = useState(false);
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
