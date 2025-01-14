import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import Fontmin from 'fontmin';
import ytdl from 'youtube-dl-exec';
import ffmpeg from 'fluent-ffmpeg';
import { fileURLToPath } from 'url';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
// Instalador de FFmpeg para el Server
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
// Configuración de FFmpeg local
// ffmpeg.setFfmpegPath('C:/ffmpeg/bin/ffmpeg.exe');

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 4000;

// const cookiesPath = path.join(__dirname, 'cookies.txt');
/**
 * Habilita CORS para todas las solicitudes desde el dominio
 */
app.use(cors({
  origin: ['https://nusky7studio.es', 'http://localhost:1234'], 
  methods: ['GET', 'POST', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'],  
  credentials: true,  
  preflightContinue: false,  
}));

app.use(express.json());

// Configuración de multer para manejar la carga de archivos
const upload = multer({ dest: 'uploads/' });

// Crear la carpeta de salida si no existe
const outputDir = path.join(__dirname, 'converted-videos');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

/**
 * POST /convert-video
 * Convierte un video de YouTube a los formatos MP3 o MP4.
 * 
 * - Si el formato es 'mp3', se extrae el audio directamente utilizando youtube-dl-exec.
 * - Si el formato es 'mp4', se intenta descargar el video directamente como MP4. 
 *   Si no está en formato MP4, se realiza una conversión adicional con FFmpeg.
 * 
 * @param {string} url - URL del video de YouTube a convertir.
 * @param {string} format - Formato deseado ('mp3' o 'mp4').
 * @returns {Object} Respuesta con el nombre del archivo generado (en formato JSON) o un mensaje de error.
 * 
 * @throws {Error} Retorna un error 400 si no se proporcionan URL o formato, o si el formato es inválido.
 * @throws {Error} Retorna un error 500 si ocurre un problema durante la descarga o conversión.
 */
app.post('/convert-video', async (req, res) => {
  console.log('Solicitud recibida para conversión:', req.body);

  try {
    const { url, format } = req.body;

    if (!url || !format) {
      console.log('Error: URL o formato no proporcionados.');
      return res.status(400).json({ error: 'URL y formato son necesarios.' });
    }

    if (!['mp3', 'mp4'].includes(format)) {
      console.log('Error: Formato no soportado:', format);
      return res.status(400).json({ error: 'Formato no soportado. Solo se admiten "mp3" y "mp4".' });
    }

    console.log(`Iniciando conversión: URL=${url}, Format=${format}`);
    const outputFileName = `audio-${Date.now()}.${format}`;
    const outputFilePath = path.join(outputDir, outputFileName);

    if (format === 'mp3') {
      console.log('Convirtiendo a MP3...');
      await ytdl(url, {
        extractAudio: true,
        audioFormat: 'mp3',
        output: outputFilePath,
        // cookies: cookiesPath
      }).catch(err => {
        console.error('Error en ytdl para MP3:', err);
        throw new Error('No se pudo extraer el audio en formato MP3.');
      });

      console.log('Conversión a MP3 completada:', outputFilePath);
      return res.json({ filename: outputFileName });
    } else if (format === 'mp4') {
      console.log('Descargando video en MP4...');
      const tempFilePath = path.join(outputDir, `video-${Date.now()}.mp4`);

      try {
        await ytdl(url, {
          format: 'mp4',
          output: tempFilePath,
          // cookies: cookiesPath
        });

        console.log('Video descargado en MP4:', tempFilePath);

        // Verifica si el archivo descargado es MP4 directamente o necesita conversión
      if (path.extname(tempFilePath) === '.mp4') {
        console.log('Archivo descargado ya está en formato MP4, listo para descarga.');
        res.json({ filename: path.basename(tempFilePath) }); // Enviar el nombre del archivo al frontend
      } else {
        console.log('El archivo descargado no está en formato MP4, iniciando conversión con FFmpeg...');
        ffmpeg(tempFilePath)
          .toFormat('mp4')
          .on('end', () => {
            console.log('Conversión a MP4 completada:', outputFilePath);
            fs.unlinkSync(tempFilePath); 
            // Enviar nombre del archivo convertido al front
            res.json({ filename: path.basename(outputFilePath) });
          })
          .on('error', (err) => {
            console.error('Error en FFmpeg para MP4:', err);
            fs.unlinkSync(tempFilePath);
            res.status(500).json({ error: 'Error durante la conversión con FFmpeg.' });
          })
          .save(outputFilePath);
      }

      } catch (err) {
        console.error('Error en ytdl para MP4:', err);
        res.status(500).json({ error: 'No se pudo descargar el video en formato MP4.' });
      }
    }
  } catch (error) {
    console.error('Error general en la conversión:', error);
    res.status(500).json({ error: error.message || 'Error procesando la solicitud.' });
  }
});



/**
 * GET /download-video/:filename
 * Descarga un archivo de video convertido.
 * 
 * @param {string} filename - Nombre del archivo a descargar.
 * @returns {File} Archivo solicitado o un mensaje de error si no se encuentra.
 */
app.get('/download-video/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(outputDir, filename);

  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ error: 'Archivo no encontrado.' });
  }
});


