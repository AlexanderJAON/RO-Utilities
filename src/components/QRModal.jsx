import { useState } from "react";
import { QrReader } from "react-qr-reader";

function QRModal({ setQrScanned }) {
  const [error, setError] = useState("");

  const handleScan = (result) => {
    if (result) {
      if (result.text === "codigo-valido") { // Ajusta según el QR esperado
        setQrScanned(true);
      } else {
        setError("Código QR inválido, intenta de nuevo.");
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError("Error al acceder a la cámara. Asegúrate de dar permisos.");
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Escanea el código QR</h2>
        <QrReader
          constraints={{ facingMode: "environment" }}
          onResult={handleScan}
          onError={handleError}
          style={{ width: "100%" }}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

export default QRModal;
