import ExcelJS from 'exceljs';

// 📌 Determinar la URL del servidor según el entorno
const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://ro-utilities.vercel.app/api/send-email" // ✅ URL FIJA PARA PRODUCCIÓN
    : "http://localhost:5000/api/send-email"; // 🛠️ URL LOCAL (AJUSTADO CON /api/)

// 📌 Generar el archivo Excel con formato de tabla
export const generateExcel = async (data, operatorName, shift, date) => {
  try {
    if (!Array.isArray(data)) {
      console.error("❌ Error: 'data' no es un array válido", data);
      return null;
    }

    console.log("📌 Generando Excel con formato de tabla...");

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Inspección");

    // 📌 Definir las cabeceras
    const headers = [
      "Fecha",
      "Turno",
      "Nombre",
      ...data.map(item => item.question),
      "Descripción"
    ];

    // 📌 Agregar los datos
    const rowData = [
      date,
      shift,
      operatorName,
      ...data.map(item => item.response),
      data
        .map(item => {
          if (item.response === "Se encontró anomalía") {
            return `${item.question}: ${item.anomalyDescription}. ¿Se realizó aviso? ${item.noticeGiven}`;
          } else if (item.response === "No se realizó") {
            return `${item.question}: No se realizó. ¿Por qué? ${item.notPerformedReason}`;
          } else {
            return "";
          }
        })
        .filter(desc => desc !== "")
        .join(" /// ")
    ];

    // 📌 Agregar encabezados y filas a la hoja de trabajo
    worksheet.addRow(headers).font = { bold: true }; // Hacer los encabezados en negrita
    worksheet.addRow(rowData);

    // 📌 Crear la tabla con el formato de tabla "TableStyleLight21"
    worksheet.addTable({
      name: 'Inspección',
      ref: 'A1',
      headerRow: true,
      style: {
        theme: 'TableStyleLight21',
        showRowStripes: true,
      },
      columns: headers.map(header => ({ name: header })),
      rows: [rowData],
    });

    worksheet.columns.forEach(col => {
      col.width = 20; // Ajustar ancho de columna automáticamente
    });

    // 📌 Generar el archivo en un buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], {
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

    // Establecer un nombre fijo para el archivo de reporte
    const fileToSend = new File([file], `Reporte_Inspeccion.xlsx`, {
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
