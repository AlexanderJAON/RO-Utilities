import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function QRModal({ setQrScanned }) {
  const videoRef = useRef(null);
  const [error, setError] = useState("");
  const [isScanning, setIsScanning] = useState(true); // Controla si se puede escanear
  const navigate = useNavigate();

  // Mapeo de códigos QR a rutas de la aplicación
  const qrRoutes = {
    "https://ro-utilities.vercel.app/roptai": "/roptai",
    "https://ro-utilities.vercel.app/roptar": "/roptar",
    "https://tu-web.com/configuracion": "/configuracion",
    "custom-code-123": "/personalizado", // Puedes usar códigos personalizados
  };

  useEffect(() => {
    if (!("BarcodeDetector" in window)) {
      setError("Tu navegador no soporta la detección de códigos QR.");
      return;
    }

    const barcodeDetector = new BarcodeDetector({ formats: ["qr_code"] });

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }

        const scan = async () => {
          if (!videoRef.current || !isScanning) return;

          const track = stream.getVideoTracks()[0];
          const imageCapture = new ImageCapture(track);
          const bitmap = await imageCapture.grabFrame();

          barcodeDetector
            .detect(bitmap)
            .then((barcodes) => {
              if (barcodes.length > 0) {
                const qrValue = barcodes[0].rawValue;

                // Verificar si el código escaneado está en la lista
                if (qrRoutes[qrValue]) {
                  setIsScanning(false); // Bloquear nuevos escaneos
                  setQrScanned(true);
                  navigate(qrRoutes[qrValue]); // Redirige a la ruta correspondiente

                  // Detener la cámara
                  stream.getTracks().forEach((track) => track.stop());

                  // Permitir un nuevo escaneo después de un tiempo
                  setTimeout(() => {
                    setIsScanning(true);
                  }, 2000); // 3 segundos de espera antes de volver a escanear
                } else {
                  setError("Código QR no reconocido.");
                }
              }
            })
            .catch((err) => console.error(err));

          requestAnimationFrame(scan);
        };

        scan();
      })
      .catch((err) => setError("No se pudo acceder a la cámara."));

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [setQrScanned, navigate, isScanning]);

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
