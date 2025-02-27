import { useEffect, useRef, useState } from "react";

function QRModal({ setQrScanned }) {
  const videoRef = useRef(null);
  const [error, setError] = useState("");

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

          barcodeDetector
            .detect(bitmap)
            .then((barcodes) => {
              if (barcodes.length > 0) {
                const qrValue = barcodes[0].rawValue;
                if (qrValue === "codigo-valido") {
                  setQrScanned(true);
                  stream.getTracks().forEach((track) => track.stop()); // Detiene la cámara
                } else {
                  setError("Código QR inválido.");
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
  }, [setQrScanned]);

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
