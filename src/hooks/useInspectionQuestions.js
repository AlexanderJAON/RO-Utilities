import { useState } from "react";

const useInspectionQuestions = (initialQuestions, operatorName, shift) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [inspectionCompleted, setInspectionCompleted] = useState(false);

  const handleSelection = (option, anomalyDescription = "", noticeGiven = "", notPerformedReason = "") => {
    const newResponse = {
      question: initialQuestions[currentQuestionIndex],
      response: option,
      anomalyDescription: option === "Se encontró anomalía" ? anomalyDescription : "",
      noticeGiven: option === "Se encontró anomalía" ? noticeGiven : "",
      notPerformedReason: option === "No se realizó" ? notPerformedReason : ""
    };

    const updatedResponses = [...responses, newResponse];

    setResponses(updatedResponses);

    if (currentQuestionIndex < initialQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setInspectionCompleted(true);
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
