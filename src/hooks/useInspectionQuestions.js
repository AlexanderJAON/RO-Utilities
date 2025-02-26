import { useState } from "react";

const useInspectionQuestions = (initialQuestions) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelection = (option) => {
    setSelectedOption(option);
    if (option === "No se encontró anomalía") {
      if (currentQuestionIndex < initialQuestions.length - 1) {
        setTimeout(() => {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          setSelectedOption(null); // Resetear selección
        }, 500);
      } else {
        alert("Inspección completada.");
      }
    }
  };

  return {
    currentQuestion: initialQuestions[currentQuestionIndex],
    handleSelection,
    selectedOption,
  };
};

export default useInspectionQuestions;