/**
 * POST /convert-font
 * Convierte una fuente cargada a los formatos WOFF, WOFF2 o TTF.
 * 
 * @param {File} font - Archivo de fuente a convertir.
 * @param {string} format - Formato deseado ('woff', 'woff2', 'ttf').
 * @returns {Object} Respuesta con la URL de descarga o un mensaje de error.
 */
const fontOutputDir = path.join(__dirname, 'converted-fonts');
if (!fs.existsSync(fontOutputDir)) {
  fs.mkdirSync(fontOutputDir);
}

app.post('/convert-font', upload.single('font'), async (req, res) => {
  try {
    const { file } = req;
    const format = req.body.format;

    if (!file) {
      return res.status(400).json({ error: 'No se ha proporcionado ningún archivo de fuente.' });
    }

    if (!['woff', 'woff2', 'ttf'].includes(format)) {
      return res.status(400).json({ error: 'Formato no soportado. Solo se admiten "woff", "woff2" y "ttf".' });
    }

    const inputFilePath = path.join(__dirname, file.path);
    const originalFileName = path.basename(file.originalname, path.extname(file.originalname));
    const outputFileName = `${originalFileName}.${format}`;
    const outputFilePath = path.join(fontOutputDir, outputFileName);

    const fontmin = new Fontmin().src(inputFilePath).dest(fontOutputDir);

    if (format === 'woff') {
      fontmin.use(Fontmin.ttf2woff());
    } else if (format === 'woff2') {
      fontmin.use(Fontmin.ttf2woff2());
    }

    await new Promise((resolve, reject) => {
      fontmin.run((err, files) => {
        if (err) {
          console.error('Error en Fontmin:', err);
          return reject(err);
        }

        const generatedFile = files.find(f => f.path.endsWith(`.${format}`));
        if (generatedFile) {
          fs.renameSync(generatedFile.path, outputFilePath);
          console.log(`Archivo renombrado a: ${outputFilePath}`);
        }

        resolve(files);
      });
    });

    fs.unlinkSync(inputFilePath);

    res.json({
      downloadUrl: `http://localhost:${port}/converted-fonts/${outputFileName}`,
      filename: outputFileName,
    });
  } catch (error) {
    console.error('Error durante la conversión de la fuente:', error);
    res.status(500).json({ error: 'Error durante la conversión de la fuente.' });
  }
});


/**
 * Limpia archivos descargados del servidor.
 * 
 * @param {string} folderPath - Ruta de la carpeta a limpiar.
 * @param {number} maxAge - Edad máxima de los archivos en milisegundos.
 */
const cleanOldFiles = (folderPath, maxAge) => {
  const now = Date.now();

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(`Error leyendo la carpeta ${folderPath}:`, err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(folderPath, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error obteniendo estadísticas del archivo ${filePath}:`, err);
          return;
        }

        if (now - stats.mtimeMs > maxAge) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Error eliminando archivo ${filePath}:`, err);
            } else {
              console.log(`Archivo eliminado: ${filePath}`);
            }
          });
        }
      });
    });
  });
};

// Intervalo para limpiar carpetas cada hora
const cleanupInterval = 60 * 60 * 1000; // 1 hora
const maxFileAge = 24 * 60 * 60 * 1000; // 24 horas

setInterval(() => {
  console.log('Iniciando limpieza de archivos antiguos...');
  cleanOldFiles(outputDir, maxFileAge); 
  cleanOldFiles(fontOutputDir, maxFileAge); 
}, cleanupInterval);

// Servir archivos convertidos
app.use('/converted-videos', express.static(outputDir));
app.use('/converted-fonts', express.static(fontOutputDir));

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto:${port}`);
});
