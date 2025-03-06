import { useState } from "react";
import { generateExcel, sendExcelByEmail } from "./exportToExcel";

const useInspectionQuestions = (initialQuestions, operatorName, shift) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [inspectionCompleted, setInspectionCompleted] = useState(false);

  // Obtener la fecha actual en formato YYYY-MM-DD
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Extrae solo la parte de la fecha
  };

  const handleSelection = (option, anomalyDescription = "", noticeGiven = "") => {
    const newResponse = {
      date: getCurrentDate(), // Agrega la fecha a cada respuesta
      question: initialQuestions[currentQuestionIndex],
      response: option,
      anomalyDescription: option === "Se encontró anomalía" ? anomalyDescription : "",
      noticeGiven: option === "Se encontró anomalía" ? noticeGiven : "",
    };

    const updatedResponses = [...responses, newResponse];

    setResponses(updatedResponses);

    if (currentQuestionIndex < initialQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setInspectionCompleted(true);

      generateExcel(updatedResponses, operatorName, shift)
        .then((filePath) => {
          sendExcelByEmail(filePath);
        })
        .catch((error) => console.error("❌ Error generando/enviando el Excel:", error));
    }
  };

  return {
    currentQuestion: initialQuestions[currentQuestionIndex],
    handleSelection,
    responses,
    inspectionCompleted,
  };
};

export default useInspectionQuestions;
