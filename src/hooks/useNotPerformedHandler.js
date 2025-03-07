import { useState } from "react";

function useNotPerformedHandler() {
  const [showNotPerformedInput, setShowNotPerformedInput] = useState(false);
  const [notPerformedReason, setNotPerformedReason] = useState("");

  const handleSelection = (option) => {
    if (option === "No se realizó") {
      setShowNotPerformedInput(true);
    } else {
      resetNotPerformedState();
    }
  };

  const handleNotPerformedSubmit = () => {
    if (notPerformedReason.trim()) {
      resetNotPerformedState();
    }
  };

  const resetNotPerformedState = () => {
    setShowNotPerformedInput(false);
    setNotPerformedReason("");
  };

  return {
    showNotPerformedInput,
    notPerformedReason,
    setNotPerformedReason,
    handleSelection,
    handleNotPerformedSubmit,
    resetNotPerformedState
  };
}

export default useNotPerformedHandler;