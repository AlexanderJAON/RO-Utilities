import { useState } from "react";
import useInspectionForm from "../hooks/useInspectionForm";
import OperatorModal from "../components/OperatorModal";
import QRModal from "../components/QRModal";
import InspectionForm from "../components/InspectionForm";
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
  const [qrScanned, setQrScanned] = useState(true);
  const [operatorName, setOperatorName] = useState("");
  const [shift, setShift] = useState("");
  const [date, setDate] = useState("");

  const inspectionFormProps = useInspectionForm(questions, operatorName, shift, date);

  return (
    <>
      {!qrScanned ? (
        <QRModal setQrScanned={setQrScanned} />
      ) : !operatorName || !shift || !date ? (
        <OperatorModal setOperatorName={setOperatorName} setShift={setShift} setDate={setDate} />
      ) : (
        <InspectionForm {...inspectionFormProps} />
      )}
    </>
  );
}

export default ROPTAI;
