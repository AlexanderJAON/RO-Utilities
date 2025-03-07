import { useState } from "react";
import useInspectionQuestions from "./useInspectionQuestions";
import useAnomalyHandler from "./useAnomalyHandler";
import useNotPerformedHandler from "./useNotPerformedHandler";
import { generateExcel, sendExcelByEmail } from "./exportToExcel";

const useInspectionForm = (questions, operatorName, shift, date) => {
  const { currentQuestion, handleSelection: handleQuestionSelection, inspectionCompleted, responses } =
    useInspectionQuestions(questions, operatorName, shift);

  const {
    showAnomalyInput,
    anomalyDescription,
    setAnomalyDescription,
    showNoticeQuestion,
    noticeGiven,
    handleSelection: handleAnomalySelection,
    handleAnomalySubmit,
    handleNoticeGiven,
  } = useAnomalyHandler();

  const {
    showNotPerformedInput,
    notPerformedReason,
    setNotPerformedReason,
    handleSelection: handleNotPerformedSelection,
    handleNotPerformedSubmit,
  } = useNotPerformedHandler();

  const handleExport = () => {
    generateExcel(responses, operatorName, shift, date);
    sendExcelByEmail(responses, operatorName, shift, date);
    alert("El reporte de inspección se ha enviado correctamente.");
  };

  const handleAnomalySubmitAndContinue = () => {
    handleAnomalySubmit();
  };

  const handleNoticeGivenAndContinue = (notice) => {
    handleNoticeGiven(notice);
    handleQuestionSelection("Se encontró anomalía", anomalyDescription, notice);
  };

  const handleNotPerformedSubmitAndContinue = () => {
    handleNotPerformedSubmit();
    handleQuestionSelection("No se realizó", "", "", notPerformedReason);
  };

  return {
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
  };
};

export default useInspectionForm;