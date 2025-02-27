import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function QRModal({ setQrScanned }) {
  const videoRef = useRef(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const hasScanned = useRef(false); // Controla si ya se escaneó un QR válido
  const streamRef = useRef(null); // Guarda la referencia del stream para detenerlo después

  // Mapeo de códigos QR a rutas de la aplicación
  const qrRoutes = {
    "https://ro-utilities.vercel.app/roptai": "/roptai",
    "https://ro-utilities.vercel.app/roptar": "/roptar",
  };

  useEffect(() => {
    if (!("BarcodeDetector" in window)) {
      setError("Tu navegador no soporta la detección de códigos QR.");
      return;
    }

    const barcodeDetector = new BarcodeDetector({ formats: ["qr_code"] });

    const stopCamera = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };

    const scan = async () => {
      if (hasScanned.current || !videoRef.current) return;

      try {
        const track = streamRef.current.getVideoTracks()[0];
        const imageCapture = new ImageCapture(track);
        const bitmap = await imageCapture.grabFrame();
        const barcodes = await barcodeDetector.detect(bitmap);

        if (barcodes.length > 0) {
          const qrValue = barcodes[0].rawValue;

          if (qrRoutes[qrValue]) {
            hasScanned.current = true; // Marcar como escaneado
            stopCamera(); // Detener la cámara antes de navegar
            setQrScanned(true);

            setTimeout(() => {
              navigate(qrRoutes[qrValue]); // Redirigir después de un pequeño delay
            }, 500);
          } else {
            setError("Código QR no reconocido. Intenta nuevamente.");
          }
        }
      } catch (err) {
        console.error(err);
      }

      if (!hasScanned.current) {
        setTimeout(scan, 1000); // Continuar escaneando si aún no se ha encontrado un QR válido
      }
    };

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((videoStream) => {
        streamRef.current = videoStream;
        if (videoRef.current) {
          videoRef.current.srcObject = videoStream;
          videoRef.current.play();
        }
        scan(); // Iniciar escaneo
      })
      .catch(() => setError("No se pudo acceder a la cámara."));

    return stopCamera; // Detener la cámara cuando el componente se desmonte
  }, [setQrScanned, navigate]);

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
