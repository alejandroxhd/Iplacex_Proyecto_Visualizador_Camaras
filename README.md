# Iplacex_Proyecto_Visualizador_Camaras
Proyecto titulo por Alejandro García Robles

Requisitos de ejecucion modo desarrollo.
NodeJS 18 o superior
Servidor Mysql (Recomendable Xampp)



1) Descargar el backend y ejecutar npm install para instalar las dependencias necesarias.
2) Editar el archivo /Config/db.js y reemplazar las credenciales de acceso a la base de datos según tu entorno.
3) Crear la base de datos utilizando el archivo .sql proporcionado.
4) Descargar la carpeta del frontend y ejecutar npm install para instalar sus dependencias.
5) Descargar FFmpeg para la retransmisión de las cámaras desde https://ffmpeg.org/download.html#build-windows o desde un repositorio compatible en Linux.
6) Iniciar el backend con el comando npm run dev.
7) Iniciar el frontend con el comando npm run serve.
8) El usuario administrador predeterminado es: admin@admin.com Y Contraseña: 1234


Nota: Si se Utiliza en produccion (ejemplo servidor, VPS, hosting etc) dentro del frontend es muy importante reemplazar el llamados de las api por la IP de tu servidor o dominio que aloja el backend, ejemplo http://localhost:3000/api ->> http://40.40.40.40:3000/api o http://contoso.com:3000/api



