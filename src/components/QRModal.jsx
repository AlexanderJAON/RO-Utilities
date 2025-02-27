import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function QRModal({ setQrScanned }) {
  const videoRef = useRef(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const hasScanned = useRef(false); // Controla si ya se escaneó un QR válido
  const streamRef = useRef(null); // Guarda la referencia del stream para detenerlo después

  const normalizeUrl = (url) => url.replace(/\/$/, ""); // Elimina `/` final

  const qrRoutes = {
    [normalizeUrl("https://ro-utilities.vercel.app/roptai")]: "/roptai",
    [normalizeUrl("https://ro-utilities.vercel.app/roptar")]: "/roptar",
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
          if (!videoRef.current) return;
          const track = stream.getVideoTracks()[0];
          const imageCapture = new ImageCapture(track);
          const bitmap = await imageCapture.grabFrame();

          const barcodes = await barcodeDetector.detect(bitmap);

          // Dentro del escaneo:
          const qrValue = normalizeUrl(barcodes[0].rawValue);
          if (barcodes.length > 0) {
            const qrValue = barcodes[0].rawValue;
            console.log("QR Detectado:", qrValue); // 🟢 Agregar log de depuración

            if (qrRoutes[qrValue]) {
              setQrScanned(true);
              navigate(qrRoutes[qrValue], { replace: true });
              stream.getTracks().forEach((track) => track.stop());
              return;
            } else {
              setError("Código QR no reconocido.");
            }
          }

          requestAnimationFrame(scan);
        };

        scan();
      })
      .catch(() => setError("No se pudo acceder a la cámara."));

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
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
