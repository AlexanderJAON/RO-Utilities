import { useState } from "react";

function useAnomalyHandler() {
  const [showAnomalyInput, setShowAnomalyInput] = useState(false);
  const [anomalyDescription, setAnomalyDescription] = useState("");
  const [showNoticeQuestion, setShowNoticeQuestion] = useState(false);
  const [noticeGiven, setNoticeGiven] = useState(null);

  const handleSelection = (option) => {
    if (option === "Se encontró anomalía") {
      setShowAnomalyInput(true);
    } else {
      resetAnomalyState();
    }
  };

  const handleAnomalySubmit = () => {
    if (anomalyDescription.trim()) {
      setShowNoticeQuestion(true);
    }
  };

  const handleNoticeGiven = (notice) => {
    setNoticeGiven(notice);
    setAnomalyDescription((prev) => `${prev}. ¿Se realizó aviso? ${notice}`);
    setShowNoticeQuestion(false); // Ocultar la pregunta de aviso después de seleccionar
    setShowAnomalyInput(false); // Ocultar el input de descripción después de seleccionar
    setAnomalyDescription(""); // Limpiar el input de descripción después de seleccionar
  };

  const resetAnomalyState = () => {
    setShowAnomalyInput(false);
    setAnomalyDescription("");
    setShowNoticeQuestion(false);
    setNoticeGiven(null);
  };

  return {
    showAnomalyInput,
    anomalyDescription,
    setAnomalyDescription,
    showNoticeQuestion,
    noticeGiven,
    setNoticeGiven,
    handleSelection,
    handleAnomalySubmit,
    handleNoticeGiven,
    resetAnomalyState
  };
}

export default useAnomalyHandler;