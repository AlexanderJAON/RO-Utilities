import * as XLSX from "xlsx";

// 📌 Determinar la URL del servidor según el entorno
const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://ro-utilities.vercel.app/api/send-email" // ✅ URL FIJA PARA PRODUCCIÓN
    : "http://localhost:5000/api/send-email"; // 🛠️ URL LOCAL (AJUSTADO CON /api/)

// 📌 Generar el archivo Excel
export const generateExcel = async (data, operatorName, shift, date) => {
  try {
    if (!Array.isArray(data)) {
      console.error("❌ Error: 'data' no es un array válido", data);
      return null;
    }

    console.log("📌 Generando Excel para operador:", operatorName, "Turno:", shift);

    // Crear la estructura del Excel
    const headers = [
      "Fecha",
      "Turno",
      "Nombre",
      ...data.map(item => item.question),
      "Descripción"
    ];

    const rows = [
      [
        date,
        shift,
        operatorName,
        ...data.map(item => item.response),
        data.map(item => {
          if (item.response === "Se encontró anomalía") {
            return `${item.question}: ${item.anomalyDescription}. ¿Se realizó aviso? ${item.noticeGiven}`;
          } else if (item.response === "No se realizó") {
            return `${item.question}: No se realizó. ¿Por qué? ${item.notPerformedReason}`;
          } else {
            return "";
          }
        }).filter(desc => desc !== "").join(" /// ")
      ]
    ];

    // Crear la hoja de cálculo
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inspección");

    // Generar el buffer del archivo Excel
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    return new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  } catch (error) {
    console.error("❌ Error generando el archivo Excel:", error);
    return null;
  }
};

// 📌 Enviar el archivo Excel por correo
export const sendExcelByEmail = async (data, operatorName, shift, date) => {
  try {
    console.log("📌 Iniciando proceso de envío de Excel...");
    const file = await generateExcel(data, operatorName, shift, date);

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
      headers: {
        enctype: "multipart/form-data", // Asegura la correcta transmisión del archivo
      },
    });

    // 📌 Validar si la respuesta de la API es válida
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error del servidor:", errorText);
      throw new Error(`❌ Error del servidor: ${errorText}`);
    }

    // 📌 Intentar parsear JSON, si falla mostrar error
    let result;
    try {
      result = await response.json();
    } catch (jsonError) {
      throw new Error("❌ La respuesta del servidor no es un JSON válido");
    }

    console.log("✅ Respuesta del servidor:", result);
    alert("✅ El reporte de inspección se ha enviado correctamente.");
  } catch (error) {
    console.error("❌ Error enviando el correo:", error);
    alert("❌ Hubo un problema al enviar el reporte.");
  }
};
