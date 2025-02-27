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
    resetAnomalyState
  };
}

export default useAnomalyHandler;
