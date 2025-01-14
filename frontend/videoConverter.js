/**
 * Maneja el evento de envío del formulario de conversión de video.
 * 
 * - Captura la URL del video y el formato deseado.
 * - Valida los campos antes de enviar la solicitud.
 * - Muestra una barra de progreso mientras el servidor procesa la conversión.
 * - Genera un enlace de descarga para el archivo convertido.
 * 
 * @event submit
 * @param {Event} e - Evento de envío del formulario.
 */
document.getElementById('videoForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const url = document.getElementById('url').value.trim(); 
  const format = document.getElementById('format').value.trim(); 
  const formatSelect = document.getElementById('format'); 
  const downloadLinksContainer = document.getElementById('videoDownloadLinksContainer');
  const progressBarContainer = document.getElementById('videoProgressBarContainer');
  const progressBar = document.getElementById('videoProgressBar');
  const progressText = document.getElementById('videoProgressText');
  const submitButton = document.querySelector('button[type="submit"]');

  // Reiniciar la interfaz antes de comenzar
  downloadLinksContainer.innerHTML = "";
  progressBarContainer.classList.add('hidden');
  progressBar.style.width = '0%';
  progressText.textContent = '';

  // Manejar cambios en los campos del formulario
  formatSelect.addEventListener('change', () => {
    downloadLinksContainer.innerHTML = "";
  });

  document.getElementById('url').addEventListener('input', () => {
    downloadLinksContainer.innerHTML = "";
  });


  // Validar campos obligatorios
  if (!url || !format) {
    alert('Por favor, completa todos los campos.');
    return;
  }
  // Configurar interfaz de usuario para la solicitud
  submitButton.disabled = true;
  progressBarContainer.classList.remove('hidden');

  // Simulación de progreso (visual)
  let simulatedProgress = 5;
  const progressInterval = setInterval(() => {
    if (simulatedProgress < 100) {
      simulatedProgress += 5;
      progressBar.style.width = `${simulatedProgress}%`;
      progressText.textContent = `Descargando... ${simulatedProgress}%`;
    } else {
      progressBar.classList.add('animate-pulse');
      clearInterval(progressInterval);
    }
  }, 500);

  
  /**
   * 
   * Realiza la solicitud de conversión al servidor.
   * 
   * @async
   * @function
   * @param {string} url - URL del video de YouTube a convertir.
   * @param {string} format - Formato deseado para la conversión ('mp3' o 'mp4').
   * @returns {Promise<void>} Agrega un enlace de descarga si la conversión es exitosa.
   */
  fetch('http://localhost:4000/convert-video', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    // Datos enviados al servidor
    body: JSON.stringify({ url, format }), 
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Fallo en la solicitud, comprueba que el video siga existiendo...  --> ${response.statusText}`);
      }
      // Procesar respuesta en formato JSON
      return response.json(); 
    })
    .then((data) => {
      // Crear un enlace de descarga dinámico
      const downloadLink = document.createElement('a');
      downloadLink.href = `http://localhost:4000/download-video/${data.filename}`;
      // downloadLink.href = data.downloadUrl;
      downloadLink.download = data.filename;
      downloadLink.textContent = `Descargar (${format.toUpperCase()})`;
      downloadLink.className =
        "w-full bg-green-800 text-white text-center py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 hover:animate-greenGlow";
      downloadLinksContainer.appendChild(downloadLink);

      // Actualizar el estado de la barra de progreso
      progressBar.style.width = '100%';
      progressText.textContent = '¡Descarga completada!';
    })
    .catch((error) => {
      console.error('Error en la conversión:', error);
      alert(`Error: ${error.message}`);
    })
    .finally(() => {
      // Restaurar el estado de la interfaz
      submitButton.disabled = false;
      setTimeout(() => {
        progressBarContainer.classList.add('hidden');
        progressBar.style.width = '0%';
        progressText.textContent = '';
      }, 800);
    });
});
