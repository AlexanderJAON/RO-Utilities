import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function QRModal({ setQrScanned }) {
  const videoRef = useRef(null);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(true);
  const navigate = useNavigate();

  // Mapeo de códigos QR a rutas de la aplicación
  const qrRoutes = {
    "https://ro-utilities.vercel.app/roptai": "/roptai",
    "https://ro-utilities.vercel.app/roptar": "/roptar",
    "https://tu-web.com/configuracion": "/configuracion",
    "custom-code-123": "/personalizado",
  };

  useEffect(() => {
    if (!("BarcodeDetector" in window)) {
      setError("Tu navegador no soporta la detección de códigos QR.");
      return;
    }

    let barcodeDetector = new BarcodeDetector({ formats: ["qr_code"] });
    let stream;
    let lastScanTime = 0;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((videoStream) => {
        stream = videoStream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }

        const scanInterval = setInterval(async () => {
          if (!videoRef.current || !scanning) return;

          const now = Date.now();
          if (now - lastScanTime < 1000) return; // Evita escaneos repetidos en menos de 1 segundo

          try {
            const track = stream.getVideoTracks()[0];
            const imageCapture = new ImageCapture(track);
            const bitmap = await imageCapture.grabFrame();
            const barcodes = await barcodeDetector.detect(bitmap);

            if (barcodes.length > 0) {
              const qrValue = barcodes[0].rawValue;
              if (qrRoutes[qrValue]) {
                setScanning(false);
                setQrScanned(true);
                navigate(qrRoutes[qrValue]);

                stream.getTracks().forEach((track) => track.stop());
                clearInterval(scanInterval);
              } else {
                setError("Código QR no reconocido.");
              }

              lastScanTime = now; // Guarda el tiempo del último escaneo exitoso
            }
          } catch (err) {
            console.error(err);
          }
        }, 500); // Escanea cada 500ms

        return () => {
          clearInterval(scanInterval);
          if (stream) {
            stream.getTracks().forEach((track) => track.stop());
          }
        };
      })
      .catch((err) => setError("No se pudo acceder a la cámara."));
  }, [setQrScanned, navigate, scanning]);

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Escanea el código QR</h2>
        {error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <video ref={videoRef} style={{ width: "100%" }} />
        )}
      </div>
    </div>
  );
}

export default QRModal;
