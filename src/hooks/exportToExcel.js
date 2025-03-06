import * as XLSX from "xlsx";

// 📌 Determinar la URL del servidor según el entorno
const API_URL =
  process.env.NODE_ENV === "production"
    ? `${window.location.origin}/api/send-email` // ✅ URL automática en producción
    : "http://localhost:5000/send-email"; // 🛠️ URL local para desarrollo

export const generateExcel = async (data, operatorName, shift) => {
  try {
    if (!Array.isArray(data)) {
      console.error("❌ Error: 'data' no es un array válido", data);
      return null;
    }

    console.log("📌 Generando Excel para operador:", operatorName, "Turno:", shift);

    const formattedData = data.map((item, index) => ({
      "#": index + 1,
      Pregunta: item.question || "N/A",
      Respuesta: item.response || "N/A",
      "Descripción de la Anomalía": item.anomalyDescription || "No",
      "Aviso Realizado": item.noticeGiven || "No",
    }));

    formattedData.unshift({
      "#": "Operador",
      Pregunta: operatorName || "N/A",
      Respuesta: "Turno",
      "Descripción de la Anomalía": shift || "N/A",
      "Aviso Realizado": "",
    });

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inspección");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    return new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  } catch (error) {
    console.error("❌ Error generando el archivo Excel:", error);
    return null;
  }
};

export const sendExcelByEmail = async (data, operatorName, shift) => {
  try {
    console.log("📌 Iniciando proceso de envío de Excel...");
    const file = await generateExcel(data, operatorName, shift);

    if (!file) {
      console.error("❌ No se pudo generar el archivo Excel.");
      return;
    }

    const fileToSend = new File([file], `Inspeccion_${operatorName}.xlsx`, {
      type: file.type,
    });

    console.log("📌 Archivo generado:", fileToSend.name);
    console.log("📌 Enviando a:", API_URL);

    const formData = new FormData();
    formData.append("file", fileToSend);

    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    console.log("✅ Respuesta del servidor:", result);

    if (!response.ok) {
      throw new Error(`❌ Error al enviar el correo: ${result.message || response.statusText}`);
    }

    alert("✅ El reporte de inspección se ha enviado correctamente.");
  } catch (error) {
    console.error("❌ Error enviando el correo:", error);
    alert("❌ Hubo un problema al enviar el reporte.");
  }
};
