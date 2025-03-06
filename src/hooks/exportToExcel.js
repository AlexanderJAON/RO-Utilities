import * as XLSX from "xlsx";

export const generateExcel = async (data, operatorName, shift) => {
  try {
    // Validación de data
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

    // Insertar operador y turno en la primera fila
    formattedData.unshift({
      "#": "Operador",
      Pregunta: operatorName || "N/A",
      Respuesta: "Turno",
      "Descripción de la Anomalía": shift || "N/A",
      "Aviso Realizado": "",
    });

    // Crear hoja y libro de Excel
    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inspección");

    // Guardar en un Blob
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
      return;
    }

    // Crear objeto File con nombre correcto
    const fileToSend = new File([file], `Inspeccion_${operatorName}.xlsx`, {
      type: file.type,
    });

    console.log("📌 Archivo generado:", fileToSend.name);

    // Preparar FormData para enviar el archivo
    const formData = new FormData();
    formData.append("file", fileToSend);

    // Enviar al backend
    const response = await fetch("http://localhost:5000/send-email", {
      method: "POST",
      body: formData,
    });

    // Capturar respuesta del backend
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
