import * as XLSX from "xlsx";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://ro-utilities.vercel.app/api/send-email"
    : "http://localhost:5000/api/send-email";

const getWeekFileName = () => {
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const weekYear = ${startOfWeek.getFullYear()}_W${Math.ceil((startOfWeek.getDate() + 6) / 7)};
  return Inspecciones_Semana_${weekYear}.xlsx;
};

export const updateWeeklyExcel = async (data, operatorName, shift) => {
  try {
    if (!Array.isArray(data)) {
      console.error("❌ Error: 'data' no es un array válido", data);
      return null;
    }

    console.log("📌 Actualizando Excel semanal para operador:", operatorName, "Turno:", shift);
    
    const fileName = getWeekFileName();
    let wb;

    try {
      const existingFile = await fetch(/path/to/server/storage/${fileName});
      const arrayBuffer = await existingFile.arrayBuffer();
      wb = XLSX.read(arrayBuffer, { type: "array" });
    } catch {
      wb = XLSX.utils.book_new();
    }

    const sheetName = "Semana";
    let ws = wb.Sheets[sheetName] || XLSX.utils.aoa_to_sheet([["Día", "Turno", "Operador", "Pregunta", "Respuesta", "Anomalía", "Aviso"]]);
    
    const day = new Date().toLocaleDateString("es-ES", { weekday: "long" });
    const formattedData = data.map(item => [
      day,
      shift,
      operatorName,
      item.question || "N/A",
      item.response || "N/A",
      item.anomalyDescription || "No",
      item.noticeGiven || "No"
    ]);
    
    XLSX.utils.sheet_add_aoa(ws, formattedData, { origin: -1 });
    wb.Sheets[sheetName] = ws;

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    return new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  } catch (error) {
    console.error("❌ Error actualizando el archivo Excel semanal:", error);
    return null;
  }
};

export const sendWeeklyExcel = async (data, operatorName, shift) => {
  try {
    console.log("📌 Iniciando proceso de actualización y envío de Excel semanal...");
    const file = await updateWeeklyExcel(data, operatorName, shift);

    if (!file) {
      console.error("❌ No se pudo actualizar el archivo Excel.");
      return;
    }

    const fileToSend = new File([file], getWeekFileName(), { type: file.type });
    console.log("📌 Archivo generado:", fileToSend.name);
    console.log("📌 Enviando a:", API_URL);

    const formData = new FormData();
    formData.append("file", fileToSend);

    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(❌ Error del servidor: ${errorText});
    }

    console.log("✅ Respuesta del servidor:", await response.json());
    alert("✅ El reporte de inspección semanal se ha actualizado y enviado correctamente.");
  } catch (error) {
    console.error("❌ Error enviando el correo:", error);
    alert("❌ Hubo un problema al enviar el reporte.");
  }
};
