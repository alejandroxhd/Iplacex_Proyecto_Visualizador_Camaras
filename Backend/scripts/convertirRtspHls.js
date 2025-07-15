const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Mapa: nombreStream => proceso FFmpeg
const procesos = new Map();

// Inicia un stream RTSP → HLS
function iniciarStream(rtspUrl, nombreArchivo) {
  const carpeta = path.join(__dirname, '../stream', nombreArchivo);

  if (!fs.existsSync(carpeta)) {
    fs.mkdirSync(carpeta, { recursive: true });
  }

  const output = path.join(carpeta, 'index.m3u8');

  const ffmpeg = spawn('ffmpeg', [
    '-i', rtspUrl,
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-tune', 'zerolatency',
    '-c:a', 'aac',
    '-f', 'hls',
    '-hls_time', '2',
    '-hls_list_size', '3',
    '-hls_flags', 'delete_segments',
    output
  ]);

  ffmpeg.stderr.on('data', data => {
    console.log(`FFmpeg [${nombreArchivo}]: ${data}`);
  });

  ffmpeg.on('exit', code => {
    console.log(`FFmpeg finalizó [${nombreArchivo}] con código: ${code}`);
    procesos.delete(nombreArchivo);
  });

  procesos.set(nombreArchivo, ffmpeg);
  return ffmpeg;
}

// Detiene un stream activo y limpia sus archivos
function detenerStream(nombreArchivo) {
  const proceso = procesos.get(nombreArchivo);
  if (proceso) {
    proceso.kill('SIGTERM');

    const carpeta = path.join(__dirname, '../stream', nombreArchivo);
    if (fs.existsSync(carpeta)) {
      fs.rmSync(carpeta, { recursive: true, force: true });
    }

    procesos.delete(nombreArchivo);
    return true;
  }
  return false;
}

// Verifica si un stream ya está activo
function streamActivo(nombreArchivo) {
  return procesos.has(nombreArchivo);
}

// Devuelve todos los nombres de streams activos
function obtenerStreamsActivos() {
  return Array.from(procesos.keys());
}

module.exports = {
  iniciarStream,
  detenerStream,
  streamActivo,
  obtenerStreamsActivos
};
