/**
 * Inicializa el proceso de conversión de imágenes, gestionando la carga de archivos,
 * la visualización del progreso y la generación de enlaces para descargar las imágenes convertidas.
 * 
 * - Admite hasta 3 imágenes por conversión.
 * - Convierte imágenes al formato seleccionado por el usuario.
 * - Genera enlaces de descarga para las imágenes procesadas.
 * - Compatible con formatos estándar como PNG, JPEG, y WEBP.
 */
document.addEventListener('DOMContentLoaded', () => {
  const convertButton = document.getElementById('convertButton');
  const downloadLinksContainer = document.getElementById('downloadLinksContainer');
  const progressBarContainer = document.getElementById('progressBarContainer');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const fileInput = document.getElementById('fileInput');
  const formatSelect = document.getElementById('formatSelect');

  // Crear canvas para procesar imágenes
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  /**
   * Oculta los enlaces de descarga al cambiar el formato seleccionado.
   * 
   * @event change
   */
  formatSelect.addEventListener('change', () => {
    downloadLinksContainer.innerHTML = "";
    progressBarContainer.classList.add('hidden');
  });

  /**
   * Oculta los enlaces de descarga y el progreso al seleccionar nuevos archivos.
   * 
   * @event change
   */
  fileInput.addEventListener('change', () => {
    downloadLinksContainer.innerHTML = "";
    progressBarContainer.classList.add('hidden');
  });

  /**
   * Convierte las imágenes seleccionadas al formato especificado y genera enlaces de descarga.
   * 
   * @async
   * @event click
   */
  convertButton.addEventListener('click', async () => {
    const files = Array.from(fileInput.files);

    // Validar si se seleccionaron imágenes
    if (files.length === 0) {
      alert('Por favor, selecciona al menos una imagen.');
      return;
    }

    // Limitar a 3 imágenes por conversión
    if (files.length > 3) {
      alert('Solo puedes convertir hasta 3 imágenes a la vez.');
      return;
    }

    const format = formatSelect.value;
    downloadLinksContainer.innerHTML = "";
    progressBarContainer.classList.remove('hidden');
    progressBar.style.width = "0%";
    progressText.textContent = "Procesando...";

    // Procesar cada archivo de imagen
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const originalFileName = file.name.split('.').slice(0, -1).join('.') || "imagen";
      const img = new Image();
      const fileURL = URL.createObjectURL(file);

      /**
       * Dibuja la imagen en el canvas y la convierte al formato seleccionado.
       * 
       * @param {Event} event - Evento de carga de la imagen.
       */
      img.onload = async () => {
        // Establecer las dimensiones del canvas según la imagen
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convertir la imagen a DataURL con el formato seleccionado
        const convertedImg = canvas.toDataURL(`image/${format}`);

        // Crear enlace de descarga para la imagen convertida
        const link = document.createElement('a');
        link.href = convertedImg;
        link.download = `${originalFileName}.${format}`;
        link.textContent = `Descargar ${originalFileName}.${format}`;
        link.className = "w-full bg-green-800 text-white text-center py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 hover:animate-greenGlow";

        // Añadir el enlace al contenedor de enlaces
        downloadLinksContainer.appendChild(link);

        // Actualizar barra de progreso
        const progress = Math.round(((i + 1) / files.length) * 100);
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `Procesando... (${progress}%)`;

        // Finalizar y ocultar la barra de progreso
        if (progress === 100) {
          progressText.classList.add('w-full', 'text-center');
          progressText.textContent = "¡Conversión completa!";
          setTimeout(() => {
            progressBarContainer.classList.add('hidden');
          }, 800);
        }
      };

      img.src = fileURL;
    }
  });

  /**
   * Ajusta el diseño de la página según el ancho de la ventana.
   * 
   * @event resize
   */
  function updateLayout() {
    const container = document.querySelector('.first-container');
    const coffeeTxt = document.getElementById('coffee-txt');
    
    if (window.innerWidth <= 550) {
      container.classList.remove('flex');
      container.classList.add('grid');
      coffeeTxt.classList.remove('left-[-120px]', 'group-hover:left-[-140px]', 'mt-3');
      coffeeTxt.classList.add('whitespace-nowrap', 'top-full', 'ml-6');

    } else {
      container.classList.remove('grid');
      container.classList.add('flex');
      coffeeTxt.classList.remove('whitespace-nowrap', 'top-full', 'ml-6');
      coffeeTxt.classList.add('left-[-120px]', 'group-hover:left-[-140px]', 'mt-3');
    }
  }
  window.addEventListener('resize', updateLayout);
  updateLayout();
});
