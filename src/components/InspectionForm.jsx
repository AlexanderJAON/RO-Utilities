import React from "react";
import "./InspectionForm.css";

const InspectionForm = ({
  currentQuestion,
  showAnomalyInput,
  anomalyDescription,
  setAnomalyDescription,
  showNoticeQuestion,
  noticeGiven,
  showNotPerformedInput,
  notPerformedReason,
  setNotPerformedReason,
  inspectionCompleted,
  handleQuestionSelection,
  handleAnomalySelection,
  handleAnomalySubmitAndContinue,
  handleNoticeGivenAndContinue,
  handleNotPerformedSelection,
  handleNotPerformedSubmitAndContinue,
  handleExport,
}) => {
  return (
    <main className="inspection-container">
      <div className="inspection-content">
        {!inspectionCompleted ? (
          <>
            <div className="inspection-question">
              <p>
                {showAnomalyInput
                  ? "Describa la anomalía"
                  : showNotPerformedInput
                  ? "¿Por qué no se realizó?"
                  : currentQuestion}
              </p>
            </div>
            <div className="response-buttons">
              {!showAnomalyInput && !showNotPerformedInput ? (
                <>
                  <button onClick={() => handleQuestionSelection("No se encontró anomalía")}>
                    No se encontró anomalía
                  </button>
                  <button onClick={() => handleAnomalySelection("Se encontró anomalía")}>
                    Se encontró anomalía
                  </button>
                  <button onClick={() => handleNotPerformedSelection("No se realizó")}>
                    No se realizó
                  </button>
                </>
              ) : showAnomalyInput ? (
                !showNoticeQuestion ? (
                  <>
                    <textarea
                      placeholder="Describa la anomalía"
                      value={anomalyDescription}
                      onChange={(e) => setAnomalyDescription(e.target.value)}
                    />
                    <button onClick={handleAnomalySubmitAndContinue}>Aceptar</button>
                  </>
                ) : (
                  <>
                    <p>¿Se realizó aviso?</p>
                    <button onClick={() => handleNoticeGivenAndContinue("Sí")}>Sí</button>
                    <button onClick={() => handleNoticeGivenAndContinue("No")}>No</button>
                  </>
                )
              ) : (
                <>
                  <textarea
                    placeholder="¿Por qué no se realizó?"
                    value={notPerformedReason}
                    onChange={(e) => setNotPerformedReason(e.target.value)}
                  />
                  <button onClick={handleNotPerformedSubmitAndContinue}>Aceptar</button>
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
  );
};

export default InspectionForm;