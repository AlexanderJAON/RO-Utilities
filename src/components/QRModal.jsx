import { useEffect, useRef, useState } from "react";

function QRModal({ setQrScanned, onQrDetected }) {
  const videoRef = useRef(null);
  const [error, setError] = useState("");
  const [isScanning, setIsScanning] = useState(true);

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

                // Desactivar escaneo para evitar múltiples lecturas rápidas
                setIsScanning(false); 

                // Cerrar la cámara
                stream.getTracks().forEach((track) => track.stop());

                // Llamar a la función que maneja el QR detectado
                onQrDetected(qrValue);

                // Agregar un retraso antes de volver a escanear
                setTimeout(() => {
                  setIsScanning(true);
                }, 3000); // 3 segundos de espera
              } else {
                requestAnimationFrame(scan);
              }
            })
            .catch((err) => console.error(err));
        };

        scan();
      })
      .catch((err) => setError("No se pudo acceder a la cámara."));

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isScanning, onQrDetected]);

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
