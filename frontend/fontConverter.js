/**
 * Gestiona la conversión de archivos de fuentes al formato seleccionado por el usuario.
 * 
 * - Permite seleccionar un archivo de fuente y un formato de conversión (woff, woff2).
 * - Envía la solicitud al servidor para procesar la conversión.
 * - Muestra una barra de progreso mientras la conversión está en curso.
 * - Genera un enlace de descarga para el archivo convertido al finalizar.
 * 
 * Características:
 * - Compatible con formatos de fuente populares: WOFF, WOFF2 y TTF.
 * - Actualiza dinámicamente la interfaz para manejar múltiples solicitudes.
 * - Incluye manejo de errores para solicitudes fallidas.
 */
document.addEventListener("DOMContentLoaded", () => {
  const fontInput = document.getElementById("fontInput");
  const convertFontButton = document.getElementById("convertFontButton");
  const fontDownloadLinksContainer = document.getElementById("fontDownloadLinksContainer");
  const fontFormatSelect = document.getElementById("fontFormatSelect");
  const progressBarContainer = document.getElementById("textProgressBarContainer");
  const progressText = document.getElementById("textProgressText");
  const textProgressBar = document.getElementById("textProgressBar");

  /**
   * Oculta los enlaces de descarga al cambiar el archivo o formato.
   */
  const hideDownloadLinks = () => {
    fontDownloadLinksContainer.innerHTML = ""; 
  };
  fontInput.addEventListener("change", hideDownloadLinks);
  fontFormatSelect.addEventListener("change", hideDownloadLinks);

  
  /**
   * Muestra el contenedor de la barra de progreso.
   */
  const showProgressBar = () => {
    progressBarContainer.classList.remove("hidden");
  };

  /**
   * Actualiza la barra de progreso.
   * 
   * @param {number} percentage - Porcentaje actual de progreso (0-100).
   */
  const updateProgressBar = (percentage) => {
    textProgressBar.style.width = `${percentage}%`;
    progressText.textContent = `Procesando... ${percentage}%`;
  };

  /**
   * Maneja el evento de clic para convertir la fuente seleccionada.
   * 
   * @event click
   */
  convertFontButton.addEventListener("click", async () => {
    // Ocultar enlaces de descarga previos
    hideDownloadLinks();
    // Obtener archivo seleccionado y formato
    const file = fontInput.files[0];
    const selectedFormat = fontFormatSelect.value;

    // Validar si se ha seleccionado un archivo
    if (!file) {
      alert("Por favor, selecciona un archivo de fuente.");
      return;
    }

    try {
      // Desactivar el botón y mostrar la barra de progreso
      convertFontButton.disabled = true;
      showProgressBar();
      updateProgressBar(0);

      // Crear el cuerpo de la solicitud con el archivo y formato
      const formData = new FormData();
      formData.append("font", file);
      formData.append("format", selectedFormat);

      // Realizar la solicitud al servidor
      const response = await fetch('http://localhost:4000/convert-font', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al convertir la fuente.");
      }

      const { downloadUrl, filename } = await response.json();

      // Simular progreso mientras se prepara la respuesta
      let progress = 0;
      const interval = setInterval(() => {
        progress += 25;
        updateProgressBar(Math.min(progress, 100));

        if (progress >= 100) {
          clearInterval(interval);

          // Crear enlace de descarga dinámico
          const downloadLink = document.createElement("a");
          downloadLink.href = downloadUrl; 
          downloadLink.download = filename; 
          downloadLink.textContent = `Descargar ${filename}`;
          downloadLink.className = "w-full bg-green-800 text-white text-center py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500";
          fontDownloadLinksContainer.appendChild(downloadLink);

          // Ocultar la barra de progreso después de un tiempo
          setTimeout(() => {
            progressBarContainer.classList.add("hidden");
          }, 800);
          convertFontButton.disabled = false;
        }
      }, 500); 

    } catch (error) {
      console.error("Error durante la conversión:", error);
      alert("Ocurrió un error al convertir el archivo." );
      convertFontButton.disabled = false;
      progressBarContainer.classList.add("hidden");
    }
  });
});
