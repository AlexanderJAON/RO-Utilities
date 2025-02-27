import { useState } from "react";

function QRModal({ setQrScanned }) {
  const [qrCode, setQrCode] = useState("");

  const handleScan = () => {
    if (qrCode === "codigo-valido") { // Aquí puedes validar el QR escaneado
      setQrScanned(true);
    } else {
      alert("QR inválido, intenta de nuevo.");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Escanea el código QR</h2>
        <input
          type="text"
          placeholder="Simula escaneo de QR"
          value={qrCode}
          onChange={(e) => setQrCode(e.target.value)}
        />
        <button onClick={handleScan}>Confirmar</button>
      </div>
    </div>
  );
}

export default QRModal;
